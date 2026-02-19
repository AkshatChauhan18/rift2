import { AnalysisResult } from "@/utils/mockData";
import { parseVcfFile, buildPharmaProfile } from "@/utils/vcfParser";

// API Configuration
// Uses Vite env var when available, with Render fallback for production.
const API_BASE = import.meta.env.VITE_API_URL || "https://rift2.onrender.com";

/**
 * Analyze VCF file using the backend API
 */
export async function analyzeRisk(
  file: File,
  drugs: string[]
): Promise<AnalysisResult> {
  try {
    console.log("🔄 Starting analysis...");
    console.log("📁 File:", file.name, file.size, "bytes");
    console.log("💊 Drugs:", drugs);
    
    // Read file content
    const fileContent = await file.text();
    console.log("📄 File content length:", fileContent.length);

    // Parse VCF file
    const variants = parseVcfFile(fileContent);
    console.log(`🧬 Parsed ${variants.length} variants from VCF`);
    
    if (variants.length === 0) {
      throw new Error("No valid pharmacogenomic variants found in VCF file");
    }

    // Analyze first drug (or loop for multiple drugs)
    const drug = drugs[0].toUpperCase();
    
    // Build pharmacogenomic profile
    const pharmaProfile = buildPharmaProfile(variants, drug);
    console.log("🔬 Pharmacogenomic profile:", pharmaProfile);
    console.log("📊 CPIC Confidence Score:", pharmaProfile.confidence);
    console.log("🎯 Risk Level:", pharmaProfile.risk_level);

    // Create JSON payload matching backend schema
    const payload = {
      drug: drug,
      primary_gene: pharmaProfile.primary_gene,
      diplotype: pharmaProfile.diplotype,
      phenotype: pharmaProfile.phenotype,
      detected_variants: pharmaProfile.detected_variants,
      confidence: pharmaProfile.confidence,
      cpic_evidence: pharmaProfile.cpic_evidence,
      risk_level: pharmaProfile.risk_level,
      include_explanation: false,
    };

    console.log("📤 Sending request to:", `${API_BASE}/analyze`);
    console.log("📦 Payload:", JSON.stringify(payload, null, 2));

    // Call backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for AI processing

    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📥 Response status:", res.status, res.statusText);

    if (!res.ok) {
      // Try to parse error response
      let errorMessage = `Server returned ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        console.error("❌ Error response:", errorData);
        
        // Handle different error formats
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          // FastAPI format - detail can be string or array
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            // Validation errors array
            errorMessage = errorData.detail.map((err: any) => {
              if (typeof err === 'string') return err;
              if (err.msg) return `${err.loc?.join('.') || 'Field'}: ${err.msg}`;
              return JSON.stringify(err);
            }).join(', ');
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          // Fallback: stringify the entire error object
          errorMessage = JSON.stringify(errorData, null, 2);
        }
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        // If JSON parsing fails, try to get text
        try {
          const errorText = await res.text();
          if (errorText) {
            errorMessage = errorText.substring(0, 200); // Limit length
          }
        } catch {
          // Use default error message
        }
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log("✅ Analysis complete!");
    console.log("📊 Full Response:", JSON.stringify(data, null, 2));
    console.log("🔍 Response structure:", {
      patient_id: data.patient_id,
      drug: data.drug,
      risk_label: data.risk_assessment?.risk_label,
      severity: data.risk_assessment?.severity,
      confidence: data.risk_assessment?.confidence_score,
      gene: data.pharmacogenomic_profile?.primary_gene,
      phenotype: data.pharmacogenomic_profile?.phenotype,
      has_explanation: !!data.llm_generated_explanation,
      has_recommendation: !!data.clinical_recommendation
    });

    // Transform backend response to match frontend AnalysisResult interface
    const result: AnalysisResult = {
      patient_id: data.patient_id || `PG-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      drug: data.drug || drugs[0].toUpperCase(),
      timestamp: data.timestamp || new Date().toISOString(),
      risk_assessment: {
        risk_label: data.risk_assessment?.risk_label || "poop",
        confidence_score: data.risk_assessment?.confidence_score || 0.5,
        severity: data.risk_assessment?.severity || "none",
      },
      pharmacogenomic_profile: {
        primary_gene: data.pharmacogenomic_profile?.primary_gene || "Unknown",
        diplotype: data.pharmacogenomic_profile?.diplotype || "*1/*1",
        phenotype: data.pharmacogenomic_profile?.phenotype || "Normal Metabolizer",
        detected_variants: data.pharmacogenomic_profile?.detected_variants || [],
      },
      clinical_recommendation: {
        summary: data.clinical_recommendation?.summary || "No recommendation available.",
        dosage_recommendation: data.clinical_recommendation?.dosage_recommendation || "Consult healthcare provider.",
        warnings: data.clinical_recommendation?.warnings || ["Consult healthcare provider"],
      },
      llm_generated_explanation: {
        summary: data.llm_generated_explanation?.summary || "Select a variant to generate an AI summary.",
        detailed_explanation: data.llm_generated_explanation?.detailed_explanation || "Variant-specific explanation will be generated after selecting a variant.",
        biological_mechanism: data.llm_generated_explanation?.biological_mechanism || "No variant selected yet.",
        variant_explanation: data.llm_generated_explanation?.variant_explanation || "Click a variant from the list to continue.",
      },
      quality_metrics: {
        vcf_parsing_success: data.quality_metrics?.json_parsing_success ?? true,
        variants_analyzed: data.pharmacogenomic_profile?.detected_variants?.length || 0,
        gene_coverage: data.quality_metrics?.gene_coverage || data.quality_metrics?.supported_gene ? 100 : 0,
      },
    };

    return result;
  } catch (error) {
    console.error("❌ Analysis failed:", error);
    
    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Request timeout: The server took too long to respond. Please try again.");
    }
    
    // Handle network errors
    if (error instanceof TypeError) {
      throw new Error("Network error: Unable to connect to the server. Please check your internet connection and ensure the backend is running.");
    }
    
    // Handle Error objects
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    
    // Fallback for unknown errors
    console.error("Unknown error type:", typeof error, error);
    throw new Error("An unexpected error occurred. Please try again or contact support.");
  }
}

