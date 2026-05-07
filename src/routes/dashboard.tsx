import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List, FileText, Layers, Search, Languages as LangIcon, MessageCircle,
  Play, ChevronLeft, ChevronRight, Quote, Check, Loader2, Plus, Sparkles,
  Send, Timer, Pause, Play as PlayIcon, RotateCcw, Trophy, CircleCheck,
  HelpCircle, Target, Flame,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot";
import { mockLecture, languages } from "@/lib/mock-data";
import { semanticSearch, chat as chatStream, translate } from "@/lib/api";
import { useProgress, useAchievements, useStudyTimer, fmtClock } from "@/lib/store";
import { celebrate } from "@/components/confetti";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type Tab = "summary" | "outline" | "flashcards" | "chat" | "search" | "quiz" | "translate";

function Dashboard() {
  const [tab, setTab] = useState<Tab>("summary");
  const [activeSection, setActiveSection] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { progress, markSection } = useProgress(mockLecture.videoId);
  const { achievements, unlock } = useAchievements();

  const seek = (seconds: number, sectionId?: number) => {
    if (sectionId) { setActiveSection(sectionId); markSection(sectionId); }
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${mockLecture.videoId}?start=${seconds}&autoplay=1&rel=0`;
    }
  };

  // Achievement: first section explored
  useEffect(() => {
    if (progress.sectionsCompleted.length === 1) {
      unlock({ id: "first-jump", title: "First jump", desc: "You jumped to a chapter timestamp." });
    }
    if (progress.sectionsCompleted.length >= 5) {
      unlock({ id: "five-chapters", title: "Five chapters", desc: "You explored 5+ chapters." });
    }
  }, [progress.sectionsCompleted.length, unlock]);

  const tabs: { id: Tab; label: string; icon: typeof List }[] = [
    { id: "summary", label: "Summary", icon: FileText },
    { id: "outline", label: "Outline", icon: List },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "search", label: "Search", icon: Search },
    { id: "quiz", label: "Quiz", icon: HelpCircle },
    { id: "translate", label: "Translate", icon: LangIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Title bar */}
      <div className="border-b border-border/60 bg-surface/30">
        <div className="mx-auto max-w-[1480px] px-4 md:px-8 py-5">
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
              <span className="opacity-30">/</span>
              <span className="text-primary">In session</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight leading-[1.05] max-w-4xl">
              {mockLecture.title}
            </h1>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-[1480px] px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Outline rail */}
          <aside className="lg:col-span-3 order-2 lg:order-1 space-y-6">
            <ProgressPanel />
            <OutlineRail activeSection={activeSection} onSeek={seek} completed={progress.sectionsCompleted} />
          </aside>

          {/* Center: Video + Tabs */}
          <section className="lg:col-span-6 order-1 lg:order-2 space-y-5">
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

            {/* Tab bar */}
            <div className="border-b border-border flex gap-0.5 overflow-x-auto scroll-thin -mx-1 px-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-3.5 py-3 text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
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

            <div className="min-h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === "outline" && <OutlineTab onSeek={seek} activeSection={activeSection} completed={progress.sectionsCompleted} />}
                  {tab === "summary" && <SummaryTab />}
                  {tab === "flashcards" && <FlashcardsTab onSeek={seek} />}
                  {tab === "chat" && <ChatTab />}
                  {tab === "search" && <SearchTab onSeek={seek} />}
                  {tab === "quiz" && <QuizTab />}
                  {tab === "translate" && <TranslateTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Right: Next best action + concepts + insights */}
          <aside className="lg:col-span-3 order-3 space-y-5">
            <NextBestAction tab={tab} setTab={setTab} />
            <StudyTimerPanel />
            <InsightsPanel />
            <ConceptsPanel onSearch={() => setTab("search")} />
            <AchievementsPanel achievements={achievements} />
          </aside>
        </div>
      </main>

      <Link
        to="/"
        className="lg:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full gradient-warm text-primary-foreground shadow-glow flex items-center justify-center z-40"
        aria-label="New video"
      >
        <Plus className="h-6 w-6" />
      </Link>

      <Footer />
    </div>
  );
}

/* ───────── Sidebars ───────── */

function ProgressPanel() {
  const { progress } = useProgress(mockLecture.videoId);
  const totalSections = mockLecture.outline.length;
  const totalCards = mockLecture.flashcards.length;
  const sectionsPct = Math.round((progress.sectionsCompleted.length / totalSections) * 100);
  const cardsPct = Math.round((progress.cardsReviewed.length / totalCards) * 100);
  const overall = Math.round(
    (sectionsPct + cardsPct + (progress.searchUsed ? 100 : 0) + (progress.chatUsed ? 100 : 0) + (progress.quizScore !== null ? 100 : 0)) / 5,
  );

  return (
    <div className="surface-elevated rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5">
          <Target className="h-3 w-3 text-primary" /> Lecture progress
        </div>
        <span className="font-serif text-xl tabular-nums">{overall}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full gradient-warm"
          initial={{ width: 0 }}
          animate={{ width: `${overall}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <div className="space-y-2 text-xs">
        <Row label="Chapters explored" value={`${progress.sectionsCompleted.length}/${totalSections}`} pct={sectionsPct} />
        <Row label="Flashcards reviewed" value={`${progress.cardsReviewed.length}/${totalCards}`} pct={cardsPct} />
        <Row label="Asked the chatbot" value={progress.chatUsed ? "✓" : "—"} pct={progress.chatUsed ? 100 : 0} />
        <Row label="Used search" value={progress.searchUsed ? "✓" : "—"} pct={progress.searchUsed ? 100 : 0} />
        <Row label="Quiz" value={progress.quizScore !== null ? `${progress.quizScore}%` : "—"} pct={progress.quizScore ?? 0} />
      </div>
    </div>
  );
}

