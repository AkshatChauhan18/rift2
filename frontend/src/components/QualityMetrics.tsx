import { motion } from "framer-motion";
import { AnalysisResult } from "@/utils/mockData";
import { CheckCircle2, XCircle, BarChart3, Activity } from "lucide-react";

const QualityMetrics = ({ data }: { data: AnalysisResult }) => {
  const q = data.quality_metrics;

  const metrics = [
    {
      label: "VCF Parsing",
      ok: q.vcf_parsing_success,
      icon: Activity,
    },
    {
      label: "Variants Analyzed",
      value: q.variants_analyzed,
      icon: BarChart3,
    },
    {
      label: "Gene Coverage",
      value: `${(q.gene_coverage * 100).toFixed(0)}%`,
      percent: q.gene_coverage * 100,
      icon: BarChart3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-success" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">Quality Metrics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {"ok" in m ? (
                  m.ok ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5, delay: 0.3 + idx * 0.1 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </motion.div>
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )
                ) : (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="text-2xl font-bold text-primary"
                  >
                    {m.value}
                  </motion.p>
                )}
              </div>

              <p className="text-sm font-medium text-foreground mb-2">{m.label}</p>

              {"percent" in m && (
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.percent}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-success to-secondary rounded-full"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QualityMetrics;
