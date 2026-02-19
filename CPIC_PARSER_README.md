# CPIC Evidence-Based VCF Parser

## Overview
The VCF parser now uses CPIC (Clinical Pharmacogenetics Implementation Consortium) evidence levels to calculate confidence scores based on multiple factors.

## CPIC Evidence Levels
- **Level A**: 1.0 - Strong evidence (all supported drugs currently use this)
- **Level B**: 0.8 - Moderate evidence  
- **Level C**: 0.5 - Limited evidence
- **Level D**: 0.2 - Preliminary evidence

## Star Allele Mappings

### TPMT (Thiopurine S-Methyltransferase)
- rs1800462 → *2
- rs1800460 → *3A
- rs1142345 → *3C

### DPYD (Dihydropyrimidine Dehydrogenase)
- rs3918290 → *2A
- rs55886062 → *13
- rs67376798 → D949V
- rs4148323 → *6

### CYP2C19 (Cytochrome P450 2C19)
- rs4244285 → *2
- rs4986893 → *3
- rs12248560 → *17

### CYP2C9 (Cytochrome P450 2C9)
- rs1799853 → *2
- rs1057910 → *3

### SLCO1B1 (Solute Carrier Organic Anion Transporter)
- rs4149056 → *5
- rs2306283 → *1B

### CYP2D6 (Cytochrome P450 2D6)
- rs3892097 → *4
- rs1065852 → *10
- rs5030655 → *6

## Phenotype Inference Logic

### Allele Count → Phenotype
- **0 variant alleles**: NM (Normal Metabolizer)
- **1 variant allele**: IM (Intermediate Metabolizer)  
- **2+ variant alleles**: PM (Poor Metabolizer)

### Risk Level from Phenotype
- **PM** → HIGH risk
- **IM** → MODERATE risk
- **NM** → LOW risk

## Confidence Score Calculation

```
Confidence = CPIC_Evidence × Genotype_Confidence × Phenotype_Weight
```

### Genotype Confidence Weights
- `1/1` (homozygous variant): 1.0
- `0/1` (heterozygous): 0.85
- `0/0` (wild-type): 0.8
- Unknown: 0.5

### Phenotype Weights
- PM: 1.0
- IM: 0.9
- NM: 0.8
- RM: 0.85
- URM: 0.9

## Example Transformation

### Input VCF
```
##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	PATIENT_SAMPLE
6	18139228	rs1800462	C	G	99	PASS	GENE=TPMT	GT	1/1
6	18143715	rs1142345	T	C	99	PASS	GENE=TPMT	GT	0/1
```

### Output for AZATHIOPRINE
```json
{
  "drug": "AZATHIOPRINE",
  "primary_gene": "TPMT",
  "diplotype": "*2/*3C",
  "phenotype": "PM",
  "detected_variants": [
    { "rsid": "rs1800462", "gene": "TPMT" },
    { "rsid": "rs1142345", "gene": "TPMT" }
  ],
  "confidence": 0.925,
  "cpic_evidence": "A",
  "risk_level": "HIGH"
}
```

### Confidence Calculation
```
Evidence (A) = 1.0
Genotype confidence = (1.0 + 0.85) / 2 = 0.925
Phenotype weight (PM) = 1.0

Final = 1.0 × 0.925 × 1.0 = 0.925
```

## Testing

### Test Files
1. `test_tpmt.vcf` - TPMT poor metabolizer (2 variants)
2. `sample.vcf` - Multi-gene comprehensive test

### Test Commands
```bash
# Frontend will automatically parse and send structured JSON
# Backend receives: { drug, primary_gene, diplotype, phenotype, detected_variants }
```

## Drug-Gene-Evidence Mapping
| Drug | Primary Gene | CPIC Evidence |
|------|-------------|---------------|
| CODEINE | CYP2D6 | A |
| WARFARIN | CYP2C9 | A |
| CLOPIDOGREL | CYP2C19 | A |
| SIMVASTATIN | SLCO1B1 | A |
| AZATHIOPRINE | TPMT | A |
| FLUOROURACIL | DPYD | A |
