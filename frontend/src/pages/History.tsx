import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserAnalysisHistory,
  AnalysisHistoryItem,
  deleteAnalysisHistoryItem,
} from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const History = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/auth", { state: { redirectTo: "/history" } });
      return;
    }

    const loadHistory = async () => {
      setFetching(true);
      try {
        const history = await getUserAnalysisHistory(user.id);
        setItems(history);
      } catch (error) {
        toast({
          title: "Unable to load history",
          description:
            error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    };

    loadHistory();
  }, [loading, navigate, toast, user]);

  const openResult = (item: AnalysisHistoryItem) => {
    navigate("/results", { state: { result: item.result_data } });
  };

  const handleDelete = async (item: AnalysisHistoryItem) => {
    if (!user) return;

    const confirmed = window.confirm(
      `Delete saved result for ${item.drug} (${item.patient_id})?`,
    );
    if (!confirmed) return;

    try {
      await deleteAnalysisHistoryItem(user.id, item.id);
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
      toast({
        title: "Deleted",
        description: "History item removed.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Analysis History
            </h1>
            <p className="text-muted-foreground">
              View and reopen your saved pharmacogenomic results.
            </p>
          </motion.div>

          {fetching ? (
            <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground">
              Loading your history...
            </div>
          ) : items.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-foreground font-medium mb-2">No saved results yet</p>
              <p className="text-sm text-muted-foreground">
                Run an analysis and click Save to Supabase on the results page.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{item.drug}</h2>
                      <p className="text-sm text-muted-foreground">
                        Patient: {item.patient_id} · Risk: {item.risk_label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Saved: {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openResult(item)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium"
                      >
                        Open Result
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-medium hover:border-primary/50 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;
