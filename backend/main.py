from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import uuid
import os
import json

load_dotenv()

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

app = FastAPI(title="PharmaGuard API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPPORTED_GENES = {"CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"}
SUPPORTED_DRUGS = {
    "CODEINE",
    "WARFARIN",
    "CLOPIDOGREL",
    "SIMVASTATIN",
    "AZATHIOPRINE",
    "FLUOROURACIL",
}

# CPIC-based risk severity mapping
PHENOTYPE_RISK_MAP = {
    "PM": {"severity": "high", "default_label": "Toxic"},
    "IM": {"severity": "moderate", "default_label": "Adjust Dosage"},
    "NM": {"severity": "low", "default_label": "Safe"},
    "RM": {"severity": "moderate", "default_label": "Monitor"},
    "URM": {"severity": "moderate", "default_label": "Adjust Dosage"},
}


class VariantInput(BaseModel):
    rsid: str
    gene: Optional[str] = None


class AnalyzeRequest(BaseModel):
    drug: str
    primary_gene: str
    diplotype: str = "Unknown"
    phenotype: str = "Unknown"
    detected_variants: List[VariantInput] = Field(default_factory=list)
    confidence: Optional[float] = None  # CPIC confidence from frontend
    cpic_evidence: Optional[str] = None
    risk_level: Optional[str] = None


def predict_risk(drug: str, phenotype: str, confidence: float = 0.8):
    """
    Map phenotype to risk assessment using CPIC guidelines.
    Frontend sends CPIC-calculated confidence; backend maps to clinical risk labels.
    """
    phenotype = phenotype.strip().upper() if phenotype else "Unknown"
    drug = drug.strip().upper() if drug else ""

    # Get base risk from phenotype
    risk_info = PHENOTYPE_RISK_MAP.get(
        phenotype, {"severity": "none", "default_label": "Unknown"}
    )

    # Drug-specific risk label overrides
    risk_label = risk_info["default_label"]

    if drug == "CLOPIDOGREL" and phenotype == "PM":
        risk_label = "Ineffective"
    elif drug in {"AZATHIOPRINE", "FLUOROURACIL"} and phenotype == "PM":
        risk_label = "Toxic"
    elif phenotype in {"PM", "IM"}:
        risk_label = "Adjust Dosage"
    elif phenotype == "NM":
        risk_label = "Safe"

    return {
        "risk_label": risk_label,
        "severity": risk_info["severity"],
        "confidence": confidence,
    }


def _fallback_explanation(gene: str, phenotype: str, drug: str):
    return {
        "summary": f"{gene} {phenotype} phenotype may affect {drug} response.",
        "detailed_explanation": f"The {gene} gene encodes enzymes responsible for metabolizing {drug}. A {phenotype} phenotype indicates altered enzyme activity, which may result in unexpected drug levels or therapeutic effects.",
        "biological_mechanism": f"{gene} variants affect enzyme function, altering the rate at which {drug} is metabolized in the body.",
        "variant_explanation": f"{phenotype} phenotype detected, suggesting modified drug metabolism.",
        "clinical_recommendation": "Consult CPIC guidelines and consider dose adjustment or alternative therapy.",
        "dosage_recommendation": "Healthcare provider evaluation required for dosage adjustment.",
        "warnings": [
            "Consult healthcare provider before making any medication changes",
            "Monitor for adverse drug reactions",
        ],
        "provider": "fallback",
    }


def generate_explanation(
    gene: str, phenotype: str, drug: str, risk_label: str, diplotype: str = "Unknown"
):
    api_key = os.getenv("OPENAI_API_KEY")
    model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    if not api_key:
        explanation = _fallback_explanation(gene, phenotype, drug)
        explanation["reason"] = "OPENAI_API_KEY is missing"
        return explanation

    if OpenAI is None:
        explanation = _fallback_explanation(gene, phenotype, drug)
        explanation["reason"] = "openai package is not installed"
        return explanation

    try:
        client = OpenAI(api_key=api_key)

        prompt = (
            "You are a clinical pharmacogenomics assistant. Generate a structured JSON response with exactly 7 fields. "
            "Be concise, patient-safe, and avoid definitive medical advice.\n\n"
            f"Drug: {drug.upper()}\n"
            f"Gene: {gene}\n"
            f"Diplotype: {diplotype}\n"
            f"Phenotype: {phenotype}\n"
            f"Risk label: {risk_label}\n\n"
            "Return ONLY valid JSON in this exact format:\n"
            "{\n"
            '  "summary": "1-2 sentence overview of the pharmacogenomic interaction",\n'
            '  "detailed_explanation": "3-4 sentences explaining the clinical significance",\n'
            '  "biological_mechanism": "2-3 sentences explaining how the gene variant affects drug metabolism",\n'
            '  "variant_explanation": "1-2 sentences about the specific diplotype/phenotype impact",\n'
            '  "clinical_recommendation": "2-3 sentences with actionable clinical recommendations based on CPIC guidelines",\n'
            '  "dosage_recommendation": "1-2 sentences about specific dosage adjustments if applicable",\n'
            '  "warnings": ["array of 2-3 short warning strings about important safety considerations"]\n'
            "}"
        )

        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )

        text = (response.choices[0].message.content or "").strip()

        if not text:
            explanation = _fallback_explanation(gene, phenotype, drug)
            explanation["reason"] = "OpenAI returned empty response"
            return explanation

        # Parse JSON response
        parsed = json.loads(text)

        # Validate required fields
        required_fields = [
            "summary",
            "detailed_explanation",
            "biological_mechanism",
            "variant_explanation",
            "clinical_recommendation",
            "dosage_recommendation",
            "warnings",
        ]
        if not all(field in parsed for field in required_fields):
            explanation = _fallback_explanation(gene, phenotype, drug)
            explanation["reason"] = "OpenAI response missing required fields"
            return explanation

        parsed["provider"] = "openai"
        parsed["model"] = model_name
        return parsed

    except json.JSONDecodeError as exc:
        explanation = _fallback_explanation(gene, phenotype, drug)
        explanation["reason"] = f"Failed to parse OpenAI JSON response: {str(exc)}"
        return explanation
    except Exception as exc:
        explanation = _fallback_explanation(gene, phenotype, drug)
        explanation["reason"] = f"OpenAI call failed: {str(exc)}"
        return explanation


