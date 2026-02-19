import { AnalysisResult, mockResult } from "@/utils/mockData";

const API_BASE = "/api";

export async function analyzeRisk(
  file: File,
  drugs: string[]
): Promise<AnalysisResult> {
  // In production, uncomment below and remove mock:
  //
  // const formData = new FormData();
  // formData.append("file", file);
  // formData.append("drugs", drugs.join(","));
  //
  // const res = await fetch(`${API_BASE}/analyze`, {
  //   method: "POST",
  //   body: formData,
  // });
  //
  // if (!res.ok) throw new Error(`Server error: ${res.status}`);
  // return res.json();

  // Mock: simulate network delay and return mock data
  await new Promise((r) => setTimeout(r, 2500));
  return {
    ...mockResult,
    drug: drugs[0],
    timestamp: new Date().toISOString(),
  };
}