export interface VariantSummaryInput {
  drug: string;
  primary_gene: string;
  diplotype: string;
  phenotype: string;
  variant: {
    rsid: string;
    gene: string;
    variant_info?: string;
  };
}

export interface VariantSummaryResponse {
  variant: {
    rsid: string;
    gene: string;
    variant_info?: string;
  };
  pharmacogenomic_profile: {
    primary_gene: string;
    diplotype: string;
    phenotype: string;
  };
  clinical_recommendation: {
    summary: string;
    dosage_recommendation: string;
    warnings: string[];
  };
  llm_generated_explanation: {
    summary: string;
    detailed_explanation: string;
    biological_mechanism: string;
    variant_explanation: string;
  };
  provider?: string;
}

export async function analyzeVariantSummary(
  input: VariantSummaryInput
): Promise<VariantSummaryResponse> {
  const res = await fetch(`${API_BASE}/variant-summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      drug: input.drug,
      primary_gene: input.primary_gene,
      diplotype: input.diplotype,
      phenotype: input.phenotype,
      variant_rsid: input.variant.rsid,
      variant_gene: input.variant.gene,
      variant_info: input.variant.variant_info,
    }),
  });

  if (!res.ok) {
    let message = `Server returned ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      message = errorData?.detail || errorData?.message || message;
    } catch {
      // ignore JSON parse failure and keep default message
    }
    throw new Error(message);
  }

  const data = await res.json();
  return data as VariantSummaryResponse;
}

// Backend health check
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/`, {
      method: "GET",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Supported drugs (hardcoded - matches backend)
export async function getSupportedDrugs(): Promise<string[]> {
  return [
    "CODEINE",
    "WARFARIN",
    "CLOPIDOGREL",
    "SIMVASTATIN",
    "AZATHIOPRINE",
    "FLUOROURACIL",
  ];
}

// Supported genes (hardcoded - matches backend)
export async function getSupportedGenes(): Promise<string[]> {
  return ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"];
}
