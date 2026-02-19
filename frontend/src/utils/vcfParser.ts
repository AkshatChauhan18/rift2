/**
 * PharmaGuard CPIC Evidence Engine
 * VCF Parser with CPIC-based confidence scoring
 */

export interface VcfVariant {
  rsid: string;
  gene: string;
  genotype: string;
  chromosome: string;
  position: string;
}

export interface PharmaProfile {
  primary_gene: string;
  diplotype: string;
  phenotype: string;
  detected_variants: Array<{ rsid: string; gene: string }>;
  confidence?: number;
  cpic_evidence?: string;
  risk_level?: string;
}

// =======================================
// CPIC Evidence Levels
// =======================================
const CPIC_LEVELS: Record<string, number> = {
  A: 1.0,
  B: 0.8,
  C: 0.5,
  D: 0.2,
};

// =======================================
// Drug → Gene → Evidence
// =======================================
const DRUG_RULES: Record<string, { gene: string; evidence: string }> = {
  CODEINE: { gene: "CYP2D6", evidence: "A" },
  WARFARIN: { gene: "CYP2C9", evidence: "A" },
  CLOPIDOGREL: { gene: "CYP2C19", evidence: "A" },
  SIMVASTATIN: { gene: "SLCO1B1", evidence: "A" },
  AZATHIOPRINE: { gene: "TPMT", evidence: "A" },
  FLUOROURACIL: { gene: "DPYD", evidence: "A" },
};

// =======================================
// Star Allele Mappings (rsID → allele)
// =======================================
const STAR_ALLELES: Record<string, Record<string, string>> = {
  TPMT: {
    rs1800462: "*2",
    rs1800460: "*3A",
    rs1142345: "*3C",
  },
  DPYD: {
    rs3918290: "*2A",
    rs55886062: "*13",
    rs67376798: "D949V",
    rs4148323: "*6",
  },
  CYP2C19: {
    rs4244285: "*2",
    rs4986893: "*3",
    rs12248560: "*17",
  },
  CYP2C9: {
    rs1799853: "*2",
    rs1057910: "*3",
  },
  SLCO1B1: {
    rs4149056: "*5",
    rs2306283: "*1B",
  },
  CYP2D6: {
    rs3892097: "*4",
    rs1065852: "*10",
    rs5030655: "*6",
  },
};

// =======================================
// Phenotype Inference Logic
// =======================================
function phenotypeFromAlleles(alleles: string[]): string {
  if (alleles.length >= 2) return "PM"; // Poor metabolizer
  if (alleles.length === 1) return "IM"; // Intermediate metabolizer
  return "NM"; // Normal metabolizer
}

function phenotypeWeight(phenotype: string): number {
  if (phenotype === "PM") return 1.0;
  if (phenotype === "IM") return 0.9;
  if (phenotype === "NM") return 0.8;
  if (phenotype === "RM") return 0.85; // Rapid metabolizer
  if (phenotype === "URM") return 0.9; // Ultra-rapid metabolizer
  return 0.5;
}

function genotypeWeight(genotype: string): number {
  if (!genotype) return 0.5;
  if (genotype === "1/1" || genotype === "1|1") return 1.0; // Homozygous variant
  if (genotype === "0/1" || genotype === "0|1" || genotype === "1/0" || genotype === "1|0") return 0.85; // Heterozygous
  if (genotype === "0/0" || genotype === "0|0") return 0.8; // Wild-type
  return 0.5;
}

function riskFromPhenotype(phenotype: string): string {
  if (phenotype === "PM") return "HIGH";
  if (phenotype === "IM") return "MODERATE";
  if (phenotype === "NM") return "LOW";
  return "UNKNOWN";
}

// =======================================
// VCF Parser
// =======================================
/**
 * Parse VCF file content and extract pharmacogenomic variants
 */
