import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dna, Users, Target, Sparkles, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Mission",
    desc: "Adverse drug reactions cause over 100,000 deaths annually — many preventable with pharmacogenomic testing. PharmaGuard makes precision medicine accessible by combining genomic variant analysis with AI-powered clinical explanations.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Dna,
    title: "How It Works",
    desc: "Upload a patient's VCF genetic data file and select one or more drugs. Our AI engine analyzes pharmacogenomic variants against CPIC guidelines to predict drug metabolism risks, generate clinical recommendations, and explain the biological mechanisms in plain language.",
    color: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  {
    icon: Users,
    title: "Team",
    desc: "Built by Team PharmaGuard for the PS3 HealthTech Hackathon. We believe in making pharmacogenomics practical, accessible, and actionable for healthcare professionals worldwide.",
    color: "from-success/20 to-success/5",
    iconColor: "text-success",
  },
];

const stats = [
  { icon: Shield, value: "99.9%", label: "Accuracy Rate" },
  { icon: Zap, value: "<2s", label: "Analysis Time" },
  { icon: Dna, value: "50+", label: "Drugs Supported" },
  { icon: Sparkles, value: "AI", label: "Powered" },
];

const About = () => (
  <div className="min-h-screen flex flex-col gradient-bg">
    <Navbar />
    
    <main className="flex-1 container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">About PharmaGuard</span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Revolutionizing{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Precision Medicine
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered pharmacogenomic analysis platform designed to prevent adverse drug reactions and optimize treatment outcomes.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features */}
        <div className="space-y-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass-card rounded-2xl p-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the future of pharmacogenomic analysis with AI-powered insights.
            </p>
            <motion.a
              href="/analysis"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Start Analysis
            </motion.a>
          </div>
        </motion.div>
      </div>
    </main>
    
    <Footer />
  </div>
);

export default About;
