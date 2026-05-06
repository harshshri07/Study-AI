import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { z } from "zod";

const searchSchema = z.object({ url: z.string().optional() });

export const Route = createFileRoute("/processing")({
  validateSearch: searchSchema,
  component: ProcessingPage,
});

const stages = [
  { title: "Extracting Transcript", desc: "Pulling captions and audio segments" },
  { title: "Structuring Outline", desc: "Identifying chapters and key concepts" },
  { title: "Generating Study Materials", desc: "Building summaries, flashcards & search index" },
];

function ProcessingPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageT = setInterval(() => {
      setStage((s) => {
        if (s >= stages.length - 1) {
          clearInterval(stageT);
          setTimeout(() => navigate({ to: "/dashboard" }), 800);
          return s + 1;
        }
        return s + 1;
      });
    }, 1400);

    const progT = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 98));
    }, 80);

    return () => { clearInterval(stageT); clearInterval(progT); };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-primary/15 blur-3xl animate-pulse-glow" />
      </div>

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <div className="glass rounded-2xl shadow-elegant overflow-hidden">
            {/* Top progress bar */}
            <div className="h-1 bg-muted relative overflow-hidden">
              <motion.div
                className="h-full gradient-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Analyzing Your Lecture<span className="gradient-text">...</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Our AI agents are reading every second of the video
                </p>
              </div>

              <div className="space-y-3">
                {stages.map((s, i) => {
                  const status = i < stage ? "done" : i === stage ? "active" : "pending";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                        status === "active"
                          ? "border-primary/50 bg-primary/5"
                          : status === "done"
                          ? "border-success/30 bg-success/5"
                          : "border-border bg-surface/30"
                      }`}
                    >
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center shrink-0">
                        <AnimatePresence mode="wait">
                          {status === "done" && (
                            <motion.div key="d" initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="h-6 w-6 rounded-full bg-success flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-success-foreground" strokeWidth={3} />
                            </motion.div>
                          )}
                          {status === "active" && (
                            <motion.div key="a" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <Loader2 className="h-5 w-5 text-primary animate-spin" />
                            </motion.div>
                          )}
                          {status === "pending" && (
                            <Circle key="p" className="h-5 w-5 text-muted-foreground/40" />
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${status === "pending" ? "text-muted-foreground" : ""}`}>
                          {s.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
