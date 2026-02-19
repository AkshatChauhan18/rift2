import { motion } from "framer-motion";
import { AnalysisResult } from "@/utils/mockData";
import { AlertTriangle, Pill, ShieldCheck, Info } from "lucide-react";

const RecommendationCard = ({ data }: { data: AnalysisResult }) => {
  const c = data.clinical_recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-success/20 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-secondary" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">
          Clinical Recommendation
        </h3>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border mb-4"
      >
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">{c.summary}</p>
        </div>
      </motion.div>

      {/* Dosage Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 mb-4"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0"
          >
            <Pill className="w-5 h-5 text-success" />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">
              Dosage Recommendation
            </p>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {c.dosage_recommendation}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Warnings */}
      {c.warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <p className="text-sm font-semibold text-foreground">Important Warnings</p>
          </div>
          <div className="space-y-2">
            {c.warnings.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0 mt-2" />
                <span className="text-sm text-foreground leading-relaxed">{w}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecommendationCard;
