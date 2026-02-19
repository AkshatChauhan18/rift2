import { motion } from "framer-motion";
import { AnalysisResult } from "@/utils/mockData";
import { Dna, Activity, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProfileCard = ({ data }: { data: AnalysisResult }) => {
  const p = data.pharmacogenomic_profile;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Dna className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">
          Pharmacogenomic Profile
        </h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
        >
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Primary Gene
          </p>
          <p className="text-base font-bold text-foreground">{p.primary_gene}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20"
        >
          <p className="text-xs text-muted-foreground mb-1">Diplotype</p>
          <p className="text-base font-bold text-foreground">{p.diplotype}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
        >
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Phenotype
          </p>
          <p className="text-base font-bold text-primary">{p.phenotype}</p>
        </motion.div>
      </div>

      {/* Detected Variants */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span>Detected Variants</span>
          <Badge variant="secondary" className="text-xs">
            {p.detected_variants.length}
          </Badge>
        </p>

        <div className="space-y-2">
          {p.detected_variants.map((v, idx) => (
            <motion.div
              key={v.rsid}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono font-semibold text-primary">
                      {v.rsid}
                    </code>
                    <Badge variant="outline" className="text-xs">
                      {v.gene}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{v.variant_info}</p>
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                >
                  <Dna className="w-4 h-4 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
