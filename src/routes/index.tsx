import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Youtube, ArrowRight, Sparkles, Brain, Search, Languages, Clock } from "lucide-react";
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

  const features = [
    { icon: Brain, label: "4 AI Agents" },
    { icon: Sparkles, label: "Smart Flashcards" },
    { icon: Search, label: "Semantic Search" },
    { icon: Languages, label: "12 Languages" },
    { icon: Clock, label: "Timestamp Links" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Powered by Claude Sonnet via Amazon Bedrock
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Turn any lecture into{" "}
            <span className="gradient-text">your study kit</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Paste a YouTube URL. AI agents build your study dashboard in seconds.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={(e) => { e.preventDefault(); submit(); }}
            className="mt-10 group"
          >
            <div className="relative flex items-center glass rounded-2xl p-2 shadow-elegant focus-within:ring-2 focus-within:ring-primary/50 transition">
              <div className="pl-3 pr-2 text-muted-foreground">
                <Youtube className="h-5 w-5" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-transparent border-0 outline-none text-base py-3 placeholder:text-muted-foreground/60"
              />
              <Button
                type="submit"
                size="lg"
                variant="hero"
                className="rounded-xl gap-1.5"
              >
                Analyze <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-muted-foreground mr-1">Try:</span>
            {exampleUrls.map((ex) => (
              <button
                key={ex.url}
                onClick={() => { setUrl(ex.url); submit(ex.url); }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface/50 hover:bg-accent hover:border-primary/40 transition"
              >
                {ex.label}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            {features.map((f, i) => (
              <div key={f.label} className="flex items-center gap-1.5">
                <f.icon className="h-4 w-4 text-primary" />
                <span>{f.label}</span>
                {i < features.length - 1 && <span className="ml-6 text-border hidden md:inline">·</span>}
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
