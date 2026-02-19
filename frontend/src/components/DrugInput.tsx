import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUPPORTED_DRUGS } from "@/utils/validation";
import { X, AlertCircle, ChevronDown, Search, Pill } from "lucide-react";

interface DrugInputProps {
  drugs: string[];
  onDrugsChange: (drugs: string[]) => void;
}

const DrugInput = ({ drugs, onDrugsChange }: DrugInputProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredDrugs = SUPPORTED_DRUGS.filter((drug) =>
    drug.toLowerCase().includes(search.toLowerCase())
  );

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
      <AnimatePresence>
        {drugs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {drugs.map((drug, idx) => (
              <motion.span
                key={drug}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
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
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-20 mt-2 w-full rounded-xl border border-border glass-card-strong shadow-2xl overflow-hidden"
            >
              {/* Search */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search drugs..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Drug List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredDrugs.length > 0 ? (
                  filteredDrugs.map((drug, idx) => (
                    <motion.button
                      key={drug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      type="button"
                      onClick={() => toggleDrug(drug)}
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
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                        )}
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No drugs found
                  </div>
                )}
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
