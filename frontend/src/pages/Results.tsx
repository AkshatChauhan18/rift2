import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RiskCard from "@/components/RiskCard";
import ProfileCard from "@/components/ProfileCard";
import RecommendationCard from "@/components/RecommendationCard";
import ExplanationAccordion from "@/components/ExplanationAccordion";
import DownloadButtons from "@/components/DownloadButtons";
import { AnalysisResult } from "@/utils/mockData";
import { ArrowLeft, Sparkles } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Get result from navigation state
    if (location.state?.result) {
      setResult(location.state.result);
    } else {
      // If no result, redirect back to analysis page
      navigate("/analyze");
    }
  }, [location, navigate]);

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
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
          <div id="results-content" className="space-y-6">
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
              <ProfileCard data={result} />
              <RecommendationCard data={result} />
            </motion.div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ExplanationAccordion data={result} />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