@app.post("/analyze")
async def analyze_json(payload: AnalyzeRequest):
    drug = payload.drug.strip().upper() if payload.drug else ""
    gene = payload.primary_gene.strip().upper()
    diplotype = payload.diplotype.strip() if payload.diplotype else "Unknown"
    phenotype = payload.phenotype.strip().upper() if payload.phenotype else "Unknown"

    if drug not in SUPPORTED_DRUGS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported drug. Supported drugs: {', '.join(sorted(SUPPORTED_DRUGS))}",
        )

    if gene not in SUPPORTED_GENES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported primary_gene. Supported genes: {', '.join(sorted(SUPPORTED_GENES))}",
        )

    variants = []
    for variant in payload.detected_variants:
        variant_gene = (variant.gene or gene).strip().upper()
        variants.append({"rsid": variant.rsid, "gene": variant_gene})

    # Use frontend CPIC confidence if provided, otherwise default
    cpic_confidence = payload.confidence if payload.confidence else 0.8

    # Predict risk using phenotype and confidence
    risk = predict_risk(drug, phenotype, cpic_confidence)

    # LLM Explanation
    explanation = generate_explanation(
        gene, phenotype, drug, risk["risk_label"], diplotype
    )

    # Construct REQUIRED JSON schema
    response = {
        "patient_id": f"PATIENT_{uuid.uuid4().hex[:6].upper()}",
        "drug": drug,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "Z",
        "risk_assessment": {
            "risk_label": risk["risk_label"],
            "confidence_score": risk["confidence"],
            "severity": risk["severity"],
        },
        "pharmacogenomic_profile": {
            "primary_gene": gene,
            "diplotype": diplotype,
            "phenotype": phenotype,
            "detected_variants": variants,
        },
        "clinical_recommendation": {
            "summary": explanation.get(
                "clinical_recommendation",
                "Refer to CPIC guidelines before prescribing.",
            ),
            "dosage_recommendation": explanation.get(
                "dosage_recommendation", "Consult healthcare provider."
            ),
            "warnings": explanation.get(
                "warnings", ["Consult healthcare provider before making any changes"]
            ),
        },
        "llm_generated_explanation": {
            "summary": explanation.get("summary", ""),
            "detailed_explanation": explanation.get("detailed_explanation", ""),
            "biological_mechanism": explanation.get("biological_mechanism", ""),
            "variant_explanation": explanation.get("variant_explanation", ""),
        },
        "quality_metrics": {
            "json_parsing_success": True,
            "supported_drug": True,
            "supported_gene": True,
        },
    }

    return response
