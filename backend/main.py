from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import uuid
import os

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
        "summary": f"{gene} {phenotype} phenotype may affect response to {drug}. "
        f"Dose adjustment or alternative therapy may be needed.",
        "provider": "fallback",
    }


def generate_explanation(gene: str, phenotype: str, drug: str, risk_label: str):
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
            "You are a clinical pharmacogenomics assistant. "
            "Generate a concise, patient-safe explanation in 2-3 sentences. "
            "Do not provide definitive medical advice.\n\n"
            f"Drug: {drug.upper()}\n"
            f"Gene: {gene}\n"
            f"Phenotype: {phenotype}\n"
            f"Risk label: {risk_label}\n"
            "Focus on why this genotype may affect response and what clinician follow-up is appropriate."
        )

        response = client.responses.create(model=model_name, input=prompt)
        text = (response.output_text or "").strip()

        if not text:
            explanation = _fallback_explanation(gene, phenotype, drug)
            explanation["reason"] = "OpenAI returned empty response"
            return explanation

        return {"summary": text, "provider": "openai", "model": model_name}
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
    explanation = generate_explanation(gene, phenotype, drug, risk["risk_label"])

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
            "note": "Refer to CPIC guidelines before prescribing."
        },
        "llm_generated_explanation": explanation,
        "quality_metrics": {
            "json_parsing_success": True,
            "supported_drug": True,
            "supported_gene": True,
        },
    }

    return response
