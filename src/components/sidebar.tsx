import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus, Moon, Sun, GraduationCap, ClipboardCheck, Map, Trash2, X,
  Trophy, Lock, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useRecents, useMode, useUnlock, useAchievements, type Mode } from "@/lib/store";
import { Mascot } from "./mascot";

const modes: { id: Mode; label: string; icon: typeof GraduationCap; locked: boolean; route: string }[] = [
  { id: "student", label: "Student", icon: GraduationCap, locked: false, route: "/" },
  { id: "faculty", label: "Faculty Audit", icon: ClipboardCheck, locked: true, route: "/faculty" },
  { id: "provost", label: "Provost Map", icon: Map, locked: true, route: "/provost" },
];

export function Sidebar() {
  const { theme, toggle } = useTheme();
  const { recents, removeRecent, clearRecents } = useRecents();
  const [mode, setMode] = useMode();
  const { unlocks, submitCode } = useUnlock();
  const { achievements } = useAchievements();
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState<Mode | null>(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const handleMode = (m: typeof modes[number]) => {
    if (m.locked && !unlocks[m.id]) {
      setUnlockOpen(m.id);
      setCode("");
      setErr("");
      return;
    }
    setMode(m.id);
    navigate({ to: m.route });
  };

  const submit = () => {
    const which = submitCode(code);
    if (which) {
      setMode(which);
      setUnlockOpen(null);
      const route = modes.find((m) => m.id === which)?.route ?? "/";
      navigate({ to: route });
    } else {
      setErr("Invalid code. Try FACULTY-2026 or PROVOST-2026.");
    }
  };

  if (collapsed) {
    return (
      <aside className="h-screen sticky top-0 w-14 shrink-0 border-r border-border/60 bg-surface/40 flex flex-col items-center py-4 gap-3 z-40">
        <button
          onClick={() => setCollapsed(false)}
          className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-surface hover:text-foreground"
          aria-label="Expand sidebar"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
        <Link
          to="/"
          className="h-9 w-9 rounded-md bg-foreground text-background flex items-center justify-center font-serif"
          aria-label="StudyAI home"
        >
          S
        </Link>
        <div className="w-8 h-px bg-border" />
        {modes.map((m) => {
          const isActive = mode === m.id;
          const isLocked = m.locked && !unlocks[m.id];
          return (
            <button
              key={m.id}
              onClick={() => handleMode(m)}
              title={m.label + (isLocked ? " (locked)" : "")}
              className={`relative h-9 w-9 rounded-md flex items-center justify-center transition ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              <m.icon className="h-4 w-4" />
              {isLocked && <Lock className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5" />}
            </button>
          );
        })}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={toggle}
            className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="h-screen sticky top-0 w-64 shrink-0 border-r border-border/60 bg-surface/40 flex flex-col z-40">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center font-serif text-base leading-none">
              S
            </div>
            <div>
              <div className="text-[14px] font-semibold tracking-tight leading-none">StudyAI</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">v0.1 · beta</div>
            </div>
          </Link>
          <button
            onClick={() => setCollapsed(true)}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        </div>

        {/* New lecture */}
        <div className="px-3 pb-3">
          <Link
            to="/"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition text-sm"
          >
            <Plus className="h-4 w-4 text-primary" />
            <span className="font-medium">New lecture</span>
          </Link>
        </div>

        {/* Modes */}
        <div className="px-3 pb-2">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70 px-1 mb-2">
            Mode
          </div>
          <div className="space-y-0.5">
            {modes.map((m) => {
              const isActive = mode === m.id;
              const isLocked = m.locked && !unlocks[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() => handleMode(m)}
                  className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <m.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1 text-left">{m.label}</span>
                  {isLocked && <Lock className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recents */}
        <div className="px-3 pb-2 flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
              Recent lectures
            </div>
            {recents.length > 0 && (
              <button
                onClick={() => { if (confirm("Clear all recents?")) clearRecents(); }}
                className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 hover:text-destructive"
                aria-label="Clear recents"
              >
                clear
              </button>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scroll-thin space-y-0.5 pr-1">
            {recents.length === 0 && (
              <div className="px-3 py-4 text-xs text-muted-foreground/60 italic">
                No recent lectures yet — paste a URL to get started.
              </div>
            )}
            {recents.map((r) => {
              const isActive = path === "/dashboard";
              return (
                <div
                  key={r.id}
                  className={`group relative rounded-md transition ${
                    isActive ? "bg-surface" : "hover:bg-surface"
                  }`}
                >
                  <Link
                    to="/dashboard"
                    className="flex items-start gap-2.5 px-2.5 py-2 pr-7"
                  >
                    <div className="h-8 w-12 rounded bg-muted shrink-0 overflow-hidden">
                      <img
                        src={`https://i.ytimg.com/vi/${r.videoId}/mqdefault.jpg`}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] leading-tight line-clamp-2 text-foreground/90">
                        {r.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">
                        {r.channel}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeRecent(r.id)}
                    className="absolute top-1.5 right-1.5 h-5 w-5 rounded flex items-center justify-center text-muted-foreground/0 group-hover:text-muted-foreground hover:bg-background hover:text-destructive transition"
                    aria-label={`Remove ${r.title}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements + theme footer */}
        <div className="border-t border-border/60 px-3 py-3 space-y-2">
          {achievements.length > 0 && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition"
            >
              <Trophy className="h-3.5 w-3.5 text-primary" />
              <span>{achievements.length} achievement{achievements.length === 1 ? "" : "s"}</span>
            </Link>
          )}
          <button
            onClick={toggle}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </div>
      </aside>

      {/* Unlock modal */}
      {unlockOpen && (
        <div
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setUnlockOpen(null)}
        >
          <div
            className="w-full max-w-md surface-elevated rounded-2xl p-6 shadow-elegant relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setUnlockOpen(null)}
              className="absolute top-3 right-3 h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-surface"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Creator tools</div>
                <h3 className="font-serif text-2xl mt-0.5">
                  {unlockOpen === "faculty" ? "Faculty Audit" : "Provost Map"}
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These tools are gated by an institution code. Try the demo code to explore.
            </p>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder={unlockOpen === "faculty" ? "FACULTY-2026" : "PROVOST-2026"}
                className="flex-1 px-3 py-2 rounded-md surface text-sm font-mono outline-none focus:border-primary/50"
                autoFocus
              />
              <button
                onClick={submit}
                className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90"
              >
                Unlock
              </button>
            </div>
            {err && <div className="text-xs text-destructive mt-2">{err}</div>}
            <div className="mt-5 pt-4 border-t border-border flex items-center gap-3">
              <Mascot className="h-12 w-12" />
              <p className="text-xs text-muted-foreground italic">
                Hint for the demo: use <span className="font-mono">FACULTY-2026</span> or <span className="font-mono">PROVOST-2026</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
