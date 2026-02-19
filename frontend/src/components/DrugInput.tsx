import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        const dropdown = document.querySelector('[data-dropdown-menu]');
        if (dropdown && !dropdown.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

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
    <div className="flex-1 relative z-30">
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
      <div className="relative z-40">
        <motion.button
          ref={buttonRef}
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

        {open && createPortal(
          <AnimatePresence>
            <motion.div
              data-dropdown-menu
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 9999,
              }}
              className="rounded-xl border border-border glass-card-strong shadow-2xl origin-top overflow-hidden"
            >
              {/* Drug List */}
              <div className="h-[260px] overflow-y-scroll overflow-x-hidden touch-auto" style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
                {SUPPORTED_DRUGS.map((drug, idx) => (
                  <button
                    key={drug}
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
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
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
