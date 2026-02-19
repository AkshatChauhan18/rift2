import { createClient } from "@supabase/supabase-js";
import { AnalysisResult } from "@/utils/mockData";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.",
    );
  }

  return supabase;
}

export interface AnalysisHistoryItem {
  id: string;
  patient_id: string;
  drug: string;
  risk_label: string;
  created_at: string;
  result_data: AnalysisResult;
}

export async function saveAnalysisResult(userId: string, result: AnalysisResult) {
  const client = requireSupabase();

  const { error } = await client.from("analysis_results").insert({
    user_id: userId,
    patient_id: result.patient_id,
    drug: result.drug,
    risk_label: result.risk_assessment.risk_label,
    result_data: result,
  });

  if (error) {
    throw error;
  }
}

export async function getUserAnalysisHistory(userId: string): Promise<AnalysisHistoryItem[]> {
  const client = requireSupabase();

  const { data, error } = await client
    .from("analysis_results")
    .select("id, patient_id, drug, risk_label, created_at, result_data")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as AnalysisHistoryItem[];
}

export async function deleteAnalysisHistoryItem(userId: string, itemId: string): Promise<void> {
  const client = requireSupabase();

  const { error } = await client
    .from("analysis_results")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}