function Row({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground flex-1">{label}</span>
      <span className="font-mono text-foreground tabular-nums">{value}</span>
      <div className="h-1 w-12 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function OutlineRail({ activeSection, onSeek, completed }: { activeSection: number; onSeek: (s: number, id?: number) => void; completed: number[] }) {
  return (
    <div className="lg:sticky lg:top-4">
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
        Chapters
      </div>
      <div className="space-y-px max-h-[58vh] overflow-y-auto scroll-thin">
        {mockLecture.outline.map((s) => {
          const active = s.id === activeSection;
          const done = completed.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onSeek(s.seconds, s.id)}
              className={`w-full text-left flex items-baseline gap-3 py-2.5 px-2 rounded transition group ${
                active ? "bg-primary/[0.08]" : "hover:bg-surface"
              }`}
            >
              <span className={`font-mono text-[10px] tabular-nums shrink-0 mt-0.5 ${active ? "text-primary" : "text-muted-foreground/60"}`}>
                {String(s.id).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm leading-snug transition flex items-center gap-1.5 ${active ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                  <span className="truncate">{s.title}</span>
                  {done && <CircleCheck className="h-3 w-3 text-success shrink-0" />}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground/60 mt-0.5 tabular-nums">
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

function NextBestAction({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { progress } = useProgress(mockLecture.videoId);
  const suggestion = useMemo(() => {
    if (progress.sectionsCompleted.length === 0) return { tab: "outline" as Tab, title: "Skim the outline", desc: "Get the lay of the land in 30 seconds." };
    if (!progress.chatUsed) return { tab: "chat" as Tab, title: "Ask Owlbert a question", desc: "The chatbot knows this lecture cold." };
    if (progress.cardsReviewed.length < 3) return { tab: "flashcards" as Tab, title: "Review 3 flashcards", desc: "Active recall locks in the concepts." };
    if (progress.quizScore === null) return { tab: "quiz" as Tab, title: "Take the 3-question quiz", desc: "Quick check on what stuck." };
    return { tab: "translate" as Tab, title: "All set — try translating", desc: "Read your study kit in another language." };
  }, [progress]);

  if (suggestion.tab === tab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 border border-primary/30 bg-primary/[0.05] relative overflow-hidden"
    >
      <div className="absolute -right-4 -bottom-4 opacity-15">
        <Mascot className="h-24 w-24" />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary mb-2 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3" /> Next best action
      </div>
      <div className="font-serif text-lg leading-tight mb-1">{suggestion.title}</div>
      <p className="text-xs text-muted-foreground mb-3 max-w-[200px]">{suggestion.desc}</p>
      <Button size="sm" variant="hero" className="rounded-md" onClick={() => setTab(suggestion.tab)}>
        Let's go <ChevronRight className="h-3 w-3 ml-1" />
      </Button>
    </motion.div>
  );
}

function StudyTimerPanel() {
  const { running, seconds, start, pause, reset } = useStudyTimer();
  const goal = 25 * 60; // 25 min pomodoro
  const pct = Math.min(100, (seconds / goal) * 100);
  const reachedGoal = seconds >= goal;
  const { unlock } = useAchievements();

  useEffect(() => {
    if (reachedGoal) {
      unlock({ id: "first-pomodoro", title: "First focus block", desc: "Completed a 25-minute study session." });
      celebrate();
      pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reachedGoal]);

  return (
    <div className="surface rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5">
          <Timer className="h-3 w-3 text-primary" /> Focus block
        </div>
        <span className="font-serif text-xl tabular-nums">{fmtClock(seconds)}</span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="flex items-center gap-1.5">
        {!running ? (
          <Button size="sm" variant="outline" className="flex-1 gap-1.5 h-8" onClick={start}>
            <PlayIcon className="h-3 w-3" /> Start
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="flex-1 gap-1.5 h-8" onClick={pause}>
            <Pause className="h-3 w-3" /> Pause
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={reset} aria-label="Reset">
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
      <div className="text-[10px] text-muted-foreground/70 mt-2 text-center">Goal: 25 min · then take a break</div>
    </div>
  );
}

function InsightsPanel() {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-primary" /> Insights
      </div>
      <div className="space-y-2">
        {mockLecture.insights.map((ins, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface rounded-lg p-3"
          >
            <div className="text-[9px] font-mono uppercase tracking-wider text-primary/80 mb-1">
              {ins.kind === "aha" ? "Aha" : ins.kind === "watchout" ? "Watch out" : "Connection"}
            </div>
            <p className="text-xs leading-relaxed text-foreground/85">
              {ins.text.split(/(\*[^*]+\*)/g).map((c, j) =>
                c.startsWith("*") && c.endsWith("*")
                  ? <em key={j} className="text-primary not-italic font-medium">{c.slice(1, -1)}</em>
                  : c,
              )}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ConceptsPanel({ onSearch }: { onSearch: () => void }) {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-primary" /> Key concepts
      </div>
      <div className="flex flex-wrap gap-1.5">
        {mockLecture.concepts.map((c, i) => (
          <motion.button
            key={c}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={onSearch}
            className="text-xs px-2.5 py-1 rounded-md surface text-foreground/85 hover:border-primary/40 hover:text-primary transition"
          >
            {c}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function AchievementsPanel({ achievements }: { achievements: { id: string; title: string; desc: string }[] }) {
  if (achievements.length === 0) return null;
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
        <Trophy className="h-3 w-3 text-primary" /> Achievements
      </div>
      <div className="space-y-1.5">
        {achievements.slice(0, 4).map((a) => (
          <div key={a.id} className="surface rounded-lg p-2.5 flex items-start gap-2">
            <div className="h-7 w-7 rounded-md gradient-warm flex items-center justify-center shrink-0">
              <Trophy className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs font-medium leading-tight">{a.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Tabs ───────── */

function OutlineTab({ activeSection, onSeek, completed }: { activeSection: number; onSeek: (s: number, id?: number) => void; completed: number[] }) {
  return (
    <div>
      <h3 className="font-serif text-2xl mb-6">Full lecture outline</h3>
      <ol className="relative border-l border-border ml-3 space-y-1">
        {mockLecture.outline.map((s) => {
          const active = s.id === activeSection;
          const done = completed.includes(s.id);
          return (
            <li key={s.id} className="pl-6 relative">
              <span className={`absolute -left-[5px] top-3.5 h-2 w-2 rounded-full ${active ? "bg-primary ring-4 ring-primary/15" : done ? "bg-success" : "bg-border"}`} />
              <button
                onClick={() => onSeek(s.seconds, s.id)}
                className={`w-full text-left flex items-center gap-4 py-3 pr-3 rounded-lg transition ${
                  active ? "bg-primary/[0.05]" : "hover:bg-surface"
                }`}
              >
                <span className="font-mono text-xs text-muted-foreground tabular-nums w-8">{String(s.id).padStart(2, "0")}</span>
                <span className={`flex-1 text-[15px] ${active ? "font-medium" : ""}`}>{s.title}</span>
                {done && <CircleCheck className="h-4 w-4 text-success" />}
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
                  : chunk,
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
  const { progress, markCard } = useProgress(mockLecture.videoId);
  const { unlock } = useAchievements();

  const nav = (dir: 1 | -1) => {
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i + dir + total) % total), 120);
  };

  const markReviewed = () => {
    markCard(idx);
    if (progress.cardsReviewed.length + 1 >= total) {
      unlock({ id: "all-cards", title: "Card master", desc: "Reviewed every flashcard." });
      celebrate();
    }
    nav(1);
  };

  const reviewedSet = new Set(progress.cardsReviewed);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-serif text-2xl">Flashcards</h3>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {String(idx + 1).padStart(2, "0")} <span className="opacity-50">/ {String(total).padStart(2, "0")}</span>
          <span className="opacity-50 ml-2">· {progress.cardsReviewed.length} reviewed</span>
        </span>
      </div>

      <div className="perspective-1000 mb-5">
        <motion.div
          className="relative w-full h-[340px] cursor-pointer preserve-3d"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.65, type: "spring", stiffness: 80, damping: 16 }}
          onClick={() => setFlipped((f) => !f)}
        >
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

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={() => nav(-1)} className="gap-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        <div className="flex gap-1.5 flex-1 justify-center">
          {mockLecture.flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFlipped(false); setIdx(i); }}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-8 bg-foreground" : reviewedSet.has(i) ? "w-1.5 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          {flipped && !reviewedSet.has(idx) && (
            <Button variant="hero" size="sm" onClick={markReviewed} className="gap-1">
              <Check className="h-3.5 w-3.5" /> Got it
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => nav(1)} className="gap-1">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ───────── Chat tab ───────── */
type ChatMsg = { role: "user" | "assistant"; content: string };

function ChatTab() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { progress, update } = useProgress(mockLecture.videoId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    setBusy(true);
    if (!progress.chatUsed) update({ chatUsed: true });
    const newMessages: ChatMsg[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    let acc = "";
    for await (const chunk of chatStream(content, newMessages)) {
      acc += chunk;
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: acc };
        return copy;
      });
    }
    setBusy(false);
  };

  const suggestions = [
    "Explain self-attention in plain English",
    "Why use multi-head attention?",
    "What's the role of LayerNorm?",
  ];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-serif text-2xl">Ask <em className="text-primary">anything</em>.</h3>
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">grounded in this lecture</span>
      </div>

      <div className="surface rounded-xl flex flex-col h-[460px] overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin p-5 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <Mascot className="h-20 w-20 mb-3 animate-float" animated />
              <div className="font-serif text-xl mb-1">Hi, I'm Owlbert.</div>
              <p className="text-sm text-muted-foreground max-w-sm mb-5">
                I've read every word of this lecture. Ask me anything — I'll cite the timestamp.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="h-7 w-7 rounded-full gradient-warm shrink-0 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "surface-elevated"
              }`}>
                {m.content.split(/(\*\*[^*]+\*\*)/g).map((c, j) =>
                  c.startsWith("**") && c.endsWith("**")
                    ? <strong key={j} className="font-semibold">{c.slice(2, -2)}</strong>
                    : c,
                )}
                {i === messages.length - 1 && busy && m.role === "assistant" && (
                  <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 align-middle animate-blink" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 p-3 bg-surface-elevated/30">
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Owlbert about the lecture…"
              className="flex-1 bg-transparent border-0 outline-none text-sm py-2 px-2 placeholder:text-muted-foreground/60"
              disabled={busy}
            />
            <Button type="submit" size="sm" variant="hero" disabled={busy || !input.trim()} className="gap-1.5 h-9">
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SearchTab({ onSeek }: { onSeek: (s: number) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Awaited<ReturnType<typeof semanticSearch>>>([]);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const { progress, update } = useProgress(mockLecture.videoId);

  const run = async (val: string) => {
    setQ(val);
    if (!val.trim()) { setResults([]); setHasRun(false); return; }
    setLoading(true);
    setHasRun(true);
    if (!progress.searchUsed) update({ searchUsed: true });
    const r = await semanticSearch(val);
    setResults(r);
    setLoading(false);
  };

  const confColor = (c: string) =>
    c === "high" ? "text-success border-success/40 bg-success/10" :
    c === "medium" ? "text-warning border-warning/40 bg-warning/10" :
    "text-destructive border-destructive/40 bg-destructive/10";

  return (
    <div>
      <h3 className="font-serif text-2xl mb-6">Find the <em className="text-primary">exact moment</em>.</h3>

      <form
        onSubmit={(e) => { e.preventDefault(); run(q); }}
        className="relative mb-4 surface rounded-xl focus-within:border-primary/50 transition"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. How does self-attention work?"
          className="w-full pl-11 pr-24 py-3.5 bg-transparent border-0 outline-none text-[15px]"
        />
        <Button
          type="submit"
          size="sm"
          variant="hero"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search"}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70 mr-1 self-center">Examples</span>
        {mockLecture.searchExamples.map((ex) => (
          <button
            key={ex}
            onClick={() => run(ex)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
          >
            {ex}
          </button>
        ))}
      </div>

      {!hasRun && (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Type a question to search across the entire lecture.</p>
        </div>
      )}

      {hasRun && loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface rounded-xl p-5 animate-pulse">
              <div className="h-3 w-24 bg-muted rounded mb-3" />
              <div className="h-4 w-full bg-muted rounded mb-2" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {hasRun && !loading && results.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground">No matches. Try rephrasing your question.</p>
        </div>
      )}

      <AnimatePresence>
        {hasRun && !loading && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {results.length} passages · Ranked by relevance
            </div>
            {results.map((r, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => onSeek(r.seconds)}
                className="w-full text-left surface rounded-xl p-5 hover:border-primary/40 hover:bg-primary/[0.02] transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${confColor(r.confidence)}`}>
                      {r.confidence} match
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {r.sectionTitle}
                    </span>
                  </div>
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
      </AnimatePresence>
    </div>
  );
}

function QuizTab() {
  const [answers, setAnswers] = useState<(number | null)[]>(mockLecture.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const { update } = useProgress(mockLecture.videoId);
  const { unlock } = useAchievements();

  const score = answers.reduce((acc: number, a, i) => acc + (a === mockLecture.quiz[i].answer ? 1 : 0), 0);
  const pct = Math.round((score / mockLecture.quiz.length) * 100);

  const submit = () => {
    setSubmitted(true);
    update({ quizScore: pct });
    if (pct === 100) {
      unlock({ id: "perfect-quiz", title: "Perfect score", desc: "100% on the quiz." });
      celebrate();
    } else if (pct >= 67) {
      unlock({ id: "passed-quiz", title: "Concept solid", desc: "Passed the quiz." });
    }
  };

  const reset = () => { setAnswers(mockLecture.quiz.map(() => null)); setSubmitted(false); };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-serif text-2xl">Quick check.</h3>
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{mockLecture.quiz.length} questions · 2 min</span>
      </div>

      <div className="space-y-5">
        {mockLecture.quiz.map((q, qi) => (
          <div key={qi} className="surface rounded-xl p-5">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">Q{qi + 1}</span>
              <p className="font-serif text-lg leading-snug">{q.q}</p>
            </div>
            <div className="space-y-2">
              {q.choices.map((c, ci) => {
                const selected = answers[qi] === ci;
                const correct = q.answer === ci;
                let cls = "border-border hover:border-foreground/40";
                if (submitted) {
                  if (correct) cls = "border-success/60 bg-success/10";
                  else if (selected && !correct) cls = "border-destructive/60 bg-destructive/10";
                  else cls = "border-border opacity-60";
                } else if (selected) {
                  cls = "border-primary/60 bg-primary/5";
                }
                return (
                  <button
                    key={ci}
                    onClick={() => !submitted && setAnswers((prev) => prev.map((a, i) => (i === qi ? ci : a)))}
                    disabled={submitted}
                    className={`w-full text-left text-sm px-4 py-2.5 rounded-lg border transition flex items-center gap-3 ${cls}`}
                  >
                    <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${selected ? "border-primary" : "border-border"}`}>
                      {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span className="flex-1">{c}</span>
                    {submitted && correct && <Check className="h-4 w-4 text-success" />}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-3 text-xs text-muted-foreground italic border-l-2 border-primary/40 pl-3">
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {submitted ? (
          <>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl tabular-nums">{score}<span className="text-muted-foreground text-2xl">/{mockLecture.quiz.length}</span></span>
              <span className="text-sm text-muted-foreground">
                {pct === 100 ? "Perfect — well done." : pct >= 67 ? "Solid grasp of the material." : "Worth another pass through the lecture."}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>Reset</Button>
          </>
        ) : (
          <Button
            variant="hero"
            disabled={answers.some((a) => a === null)}
            onClick={submit}
            className="ml-auto"
          >
            Check my answers <Flame className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

function TranslateTab() {
  const [active, setActive] = useState("en");
  const [loading, setLoading] = useState<string | null>(null);

  const select = async (code: string) => {
    if (code === active) return;
    setLoading(code);
    await translate(mockLecture.videoId, code);
    setActive(code);
    setLoading(null);
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
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-surface/50"
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
