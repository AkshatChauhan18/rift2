import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import DrugInput from "@/components/DrugInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { analyzeRisk } from "@/services/api";
import { FlaskConical, Sparkles } from "lucide-react";

const Analysis = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [drugs, setDrugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = file !== null && drugs.length > 0 && !loading;

  const handleAnalyze = async () => {
    if (!file || drugs.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeRisk(file, drugs);
      // Navigate to results page with data
      navigate("/results", { state: { result: data } });
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

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
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Analysis</span>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Pharmacogenomic Analysis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your VCF file and select drugs to analyze genetic risk factors with AI precision.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 overflow-visible"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <FileUpload file={file} onFileChange={setFile} />
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl p-6 flex flex-col overflow-visible"
            >
              <DrugInput drugs={drugs} onDrugsChange={setDrugs} />
              
              <div className="mt-auto pt-6">
                <motion.button
                  whileHover={{ scale: canAnalyze ? 1.02 : 1 }}
                  whileTap={{ scale: canAnalyze ? 0.98 : 1 }}
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base shadow-lg transition-all ${
                    canAnalyze
                      ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <FlaskConical className="w-5 h-5" />
                  Analyze Risk
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <ErrorAlert message={error} onClose={() => setError(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-8"
              >
                <LoadingSpinner />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analysis;
