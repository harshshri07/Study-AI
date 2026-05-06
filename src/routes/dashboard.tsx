import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List, FileText, Layers, Search, Languages as LangIcon,
  Play, ChevronLeft, ChevronRight, Clock, Sparkles, Quote, Check, Loader2, Plus,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { mockLecture, languages, mockSearchResults } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type Tab = "outline" | "summary" | "flashcards" | "search" | "translate";

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
    { id: "outline", label: "Outline", icon: List },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "search", label: "Search", icon: Search },
    { id: "translate", label: "Translate", icon: LangIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-[1600px] px-4 md:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {mockLecture.channel} · {mockLecture.duration}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{mockLecture.title}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Outline */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <OutlinePanel activeSection={activeSection} onSeek={seek} />
          </aside>

          {/* Center: Video + Tabs */}
          <section className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-video rounded-2xl overflow-hidden shadow-elegant border border-border bg-black"
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

            {/* Tab bar */}
            <div className="glass rounded-2xl p-1.5 overflow-x-auto">
              <div className="flex gap-1 relative min-w-max">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                      tab === t.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === t.id && (
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 gradient-primary rounded-xl shadow-glow"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <t.icon className="h-4 w-4" />
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="glass rounded-2xl p-6 md:p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
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

          {/* Right: Stats + Concepts */}
          <aside className="lg:col-span-3 order-3 space-y-5">
            <StatsPanel />
            <ConceptsPanel />
          </aside>
        </div>
      </main>

      {/* Mobile FAB */}
      <Link
        to="/"
        className="lg:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full gradient-primary shadow-glow flex items-center justify-center z-40"
        aria-label="New video"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Link>

      <Footer />
    </div>
  );
}

/* ─── Sidebars ─── */

