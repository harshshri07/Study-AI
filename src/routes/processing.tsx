import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { z } from "zod";

const searchSchema = z.object({ url: z.string().optional() });

export const Route = createFileRoute("/processing")({
  validateSearch: searchSchema,
  component: ProcessingPage,
});

const stages = [
  { code: "01", title: "Extractor", task: "Pulling transcript & captions", detail: "Fetched 1,847 segments · 1h 56m" },
  { code: "02", title: "Structurer", task: "Detecting chapters & key concepts", detail: "Identified 9 sections · 14 concepts" },
  { code: "03", title: "Synthesizer", task: "Writing summaries & flashcards", detail: "Generated 3 summaries · 6 cards" },
  { code: "04", title: "Indexer", task: "Embedding for semantic search", detail: "Indexed 24,310 tokens" },
];

function ProcessingPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logIdx, setLogIdx] = useState(0);

  const logLines = [
    "› init: handshake with Bedrock gateway",
    "› extractor: streaming caption track …",
    "› extractor: 1,847 segments resolved",
    "› structurer: clustering by topic similarity",
    "› structurer: 9 chapters detected",
    "› synthesizer: drafting tier-1 summary",
    "› synthesizer: 6 Q/A pairs generated",
    "› indexer: building 1,536-d embeddings",
    "› indexer: vector store committed",
    "› ready: opening workspace …",
  ];

  useEffect(() => {
    const stageT = setInterval(() => {
      setStage((s) => {
        if (s >= stages.length - 1) {
          clearInterval(stageT);
          setTimeout(() => navigate({ to: "/dashboard" }), 700);
          return s + 1;
        }
        return s + 1;
      });
    }, 1100);

    const progT = setInterval(() => setProgress((p) => Math.min(p + 1.2, 99)), 50);
    const logT = setInterval(() => setLogIdx((i) => Math.min(i + 1, logLines.length)), 450);

    return () => { clearInterval(stageT); clearInterval(progT); clearInterval(logT); };
  }, [navigate, logLines.length]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px] animate-pulse-soft" />
      </div>

      <Header />

      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 md:px-8 py-12 md:py-20">
        {/* Heading */}
        <div className="mb-12 max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Workspace · Building
          </div>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight leading-[1.02]">
            Reading the lecture<span className="text-primary animate-blink">_</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-base">
            Four agents are working in sequence. This usually takes about 30 seconds.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Progress</span>
            <span className="font-serif text-2xl tabular-nums">{Math.floor(progress)}<span className="text-muted-foreground text-base">%</span></span>
          </div>
          <div className="h-px bg-border relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-foreground"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              style={{ height: "1px" }}
            />
            <motion.div
              className="absolute top-0 h-2 w-2 rounded-full bg-primary -translate-y-1/2 shadow-glow"
              animate={{ left: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Stages */}
          <div className="lg:col-span-3 space-y-2">
            {stages.map((s, i) => {
              const status = i < stage ? "done" : i === stage ? "active" : "pending";
              return (
                <motion.div
                  key={s.code}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`group flex items-start gap-5 p-5 rounded-xl border transition-all ${
                    status === "active"
                      ? "border-primary/40 bg-primary/[0.04]"
                      : status === "done"
                      ? "border-border bg-surface/50 opacity-60"
                      : "border-border/60 bg-transparent opacity-40"
                  }`}
                >
                  <div className="font-serif text-3xl text-muted-foreground tabular-nums shrink-0 leading-none mt-1">
                    {s.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold tracking-tight">{s.title}</h3>
                      {status === "active" && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-primary px-1.5 py-0.5 rounded border border-primary/40">
                          running
                        </span>
                      )}
                      {status === "done" && (
                        <Check className="h-4 w-4 text-success" strokeWidth={2.5} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{s.task}</p>
                    <AnimatePresence>
                      {status !== "pending" && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs font-mono text-muted-foreground/70 mt-2"
                        >
                          → {s.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Log console */}
          <div className="lg:col-span-2">
            <div className="surface rounded-xl overflow-hidden lg:sticky lg:top-20">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-surface-elevated/50">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-destructive/60" />
                  <span className="h-2 w-2 rounded-full bg-warning/60" />
                  <span className="h-2 w-2 rounded-full bg-success/60" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground ml-2">
                  agent.log
                </span>
              </div>
              <div className="p-4 font-mono text-[11px] leading-relaxed text-muted-foreground space-y-1 min-h-[280px]">
                {logLines.slice(0, logIdx).map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={i === logIdx - 1 ? "text-foreground" : ""}
                  >
                    {l}
                  </motion.div>
                ))}
                {logIdx < logLines.length && <span className="text-primary animate-blink">▍</span>}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
