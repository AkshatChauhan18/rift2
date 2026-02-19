import { motion } from "framer-motion";
import { AnalysisResult } from "@/utils/mockData";
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const riskConfig = {
  Safe: {
    class: "risk-safe",
    icon: CheckCircle2,
    glow: "glow-success",
    gradient: "from-success/20 to-success/5",
  },
  "Adjust Dosage": {
    class: "risk-adjust",
    icon: AlertTriangle,
    glow: "glow-warning",
    gradient: "from-warning/20 to-warning/5",
  },
  Toxic: {
    class: "risk-danger",
    icon: XCircle,
    glow: "glow-danger",
    gradient: "from-destructive/20 to-destructive/5",
  },
  Ineffective: {
    class: "risk-danger",
    icon: XCircle,
    glow: "glow-danger",
    gradient: "from-destructive/20 to-destructive/5",
  },
  Unknown: {
    class: "risk-unknown",
    icon: HelpCircle,
    glow: "",
    gradient: "from-muted/20 to-muted/5",
  },
};

const severityColors: Record<string, string> = {
  none: "text-success",
  low: "text-secondary",
  moderate: "text-warning",
  high: "text-destructive",
  critical: "text-destructive",
};

const RiskCard = ({ data }: { data: AnalysisResult }) => {
  const r = data.risk_assessment;
  const cfg = riskConfig[r.risk_label] || riskConfig.Unknown;
  const Icon = cfg.icon;
  const confidencePercent = r.confidence_score * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-card rounded-2xl p-8 ${cfg.glow}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">
            Risk Assessment
          </h3>
          <p className="text-sm text-muted-foreground">
            AI-powered pharmacogenomic analysis
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <TrendingUp className="w-6 h-6 text-primary" />
        </motion.div>
      </div>

      {/* Risk Label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${cfg.gradient} border-2 border-current/20 ${cfg.class}`}>
          <Icon className="w-7 h-7" />
          <span className="text-xl font-bold">{r.risk_label}</span>
        </div>
      </motion.div>

      {/* Severity */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 p-4 rounded-xl bg-muted/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Severity Level</span>
          <span className={`text-lg font-bold capitalize ${severityColors[r.severity] || "text-muted-foreground"}`}>
            {r.severity}
          </span>
        </div>
      </motion.div>

      {/* Confidence Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
            className="text-2xl font-bold text-primary"
          >
            {confidencePercent.toFixed(0)}%
          </motion.span>
        </div>

        {/* Circular Progress */}
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ["0%", "100%"] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Confidence Description */}
        <p className="text-xs text-muted-foreground mt-2">
          {confidencePercent >= 90
            ? "Very high confidence in prediction"
            : confidencePercent >= 70
            ? "High confidence in prediction"
            : confidencePercent >= 50
            ? "Moderate confidence in prediction"
            : "Low confidence - additional testing recommended"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RiskCard;
