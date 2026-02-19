import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RiskCard from "@/components/RiskCard";
import ProfileCard from "@/components/ProfileCard";
import RecommendationCard from "@/components/RecommendationCard";
import ExplanationAccordion from "@/components/ExplanationAccordion";
import QualityMetrics from "@/components/QualityMetrics";
import DownloadButtons from "@/components/DownloadButtons";
import { AnalysisResult } from "@/utils/mockData";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { analyzeVariantSummary } from "@/services/api";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(null);
  const [selectedVariantRsid, setSelectedVariantRsid] = useState<string | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanation, setExplanation] = useState<AnalysisResult["llm_generated_explanation"] | undefined>(undefined);

  useEffect(() => {
    console.log("🎬 Results page mounted");
    console.log("📦 Location state:", location.state);
    
    // Get result from navigation state
    if (location.state?.result) {
      console.log("✅ Result found in state:", location.state.result);
      setResult(location.state.result);
    } else {
      console.log("❌ No result in state, redirecting to analysis");
      // If no result, redirect back to analysis page
      navigate("/analyze");
    }
  }, [location, navigate]);

  const handleVariantClick = async (
    variant: AnalysisResult["pharmacogenomic_profile"]["detected_variants"][number],
    variantKey: string
  ) => {
    if (!result) return;

    setSelectedVariantKey(variantKey);
    setSelectedVariantRsid(variant.rsid);
    setExplanationLoading(true);
    setExplanation({
      summary: `Generating AI summary for ${variant.rsid}...`,
      detailed_explanation:
        "Fetching variant-specific clinical interpretation from the backend.",
      biological_mechanism: `Gene context: ${variant.gene}`,
      variant_explanation: variant.variant_info
        ? `Selected variant: ${variant.rsid} (${variant.variant_info})`
        : `Selected variant: ${variant.rsid}`,
    });

    try {
      const llmExplanation = await analyzeVariantSummary({
        drug: result.drug,
        primary_gene: result.pharmacogenomic_profile.primary_gene,
        diplotype: result.pharmacogenomic_profile.diplotype,
        phenotype: result.pharmacogenomic_profile.phenotype,
        variant,
      });

      setResult((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pharmacogenomic_profile: {
            ...prev.pharmacogenomic_profile,
            primary_gene:
              llmExplanation?.pharmacogenomic_profile?.primary_gene || variant.gene,
            diplotype:
              llmExplanation?.pharmacogenomic_profile?.diplotype ||
              prev.pharmacogenomic_profile.diplotype,
            phenotype:
              llmExplanation?.pharmacogenomic_profile?.phenotype ||
              prev.pharmacogenomic_profile.phenotype,
          },
          clinical_recommendation: {
            summary:
              llmExplanation?.clinical_recommendation?.summary ||
              prev.clinical_recommendation.summary,
            dosage_recommendation:
              llmExplanation?.clinical_recommendation?.dosage_recommendation ||
              prev.clinical_recommendation.dosage_recommendation,
            warnings:
              llmExplanation?.clinical_recommendation?.warnings?.length
                ? llmExplanation.clinical_recommendation.warnings
                : prev.clinical_recommendation.warnings,
          },
        };
      });

      setExplanation({
        summary:
          llmExplanation?.llm_generated_explanation?.summary ||
          `Summary unavailable for ${variant.rsid}.`,
        detailed_explanation:
          llmExplanation?.llm_generated_explanation?.detailed_explanation ||
          `Detailed explanation unavailable for ${variant.rsid}.`,
        biological_mechanism:
          llmExplanation?.llm_generated_explanation?.biological_mechanism ||
          `Biological mechanism unavailable for ${variant.gene}.`,
        variant_explanation:
          llmExplanation?.llm_generated_explanation?.variant_explanation ||
          `Variant explanation unavailable for ${variant.rsid}.`,
      });
    } catch (error) {
      setExplanation({
        summary: "Unable to generate AI summary for this variant.",
        detailed_explanation:
          error instanceof Error ? error.message : "Request failed.",
        biological_mechanism: "No additional mechanism details available.",
        variant_explanation: `Variant selected: ${variant.rsid}`,
      });
    } finally {
      setExplanationLoading(false);
    }
  };

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      {explanationLoading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="glass-card rounded-2xl px-6 py-5 flex items-center gap-3 border border-primary/30">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <p className="text-sm font-medium text-foreground">
              Generating variant-specific AI summary...
            </p>
          </div>
        </div>
      )}

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/analyze")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Analysis
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Analysis Complete</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Analysis Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive pharmacogenomic risk assessment for {result.drug}
            </p>
          </motion.div>

          {/* Results */}
          <div className="space-y-6">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                    {result.drug} Analysis
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Patient: {result.patient_id} · {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
                <DownloadButtons data={result} />
              </div>
            </motion.div>

            {/* Risk Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RiskCard data={result} />
            </motion.div>

            {/* Profile and Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <ProfileCard
                data={result}
                onVariantClick={handleVariantClick}
                selectedVariantKey={selectedVariantKey}
              />
              <RecommendationCard data={result} />
            </motion.div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ExplanationAccordion
                data={result}
                explanation={explanation}
                loading={explanationLoading}
                selectedVariantRsid={selectedVariantRsid}
              />
            </motion.div>


            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/analyze")}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Analyze Another File
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="px-8 py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:border-primary/50 transition-all"
              >
                Back to Home
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
