import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUPPORTED_DRUGS } from "@/utils/validation";
import { X, AlertCircle, ChevronDown, Pill } from "lucide-react";

interface DrugInputProps {
  drugs: string[];
  onDrugsChange: (drugs: string[]) => void;
}

const DrugInput = ({ drugs, onDrugsChange }: DrugInputProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDrug = (drug: string) => {
    setError(null);
    if (drugs.includes(drug)) {
      onDrugsChange(drugs.filter((d) => d !== drug));
    } else {
      onDrugsChange([...drugs, drug]);
    }
  };

  const removeDrug = (drug: string) => {
    onDrugsChange(drugs.filter((d) => d !== drug));
  };

  return (
    <div className="flex-1">
      <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
        <Pill className="w-4 h-4 text-secondary" />
        Select Drug(s) for Analysis
      </label>

      {/* Selected pills */}
      <AnimatePresence mode="popLayout">
        {drugs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-wrap gap-2 mb-3 overflow-hidden"
          >
            {drugs.map((drug, idx) => (
              <motion.span
                key={drug}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  delay: idx * 0.05,
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-xs font-semibold"
              >
                {drug}
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeDrug(drug)}
                  aria-label={`Remove ${drug}`}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-border bg-card text-sm text-foreground hover:border-primary/50 transition-all shadow-sm"
        >
          <span className={drugs.length === 0 ? "text-muted-foreground" : "font-medium"}>
            {drugs.length === 0
              ? "Choose drugs..."
              : `${drugs.length} drug${drugs.length > 1 ? "s" : ""} selected`}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ 
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="absolute z-20 mt-2 w-full rounded-xl border border-border glass-card-strong shadow-2xl overflow-hidden origin-top"
            >
              {/* Drug List */}
              <div className="max-h-64 overflow-y-auto">
                {SUPPORTED_DRUGS.map((drug, idx) => (
                  <motion.button
                    key={drug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      delay: idx * 0.03,
                      duration: 0.2
                    }}
                    type="button"
                    onClick={() => {
                      toggleDrug(drug);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-all ${
                      drugs.includes(drug)
                        ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{drug}</span>
                      {drugs.includes(drug) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                          className="w-2 h-2 rounded-full bg-primary"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20"
          >
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrugInput;
