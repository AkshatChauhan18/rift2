import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

const ErrorAlert = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    className="glass-card rounded-2xl p-5 border-2 border-destructive/30 bg-destructive/5"
  >
    <div className="flex items-start gap-4">
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0"
      >
        <AlertCircle className="w-5 h-5 text-destructive" />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-destructive mb-1">Error</h4>
        <p className="text-sm text-foreground leading-relaxed">{message}</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5 text-muted-foreground hover:text-destructive" />
      </motion.button>
    </div>
  </motion.div>
);

export default ErrorAlert;
