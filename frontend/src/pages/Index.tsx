import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Dna, Brain, ShieldCheck, Lock, Sparkles, Activity, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Dna,
    title: "Genomic Risk Prediction",
    desc: "Upload VCF files and instantly identify pharmacogenomic variants linked to drug metabolism risks.",
    color: "text-primary",
  },
  {
    icon: Brain,
    title: "AI Clinical Explanation",
    desc: "LLM-powered plain-language explanations of biological mechanisms and variant impacts.",
    color: "text-secondary",
  },
  {
    icon: ShieldCheck,
    title: "CPIC Recommendations",
    desc: "Evidence-based clinical guidelines aligned with CPIC pharmacogenomics standards.",
    color: "text-success",
  },
  {
    icon: Lock,
    title: "Secure Processing",
    desc: "Patient genomic data is processed securely with no persistent storage of sensitive information.",
    color: "text-warning",
  },
];

const stats = [
  { value: "99.9%", label: "Accuracy" },
  { value: "<5s", label: "Analysis Time" },
  { value: "5+", label: "Drugs Supported" },
  { value: "24/7", label: "Availability" },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI-Powered Precision Medicine</span>
              </motion.div> */}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
              >
                AI-Powered{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Pharmacogenomic
                </span>{" "}
                Intelligence
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                Predict drug risks using genetic data and explain with AI. Prevent adverse reactions before they happen with cutting-edge pharmacogenomics.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/analysis"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Analysis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-card font-semibold text-base hover:scale-105 transition-all"
                >
                  Learn More
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12"
              >
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - 3D Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[600px] flex items-center justify-center">
                {/* DNA Helix Animation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Dna className="w-64 h-64 text-primary/20" />
                </motion.div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 right-10 glass-card p-4 rounded-xl"
                >
                  <Activity className="w-8 h-8 text-success mb-2" />
                  <div className="text-sm font-semibold">Real-time Analysis</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-20 left-10 glass-card p-4 rounded-xl"
                >
                  <Brain className="w-8 h-8 text-secondary mb-2" />
                  <div className="text-sm font-semibold">AI Powered</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute top-1/2 right-0 glass-card p-4 rounded-xl"
                >
                  <Zap className="w-8 h-8 text-warning mb-2" />
                  <div className="text-sm font-semibold">Instant Results</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload genetic data, select medications, and receive instant pharmacogenomic risk analysis powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group glass-card rounded-2xl p-6 cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl animated-gradient p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to analyze pharmacogenomic risk?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Upload a VCF file and get AI-driven insights in seconds. Join the future of precision medicine.
            </p>
            <Link
              to="/analysis"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:scale-105 transition-all shadow-2xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
