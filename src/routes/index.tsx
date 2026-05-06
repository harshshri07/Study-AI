import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Search, Languages, Layers, FileText } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { exampleUrls } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: HeroPage,
});

function HeroPage() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const submit = (value?: string) => {
    const v = (value ?? url).trim();
    if (!v) return;
    navigate({ to: "/processing", search: { url: v } });
  };

  const capabilities = [
    { icon: FileText, title: "Three-tier summaries", desc: "From a 90-second TL;DR to a deep, sectioned breakdown." },
    { icon: Layers, title: "Auto flashcards", desc: "Concept-level Q&A with timestamps back to the source." },
    { icon: Search, title: "Semantic search", desc: "Ask anything. Get answers grounded in the lecture." },
    { icon: Languages, title: "12 languages", desc: "Translate every artifact, preserving structure." },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-[1400px] px-4 md:px-8 pt-16 md:pt-24 pb-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
              <span>Cloudforce Hackathon · 2026</span>
              <span className="opacity-30">/</span>
              <span>Built on Bedrock</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.03em] font-semibold"
            >
              Read every lecture<br />
              <span className="font-serif italic font-normal text-muted-foreground">in the time it takes to</span>
              <br />make coffee.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Paste a YouTube URL. Four AI agents extract, structure, summarize, and index the entire video into a study workspace you can actually use.
            </motion.p>

            {/* URL input */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="mt-12 max-w-2xl"
            >
              <div className="flex items-center gap-2 surface rounded-xl p-1.5 shadow-card focus-within:border-primary/60 transition">
                <div className="flex items-center gap-2 pl-3 pr-1 text-muted-foreground border-r border-border/60">
                  <span className="font-mono text-xs uppercase tracking-wider">URL</span>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="youtube.com/watch?v=..."
                  className="flex-1 bg-transparent border-0 outline-none text-base py-2.5 px-3 placeholder:text-muted-foreground/50"
                />
                <Button
                  type="submit"
                  size="default"
                  variant="hero"
                  className="rounded-lg gap-1.5 h-10 px-5"
                >
                  Analyze <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70 mr-1">Try</span>
                {exampleUrls.map((ex) => (
                  <button
                    key={ex.url}
                    type="button"
                    onClick={() => { setUrl(ex.url); submit(ex.url); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </motion.form>
          </div>
        </section>

        {/* Capabilities — editorial, asymmetric */}
        <section className="mx-auto max-w-[1400px] px-4 md:px-8 pb-24">
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 md:col-span-4 flex flex-col justify-end pb-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
                §01 — Capabilities
              </div>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                A study kit, <em className="text-primary">assembled</em> for you.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilities.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group surface rounded-xl p-5 hover:border-foreground/30 transition relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <c.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                    <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-1.5 tracking-tight">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="mx-auto max-w-[1400px] px-4 md:px-8 pb-24">
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
            §02 — The Pipeline
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight max-w-2xl mb-12">
            Four agents. <em className="text-primary">One</em> seamless workspace.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px surface rounded-xl overflow-hidden border-border">
            {[
              { n: "01", t: "Extractor", d: "Pulls transcript, captions, and audio segments from the video." },
              { n: "02", t: "Structurer", d: "Detects chapters, key concepts, and the logical outline." },
              { n: "03", t: "Synthesizer", d: "Writes summaries at three depths and generates flashcards." },
              { n: "04", t: "Indexer", d: "Embeds every passage for semantic search and translation." },
            ].map((s, i) => (
              <div key={s.n} className="bg-background p-6 hover:bg-surface-elevated transition group relative">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Agent {s.n}</span>
                </div>
                <h3 className="font-serif text-2xl mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                {i < 3 && <ArrowRight className="hidden md:block absolute right-[-10px] top-1/2 -translate-y-1/2 h-4 w-4 text-border" />}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
