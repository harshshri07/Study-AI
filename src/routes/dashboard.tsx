import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List, FileText, Layers, Search, Languages as LangIcon,
  Play, ChevronLeft, ChevronRight, Quote, Check, Loader2, Plus, Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { mockLecture, languages, mockSearchResults } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type Tab = "summary" | "outline" | "flashcards" | "search" | "translate";

function Dashboard() {
  const [tab, setTab] = useState<Tab>("summary");
  const [activeSection, setActiveSection] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const seek = (seconds: number, sectionId?: number) => {
    if (sectionId) setActiveSection(sectionId);
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${mockLecture.videoId}?start=${seconds}&autoplay=1&rel=0`;
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof List }[] = [
    { id: "summary", label: "Summary", icon: FileText },
    { id: "outline", label: "Outline", icon: List },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "search", label: "Search", icon: Search },
    { id: "translate", label: "Translate", icon: LangIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Title bar */}
      <div className="border-b border-border/60 bg-surface/30">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
              <span>{mockLecture.channel}</span>
              <span className="opacity-30">/</span>
              <span>{mockLecture.duration}</span>
              <span className="opacity-30">/</span>
              <span>{mockLecture.outline.length} chapters</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl tracking-tight leading-[1.05] max-w-4xl">
              {mockLecture.title}
            </h1>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Outline rail */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <OutlineRail activeSection={activeSection} onSeek={seek} />
          </aside>

          {/* Center: Video + Tabs */}
          <section className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-video rounded-xl overflow-hidden border border-border bg-black shadow-elegant"
            >
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${mockLecture.videoId}?rel=0`}
                title={mockLecture.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>

            {/* Tab bar — editorial style */}
            <div className="border-b border-border flex gap-1 overflow-x-auto scroll-thin">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-4 py-3 text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
                    tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" strokeWidth={2} />
                  {t.label}
                  {tab === t.id && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute -bottom-px left-0 right-0 h-px bg-foreground"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === "outline" && <OutlineTab onSeek={seek} activeSection={activeSection} />}
                  {tab === "summary" && <SummaryTab />}
                  {tab === "flashcards" && <FlashcardsTab onSeek={seek} />}
                  {tab === "search" && <SearchTab onSeek={seek} />}
                  {tab === "translate" && <TranslateTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Right: Concepts + Stats */}
          <aside className="lg:col-span-3 order-3 space-y-6">
            <ConceptsPanel />
            <StatsPanel />
          </aside>
        </div>
      </main>

      <Link
        to="/"
        className="lg:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-foreground text-background shadow-glow flex items-center justify-center z-40"
        aria-label="New video"
      >
        <Plus className="h-6 w-6" />
      </Link>

      <Footer />
    </div>
  );
}

/* ─── Sidebars ─── */

function OutlineRail({ activeSection, onSeek }: { activeSection: number; onSeek: (s: number, id?: number) => void }) {
  return (
    <div className="lg:sticky lg:top-20">
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-4">
        Chapters
      </div>
      <div className="space-y-px max-h-[70vh] overflow-y-auto scroll-thin">
        {mockLecture.outline.map((s) => {
          const active = s.id === activeSection;
          return (
            <button
              key={s.id}
              onClick={() => onSeek(s.seconds, s.id)}
              className={`w-full text-left flex items-baseline gap-3 py-2.5 px-2 rounded transition group ${
                active ? "bg-primary/[0.06]" : "hover:bg-surface"
              }`}
            >
              <span className={`font-mono text-[10px] tabular-nums shrink-0 mt-0.5 ${active ? "text-primary" : "text-muted-foreground/60"}`}>
                {String(s.id).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm leading-snug transition ${active ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {s.title}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground/60 mt-0.5 tabular-nums">
                  {s.time}
                </div>
              </div>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatsPanel() {
  const stats = [
    { label: "Chapters", value: mockLecture.outline.length },
    { label: "Cards", value: mockLecture.flashcards.length },
    { label: "Concepts", value: mockLecture.concepts.length },
  ];
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-4">
        Workspace
      </div>
      <div className="grid grid-cols-3 divide-x divide-border surface rounded-xl overflow-hidden">
        {stats.map((s) => (
          <div key={s.label} className="p-3 text-center">
            <div className="font-serif text-3xl tabular-nums leading-none">{s.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1.5 font-mono">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConceptsPanel() {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-4 flex items-center gap-2">
        <Sparkles className="h-3 w-3 text-primary" /> Key Concepts
      </div>
      <div className="flex flex-wrap gap-1.5">
        {mockLecture.concepts.map((c, i) => (
          <motion.span
            key={c}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="text-xs px-2.5 py-1 rounded-md surface text-foreground/85 hover:border-primary/40 hover:text-primary transition cursor-default"
          >
            {c}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ─── Tabs ─── */

function OutlineTab({ activeSection, onSeek }: { activeSection: number; onSeek: (s: number, id?: number) => void }) {
  return (
    <div>
      <h3 className="font-serif text-2xl mb-6">Full lecture outline</h3>
      <ol className="relative border-l border-border ml-3 space-y-1">
        {mockLecture.outline.map((s) => {
          const active = s.id === activeSection;
          return (
            <li key={s.id} className="pl-6 relative">
              <span className={`absolute -left-[5px] top-3.5 h-2 w-2 rounded-full ${active ? "bg-primary ring-4 ring-primary/15" : "bg-border"}`} />
              <button
                onClick={() => onSeek(s.seconds, s.id)}
                className={`w-full text-left flex items-center gap-4 py-3 pr-3 rounded-lg transition ${
                  active ? "bg-primary/[0.05]" : "hover:bg-surface"
                }`}
              >
                <span className="font-mono text-xs text-muted-foreground tabular-nums w-8">{String(s.id).padStart(2, "0")}</span>
                <span className={`flex-1 text-[15px] ${active ? "font-medium" : ""}`}>{s.title}</span>
                <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 tabular-nums">
                  <Play className="h-3 w-3 fill-current" /> {s.time}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SummaryTab() {
  const [mode, setMode] = useState<"short" | "medium" | "long">("medium");
  const modes = [
    { id: "short" as const, label: "TL;DR", time: "90 sec" },
    { id: "medium" as const, label: "Standard", time: "5 min" },
    { id: "long" as const, label: "Deep dive", time: "12 min" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h3 className="font-serif text-2xl">The lecture, <em className="text-primary">distilled</em>.</h3>
        <div className="flex items-center gap-1 surface rounded-lg p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition ${
                mode === m.id ? "text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode === m.id && (
                <motion.div
                  layoutId="summary-mode-bg"
                  className="absolute inset-0 bg-foreground rounded-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{m.label} <span className="opacity-60 font-mono ml-1">{m.time}</span></span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="prose prose-invert max-w-none"
        >
          {mockLecture.summaries[mode].split("\n\n").map((para, i) => (
            <p
              key={i}
              className={`leading-[1.75] mb-5 ${
                i === 0
                  ? "text-lg md:text-xl text-foreground/95 first-letter:font-serif first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none first-letter:text-primary"
                  : "text-[15px] text-foreground/85"
              }`}
            >
              {para.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) =>
                chunk.startsWith("**") && chunk.endsWith("**")
                  ? <strong key={j} className="text-foreground font-semibold">{chunk.slice(2, -2)}</strong>
                  : chunk
              )}
            </p>
          ))}
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

function FlashcardsTab({ onSeek }: { onSeek: (s: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = mockLecture.flashcards[idx];
  const total = mockLecture.flashcards.length;

  const nav = (dir: 1 | -1) => {
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i + dir + total) % total), 120);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-serif text-2xl">Flashcards</h3>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {String(idx + 1).padStart(2, "0")} <span className="opacity-50">/ {String(total).padStart(2, "0")}</span>
        </span>
      </div>

      {/* Card */}
      <div className="perspective-1000 mb-6">
        <motion.div
          className="relative w-full h-[340px] cursor-pointer preserve-3d"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.65, type: "spring", stiffness: 80, damping: 16 }}
          onClick={() => setFlipped((f) => !f)}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-2xl surface-elevated p-8 md:p-10 shadow-card flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                Question · Card {idx + 1}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onSeek(card.seconds); }}
                className="text-xs font-mono text-muted-foreground hover:text-primary flex items-center gap-1.5 tabular-nums"
              >
                <Play className="h-3 w-3" /> {card.time}
              </button>
            </div>
            <div className="flex-1 flex items-center">
              <p className="font-serif text-3xl md:text-4xl leading-[1.15] tracking-tight">{card.q}</p>
            </div>
            <div className="text-xs text-muted-foreground/70 font-mono uppercase tracking-wider">
              Tap to reveal answer →
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-foreground text-background p-8 md:p-10 shadow-elegant flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-background/60">
                Answer
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onSeek(card.seconds); }}
                className="text-xs font-mono text-background/70 hover:text-primary flex items-center gap-1.5 tabular-nums"
              >
                <Play className="h-3 w-3" /> {card.time}
              </button>
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-base md:text-lg leading-relaxed text-background/95">{card.a}</p>
            </div>
            <div className="text-xs text-background/50 font-mono uppercase tracking-wider">
              ← Tap to flip back
            </div>
          </div>
        </motion.div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => nav(-1)} className="gap-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        <div className="flex gap-1.5">
          {mockLecture.flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFlipped(false); setIdx(i); }}
              className={`h-1 rounded-full transition-all ${
                i === idx ? "w-8 bg-foreground" : "w-1 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => nav(1)} className="gap-1">
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function SearchTab({ onSeek }: { onSeek: (s: number) => void }) {
  const [q, setQ] = useState("");
  const [hasResults, setHasResults] = useState(false);

  const run = (val: string) => {
    setQ(val);
    setHasResults(val.trim().length > 0);
  };

  const confColor = (c: string) =>
    c === "high" ? "text-success border-success/40 bg-success/10" :
    c === "medium" ? "text-warning border-warning/40 bg-warning/10" :
    "text-destructive border-destructive/40 bg-destructive/10";

  return (
    <div>
      <h3 className="font-serif text-2xl mb-6">Ask the lecture <em className="text-primary">anything</em>.</h3>

      <div className="relative mb-4 surface rounded-xl focus-within:border-foreground/40 transition">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => run(e.target.value)}
          placeholder="e.g. How does self-attention work?"
          className="w-full pl-11 pr-4 py-3.5 bg-transparent border-0 outline-none text-[15px]"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70 mr-1 self-center">Examples</span>
        {mockLecture.searchExamples.map((ex) => (
          <button
            key={ex}
            onClick={() => run(ex)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition"
          >
            {ex}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {hasResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {mockSearchResults.length} passages · Ranked by relevance
            </div>
            {mockSearchResults.map((r, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => onSeek(r.seconds)}
                className="w-full text-left surface rounded-xl p-5 hover:border-foreground/40 transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${confColor(r.confidence)}`}>
                    {r.confidence} match
                  </span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums group-hover:text-primary transition flex items-center gap-1.5">
                    <Play className="h-3 w-3" /> {r.time}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Quote className="h-4 w-4 text-muted-foreground/40 mt-1 shrink-0" />
                  <p className="font-serif italic text-[17px] leading-relaxed text-foreground/90">{r.excerpt}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
        {!hasResults && (
          <div className="text-center py-16 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            Type a question above to search across the entire lecture.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TranslateTab() {
  const [active, setActive] = useState("en");
  const [loading, setLoading] = useState<string | null>(null);

  const select = (code: string) => {
    if (code === active) return;
    setLoading(code);
    setTimeout(() => { setActive(code); setLoading(null); }, 800);
  };

  return (
    <div>
      <h3 className="font-serif text-2xl mb-2">Translate <em className="text-primary">everything</em>.</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-md">
        Choose a language. Summary, flashcards, outline — translated together with structure preserved.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {languages.map((l) => {
          const isActive = active === l.code;
          const isLoading = loading === l.code;
          return (
            <button
              key={l.code}
              onClick={() => select(l.code)}
              className={`relative flex items-center gap-3 p-3 rounded-lg border transition text-sm ${
                isActive
                  ? "border-foreground bg-surface"
                  : "border-border hover:border-foreground/40 hover:bg-surface/50"
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span className="font-medium flex-1 text-left">{l.name}</span>
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              {isActive && !isLoading && <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
