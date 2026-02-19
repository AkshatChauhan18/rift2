import { motion } from "framer-motion";
import { AnalysisResult } from "@/utils/mockData";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Brain, Sparkles, Dna, FileText } from "lucide-react";

interface ExplanationAccordionProps {
  data: AnalysisResult;
  explanation?: AnalysisResult["llm_generated_explanation"];
  loading?: boolean;
  selectedVariantRsid?: string | null;
}

const ExplanationAccordion = ({
  data,
  explanation,
  loading = false,
  selectedVariantRsid = null,
}: ExplanationAccordionProps) => {
  const e = explanation || data.llm_generated_explanation;

  const sections = [
    {
      key: "summary",
      title: "Summary",
      content: e.summary,
      icon: FileText,
      color: "text-primary",
    },
    {
      key: "detail",
      title: "Detailed Explanation",
      content: e.detailed_explanation,
      icon: Brain,
      color: "text-secondary",
    },
    {
      key: "bio",
      title: "Biological Mechanism",
      content: e.biological_mechanism,
      icon: Dna,
      color: "text-success",
    },
    {
      key: "variant",
      title: "Variant Explanation",
      content: e.variant_explanation,
      icon: Sparkles,
      color: "text-warning",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
        >
          <Brain className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            AI-Generated Explanation
          </h3>
          <p className="text-xs text-muted-foreground">
            {loading
              ? "Generating summary for selected variant..."
              : selectedVariantRsid
              ? `Summary for ${selectedVariantRsid}`
              : "Powered by advanced language models"}
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible defaultValue="summary" className="space-y-3">
        {sections.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <AccordionItem
                value={s.key}
                className="border border-border rounded-xl overflow-hidden bg-card/30 hover:bg-card/50 transition-all"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${s.color.replace('text-', '')}/20 to-${s.color.replace('text-', '')}/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {s.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border"
                  >
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {s.content}
                    </p>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>

      {/* AI Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
      >
        {/* <Sparkles className="w-3 h-3" /> */}
        {/* <span>Generated with AI · Verified by clinical guidelines</span> */}
      </motion.div>
    </motion.div>
  );
};

export default ExplanationAccordion;
