import { motion } from "framer-motion";
import { Dna } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative w-24 h-24 mb-6"
      >
        <Dna className="w-24 h-24 text-primary" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Analyzing genetic variants with AI
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </h3>
        <p className="text-sm text-muted-foreground">
          This may take a few moments
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mt-6">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
