import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Search, Languages, Layers, FileText, MessageCircle,
  Zap, BookOpen, Trophy,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { AnimatedBackground, Aurora } from "@/components/animated-bg";
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
    { icon: MessageCircle, title: "Lecture-aware chat", desc: "Ask anything. Answers cite the exact moment in the video." },
    { icon: Search, title: "Semantic search", desc: "Find the precise passage that answers your question." },
    { icon: Languages, title: "12 languages", desc: "Translate every artifact, preserving structure." },
    { icon: Trophy, title: "Gamified progress", desc: "Streaks, badges, and study-session goals — quietly." },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background — soft warm wash */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-[-15%] right-[-8%] h-[520px] w-[520px] rounded-full bg-primary/15 blur-[140px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px] animate-float" style={{ animationDelay: "5s" }} />
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-[1280px] px-4 md:px-10 pt-10 md:pt-16 pb-16">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="col-span-12 lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-7 surface rounded-full px-3 py-1.5"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                <span>A study companion, not a search engine</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-[clamp(2.6rem,6.5vw,5.25rem)] leading-[0.98] tracking-[-0.03em] font-semibold"
              >
                Read every lecture<br />
                <span className="font-serif italic font-normal text-muted-foreground">in the time it takes to</span>
                <br />make coffee.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-7 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                Paste a YouTube URL. Four AI agents extract, structure, and summarize the lecture into a calm, focused study workspace — with chat, flashcards, and semantic search built in.
              </motion.p>

              {/* URL input */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                onSubmit={(e) => { e.preventDefault(); submit(); }}
                className="mt-10 max-w-2xl"
              >
                <div className="flex items-center gap-2 surface rounded-2xl p-2 shadow-card focus-within:border-primary/60 focus-within:shadow-glow transition">
                  <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 text-muted-foreground border-r border-border/60">
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
                    className="rounded-xl gap-1.5 h-11 px-5"
                  >
                    Build my study kit <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70 mr-1">Try</span>
                  {exampleUrls.map((ex) => (
                    <button
                      key={ex.url}
                      type="button"
                      onClick={() => { setUrl(ex.url); submit(ex.url); }}
                      className="text-xs px-3 py-1.5 rounded-full border border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground/80">
                  <div className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> ~30s avg build time</div>
                  <div className="opacity-30">·</div>
                  <div className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-primary" /> Works on any captioned video</div>
                </div>
              </motion.form>
            </div>

            {/* Mascot panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block col-span-4 relative"
            >
              <div className="relative aspect-square max-w-[360px] ml-auto">
                <div className="absolute inset-4 rounded-[36px] gradient-warm opacity-20 blur-2xl" />
                <div className="relative h-full surface-elevated rounded-[28px] p-6 flex flex-col items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 dot-pattern opacity-50" />
                  <Mascot className="relative h-48 w-48 animate-float" animated />
                  <div className="relative mt-4 text-center">
                    <div className="font-serif text-2xl">Hi, I'm Owlbert.</div>
                    <div className="text-xs text-muted-foreground mt-1">I'll read the lecture so you can think about it.</div>
                  </div>
                </div>
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -left-3 surface-elevated rounded-xl px-3 py-2 shadow-card flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">4 agents · 1 workspace</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="mx-auto max-w-[1280px] px-4 md:px-10 pb-20">
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 md:col-span-4 flex flex-col justify-end pb-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
                §01 — What you get
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
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group surface rounded-xl p-5 hover:border-primary/40 hover:bg-primary/[0.02] transition relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/15 transition">
                      <c.icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
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
        <section className="mx-auto max-w-[1280px] px-4 md:px-10 pb-24">
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
            §02 — The pipeline
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight max-w-2xl mb-12">
            Four agents. <em className="text-primary">One</em> seamless workspace.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px surface rounded-xl overflow-hidden">
            {[
              { n: "01", t: "Extractor", d: "Pulls transcript, captions, and audio segments from the video." },
              { n: "02", t: "Structurer", d: "Detects chapters, key concepts, and the logical outline." },
              { n: "03", t: "Synthesizer", d: "Writes summaries at three depths and generates flashcards." },
              { n: "04", t: "Indexer", d: "Embeds every passage for semantic search and translation." },
            ].map((s, i) => (
              <div key={s.n} className="bg-background p-6 hover:bg-surface-elevated transition group relative">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
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
