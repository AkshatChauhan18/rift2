import { Download, Copy, Check, FileText } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnalysisResult } from "@/utils/mockData";

const DownloadButtons = ({ data }: { data: AnalysisResult }) => {
  const [copied, setCopied] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pharmaguard_${data.patient_id}_${data.drug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      // Dynamic import to reduce bundle size
      const { default: jsPDF } = await import('jspdf');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Page settings
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Helper function to add text with auto page break
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(color[0], color[1], color[2]);
        
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
          if (yPosition + 10 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        
        yPosition += 3;
      };

      const addSection = (title: string, content: string) => {
        addText(title, 12, true, [0, 0, 0]);
        addText(content, 10, false, [0, 0, 0]);
        yPosition += 5;
      };

      const addLine = () => {
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
      };

      // Title
      addText('PharmaGuard Analysis Report', 18, true, [0, 0, 0]);
      addLine();

      // Patient and Drug Info
      addSection('Patient ID:', data.patient_id);
      addSection('Drug:', data.drug);
      addSection('Analysis Date:', new Date(data.timestamp).toLocaleString());
      
      addLine();

      // Risk Assessment
      addText('RISK ASSESSMENT', 14, true, [0, 0, 0]);
      yPosition += 2;
      
      addText(`Risk Level: ${data.risk_assessment.risk_label}`, 11, true, [0, 0, 0]);
      addText(`Confidence Score: ${(data.risk_assessment.confidence_score * 100).toFixed(1)}%`, 10, false, [0, 0, 0]);
      addText(`Severity: ${data.risk_assessment.severity.toUpperCase()}`, 10, false, [0, 0, 0]);
      
      addLine();

      // Pharmacogenomic Profile
      addText('PHARMACOGENOMIC PROFILE', 14, true, [0, 0, 0]);
      yPosition += 2;
      
      addText(`Primary Gene: ${data.pharmacogenomic_profile.primary_gene}`, 11, true, [0, 0, 0]);
      addText(`Diplotype: ${data.pharmacogenomic_profile.diplotype}`, 10, false, [0, 0, 0]);
      addText(`Phenotype: ${data.pharmacogenomic_profile.phenotype}`, 10, false, [0, 0, 0]);
      yPosition += 3;
      
      if (data.pharmacogenomic_profile.detected_variants && data.pharmacogenomic_profile.detected_variants.length > 0) {
        addText('Detected Variants:', 11, true, [0, 0, 0]);
        data.pharmacogenomic_profile.detected_variants.forEach((variant: any) => {
          addText(`• ${variant.rsid} (${variant.gene}): ${variant.variant_info}`, 9, false, [0, 0, 0]);
        });
      }
      
      addLine();

      // Clinical Recommendation
      addText('CLINICAL RECOMMENDATION', 14, true, [0, 0, 0]);
      yPosition += 2;
      
      addSection('Summary:', data.clinical_recommendation.summary);
      addSection('Dosage Recommendation:', data.clinical_recommendation.dosage_recommendation);
      
      if (data.clinical_recommendation.warnings && data.clinical_recommendation.warnings.length > 0) {
        addText('Warnings:', 11, true, [0, 0, 0]);
        data.clinical_recommendation.warnings.forEach((warning: string) => {
          addText(`• ${warning}`, 10, false, [0, 0, 0]);
        });
      }
      
      addLine();

      // LLM Generated Explanation
      addText('DETAILED EXPLANATION', 14, true, [0, 0, 0]);
      yPosition += 2;
      
      addSection('Summary:', data.llm_generated_explanation.summary);
      addSection('Detailed Explanation:', data.llm_generated_explanation.detailed_explanation);
      addSection('Biological Mechanism:', data.llm_generated_explanation.biological_mechanism);
      addSection('Variant Explanation:', data.llm_generated_explanation.variant_explanation);

      // Footer on last page
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Generated by PharmaGuard - Pharmacogenomic Analysis System', margin, pageHeight - 10);

      pdf.save(`pharmaguard_${data.patient_id}_${data.drug}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExportPDF}
        disabled={exportingPDF}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText className="w-4 h-4" />
        {exportingPDF ? 'Generating PDF...' : 'Export PDF'}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card font-semibold text-sm transition-all"
      >
        <Download className="w-4 h-4" />
        Download JSON
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card font-semibold text-sm transition-all"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-success" />
              <span className="text-success">Copied!</span>
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy to Clipboard</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default DownloadButtons;
