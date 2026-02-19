import { Dna, Github, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Footer = () => (
  <footer className="border-t border-border glass-card-strong">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-lg"
            >
              <Dna className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-display text-xl font-bold text-foreground">
              Intelli<span className="text-primary">Gene</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered pharmacogenomic risk prediction for precision medicine.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/analysis"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Analysis
            </Link>
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
          <div className="flex flex-col gap-2">
            <a
              href="https://cpicpgx.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              CPIC Guidelines
            </a>
            
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="font-display font-semibold text-foreground mb-4">Connect</h4>
          <div className="flex flex-col gap-3">
            <a
              href="https://github.com/AkshatChauhan18/rift2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Contact Us</DialogTitle>
                  <DialogDescription>
                    Contact us at email
                    <a
                      href="mailto:riftrizzers@gmail.com"
                      className="ml-1 text-primary hover:underline"
                    >
                      riftrizzers@gmail.com
                    </a>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} IntelliGene. Built for RIFT 2026.
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> by RiftRizzers for better healthcare
        </p>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
