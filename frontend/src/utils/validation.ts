export const SUPPORTED_DRUGS = [
  "CODEINE",
  "WARFARIN",
  "CLOPIDOGREL",
  "SIMVASTATIN",
  "AZATHIOPRINE",
  "FLUOROURACIL",
] as const;

export type SupportedDrug = (typeof SUPPORTED_DRUGS)[number];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateVcfFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".vcf")) {
    return "Invalid file format. Only .vcf files are supported.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File too large. Maximum size is 5 MB.";
  }
  if (file.size === 0) {
    return "File is empty.";
  }
  return null;
}

export function validateDrugs(drugs: string[]): string | null {
  if (drugs.length === 0) return "Please select at least one drug.";
  const invalid = drugs.filter(
    (d) => !SUPPORTED_DRUGS.includes(d.toUpperCase() as SupportedDrug)
  );
  if (invalid.length > 0) {
    return `Invalid drug(s): ${invalid.join(", ")}`;
  }
  return null;
}