function OutlinePanel({ activeSection, onSeek }: { activeSection: number; onSeek: (s: number, id?: number) => void }) {
  return (
    <div className="glass rounded-2xl p-4 lg:sticky lg:top-20">
      <div className="flex items-center gap-2 px-2 py-1 mb-2">
        <List className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Lecture Outline</h2>
      </div>
      <div className="space-y-0.5 max-h-[60vh] overflow-y-auto">
        {mockLecture.outline.map((s) => {
          const active = s.id === activeSection;
          return (
            <button
              key={s.id}
              onClick={() => onSeek(s.seconds, s.id)}
              className={`w-full text-left flex items-start gap-3 p-2.5 rounded-lg transition group ${
                active ? "bg-primary/15 border border-primary/30" : "hover:bg-accent border border-transparent"
              }`}
            >
              <span className={`text-xs font-mono mt-0.5 shrink-0 w-5 ${active ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {String(s.id).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm leading-snug ${active ? "font-medium" : ""}`}>{s.title}</div>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground font-mono">
                  <Clock className="h-3 w-3" />
                  {s.time}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatsPanel() {
  const stats = [
    { label: "Sections", value: mockLecture.outline.length },
    { label: "Flashcards", value: mockLecture.flashcards.length },
    { label: "Concepts", value: mockLecture.concepts.length },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass rounded-xl p-3 text-center"
        >
          <div className="text-2xl font-bold gradient-text">{s.value}</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ConceptsPanel() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Key Concepts</h2>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {mockLecture.concepts.map((c, i) => (
          <motion.span
            key={c}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25 transition cursor-default"
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
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">Full Lecture Outline</h3>
      {mockLecture.outline.map((s) => (
        <button
          key={s.id}
          onClick={() => onSeek(s.seconds, s.id)}
          className={`w-full flex items-center gap-4 p-3 rounded-xl border text-left transition ${
            s.id === activeSection ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent"
          }`}
        >
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
            {s.id}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{s.title}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <Play className="h-3 w-3 fill-current" /> {s.time}
          </div>
        </button>
      ))}
    </div>
  );
}

function SummaryTab() {
  const [mode, setMode] = useState<"short" | "medium" | "long">("medium");
  const modes = [
    { id: "short" as const, icon: "⚡", label: "90-Second" },
    { id: "medium" as const, icon: "📖", label: "5-Minute" },
    { id: "long" as const, icon: "🔬", label: "Deep Dive" },
  ];
  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
              mode === m.id
                ? "border-primary/50 bg-primary/15 text-foreground"
                : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="mr-1.5">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="prose prose-invert max-w-none"
        >
          {mockLecture.summaries[mode].split("\n\n").map((para, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-foreground/90 mb-4 whitespace-pre-line">
              {para.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) =>
                chunk.startsWith("**") && chunk.endsWith("**")
                  ? <strong key={j} className="text-primary font-semibold">{chunk.slice(2, -2)}</strong>
                  : chunk
              )}
            </p>
          ))}
        </motion.div>
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
    setTimeout(() => setIdx((i) => (i + dir + total) % total), 150);
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground">Card {idx + 1} of {total}</span>
        <span className="text-xs text-muted-foreground">{Math.round(((idx + 1) / total) * 100)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full gradient-primary"
          animate={{ width: `${((idx + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>

      {/* Card */}
      <div className="perspective-1000 mb-6">
        <motion.div
          className="relative w-full h-72 cursor-pointer preserve-3d"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 18 }}
          onClick={() => setFlipped((f) => !f)}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-2xl gradient-hero p-8 shadow-elegant flex flex-col">
            <div className="text-xs uppercase tracking-wider text-white/70 font-medium">Question</div>
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-xl md:text-2xl font-semibold text-white leading-snug">{card.q}</p>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-white/60">Tap to reveal answer</span>
              <button
                onClick={(e) => { e.stopPropagation(); onSeek(card.seconds); }}
                className="text-xs px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white flex items-center gap-1 backdrop-blur"
              >
                <Play className="h-3 w-3" /> {card.time}
              </button>
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-card border border-border p-8 shadow-elegant flex flex-col">
            <div className="text-xs uppercase tracking-wider text-primary font-medium">Answer</div>
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-base md:text-lg text-foreground leading-relaxed">{card.a}</p>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground">Tap to flip back</span>
              <button
                onClick={(e) => { e.stopPropagation(); onSeek(card.seconds); }}
                className="text-xs px-2.5 py-1 rounded-md bg-primary/15 hover:bg-primary/25 text-primary flex items-center gap-1"
              >
                <Play className="h-3 w-3" /> {card.time}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => nav(-1)}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <div className="flex gap-1.5">
          {mockLecture.flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFlipped(false); setIdx(i); }}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => nav(1)}>
          Next <ChevronRight className="h-4 w-4" />
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
    c === "high" ? "bg-success/20 text-success border-success/40" :
    c === "medium" ? "bg-warning/20 text-warning border-warning/40" :
    "bg-destructive/20 text-destructive border-destructive/40";

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => run(e.target.value)}
          placeholder="Ask anything about the lecture..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs text-muted-foreground">Try:</span>
        {mockLecture.searchExamples.map((ex) => (
          <button
            key={ex}
            onClick={() => run(ex)}
            className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-primary/40 hover:bg-accent transition"
          >
            {ex}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {hasResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {mockSearchResults.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-surface/40 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${confColor(r.confidence)}`}>
                    {r.confidence}
                  </span>
                  <Quote className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm italic text-foreground/85 leading-relaxed flex-1">{r.excerpt}</p>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => onSeek(r.seconds)}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Jump to {r.time} <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {!hasResults && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Type a question to search across the entire lecture.
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
    setTimeout(() => { setActive(code); setLoading(null); }, 900);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">Translate Study Materials</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Choose a language to translate the summary, flashcards, and outline.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {languages.map((l) => {
          const isActive = active === l.code;
          const isLoading = loading === l.code;
          return (
            <button
              key={l.code}
              onClick={() => select(l.code)}
              className={`relative flex items-center gap-2.5 p-3 rounded-xl border transition text-sm ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40 hover:bg-accent"
              }`}
            >
              <span className="text-xl">{l.flag}</span>
              <span className="font-medium flex-1 text-left">{l.name}</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              {isActive && !isLoading && <Check className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
