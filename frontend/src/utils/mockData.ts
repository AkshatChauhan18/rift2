export interface AnalysisResult {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: {
    risk_label: "Safe" | "Adjust Dosage" | "Toxic" | "Ineffective" | "Unknown";
    confidence_score: number;
    severity: "none" | "low" | "moderate" | "high" | "critical";
  };
  pharmacogenomic_profile: {
    primary_gene: string;
    diplotype: string;
    phenotype: string;
    detected_variants: Array<{
      rsid: string;
      gene: string;
      variant_info?: string;
    }>;
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
  quality_metrics: {
    vcf_parsing_success: boolean;
    variants_analyzed: number;
    gene_coverage: number;
  };
}

export const mockResult: AnalysisResult = {
  patient_id: "PG-2026-00142",
  drug: "CODEINE",
  timestamp: new Date().toISOString(),
  risk_assessment: {
    risk_label: "Toxic",
    confidence_score: 0.92,
    severity: "high",
  },
  pharmacogenomic_profile: {
    primary_gene: "CYP2D6",
    diplotype: "*1/*2",
    phenotype: "Ultra-rapid Metabolizer",
    detected_variants: [
      { rsid: "rs3892097", gene: "CYP2D6", variant_info: "c.506-1G>A — splice defect" },
      { rsid: "rs1065852", gene: "CYP2D6", variant_info: "c.100C>T — Pro34Ser missense" },
      { rsid: "rs16947", gene: "CYP2D6", variant_info: "c.886C>T — Arg296Cys" },
    ],
  },
  clinical_recommendation: {
    summary: "Avoid codeine. Ultra-rapid CYP2D6 metabolism leads to excessive morphine conversion, risking life-threatening toxicity.",
    dosage_recommendation: "Do NOT administer codeine. Use alternative analgesics such as acetaminophen or NSAIDs.",
    warnings: [
      "Risk of respiratory depression",
      "Contraindicated in ultra-rapid metabolizers",
      "CPIC Level A recommendation: avoid codeine",
    ],
  },
  llm_generated_explanation: {
    summary: "This patient's CYP2D6 ultra-rapid metabolizer status means codeine is converted to morphine much faster than normal, leading to potentially dangerous levels.",
    detailed_explanation: "CYP2D6 is the primary enzyme responsible for converting codeine into its active metabolite, morphine. In ultra-rapid metabolizers with duplicated functional alleles, this conversion is significantly accelerated, producing supratherapeutic morphine concentrations from standard codeine doses.",
    biological_mechanism: "Codeine is a prodrug that undergoes O-demethylation via CYP2D6 to form morphine. The *1/*2 diplotype with gene duplication results in increased enzyme activity, classified as an ultra-rapid metabolizer phenotype.",
    variant_explanation: "The rs3892097 variant causes a splice defect reducing one copy's function, while the rs16947 (Arg296Cys) variant is associated with altered but functional enzyme activity. Combined with gene duplication, net enzyme activity exceeds normal range.",
  },
  quality_metrics: {
    vcf_parsing_success: true,
    variants_analyzed: 847,
    gene_coverage: 0.94,
  },
};