export function parseVcfFile(content: string): VcfVariant[] {
  const lines = content.split('\n').filter(line => line.trim());
  const variants: VcfVariant[] = [];

  for (const line of lines) {
    // Skip header lines
    if (line.startsWith('#')) continue;

    // Parse data line: CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
    const columns = line.split(/\s+/);
    if (columns.length < 10) continue;

    const [chrom, pos, id, ref, alt, qual, filter, info, format, sample] = columns;

    // Extract rsID
    const rsid = id.trim();
    if (!rsid || rsid === '.' || !rsid.startsWith('rs')) continue;

    // Extract GENE from INFO field
    const geneMatch = info.match(/GENE=([^;]+)/);
    const gene = geneMatch ? geneMatch[1].trim() : '';

    // Extract genotype from sample column
    const formatFields = format.split(':');
    const sampleFields = sample.split(':');
    const gtIndex = formatFields.indexOf('GT');
    const genotype = gtIndex >= 0 ? sampleFields[gtIndex] : '';

    if (gene && genotype) {
      variants.push({
        rsid,
        gene,
        genotype,
        chromosome: chrom,
        position: pos,
      });
    }
  }

  return variants;
}

// =======================================
// Infer Gene Data with CPIC Logic
// =======================================
function inferGeneData(variants: VcfVariant[]): Record<string, {
  alleles: string[];
  phenotype: string;
  genotypeConfidence: number;
  diplotype: string;
}> {
  const geneResults: Record<string, any> = {};

  for (const gene in STAR_ALLELES) {
    const geneMap = STAR_ALLELES[gene];
    const alleles: string[] = [];
    const gtScores: number[] = [];

    // Find variants for this gene
    for (const variant of variants) {
      if (variant.gene === gene && geneMap[variant.rsid]) {
        const gt = variant.genotype;
        
        if (gt !== "0/0" && gt !== "0|0") {
          alleles.push(geneMap[variant.rsid]);
          gtScores.push(genotypeWeight(gt));
        }
      }
    }

    const phenotype = phenotypeFromAlleles(alleles);
    const avgGT = gtScores.length > 0
      ? gtScores.reduce((a, b) => a + b, 0) / gtScores.length
      : 0.8;

    // Build diplotype from alleles
    let diplotype = "*1/*1"; // Default wild-type
    if (alleles.length === 1) {
      diplotype = `*1/${alleles[0]}`;
    } else if (alleles.length >= 2) {
      diplotype = `${alleles[0]}/${alleles[1]}`;
    }

    geneResults[gene] = {
      alleles,
      phenotype,
      genotypeConfidence: avgGT,
      diplotype,
    };
  }

  return geneResults;
}

// =======================================
// Build Pharmacogenomic Profile
// =======================================
/**
 * Convert VCF variants to pharmacogenomic profile for API
 */
export function buildPharmaProfile(
  variants: VcfVariant[],
  drug: string
): PharmaProfile {
  const rule = DRUG_RULES[drug.toUpperCase()];
  
  if (!rule) {
    throw new Error(`Unsupported drug: ${drug}`);
  }

  const primaryGene = rule.gene;
  const evidenceWeight = CPIC_LEVELS[rule.evidence];

  // Infer gene data for all genes
  const geneData = inferGeneData(variants);
  const geneInfo = geneData[primaryGene] || {
    alleles: [],
    phenotype: "NM",
    genotypeConfidence: 0.8,
    diplotype: "*1/*1",
  };

  const phenotype = geneInfo.phenotype;
  const diplotype = geneInfo.diplotype;
  const gtConfidence = geneInfo.genotypeConfidence;
  const phenoWeight = phenotypeWeight(phenotype);

  // ===========================
  // CPIC CONFIDENCE SCORE
  // ===========================
  const confidence = Number(
    (evidenceWeight * gtConfidence * phenoWeight).toFixed(3)
  );

  const riskLevel = riskFromPhenotype(phenotype);

  return {
    primary_gene: primaryGene,
    diplotype,
    phenotype,
    detected_variants: variants.map(v => ({ rsid: v.rsid, gene: v.gene })),
    confidence,
    cpic_evidence: rule.evidence,
    risk_level: riskLevel,
  };
}
