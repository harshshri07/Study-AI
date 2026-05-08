/**
 * Lightweight client-side store for recents, achievements, current lecture,
 * mode, and study session state — backed by localStorage with a tiny pub/sub.
 */
import { useEffect, useState, useCallback } from "react";

export type Mode = "student" | "faculty" | "provost";

export type Recent = {
  id: string;
  title: string;
  channel: string;
  videoId: string;
  url: string;
  openedAt: number;
};

export type Progress = {
  lectureId: string;
  sectionsCompleted: number[];
  cardsReviewed: number[];
  searchUsed: boolean;
  chatUsed: boolean;
  quizScore: number | null;
};

const KEYS = {
  recents: "studyai.recents",
  mode: "studyai.mode",
  progress: "studyai.progress",
  achievements: "studyai.achievements",
  unlock: "studyai.unlock", // faculty/provost code unlocks
  xp: "studyai.xp",
  streak: "studyai.streak",
};

const subs = new Set<() => void>();
function emit() { subs.forEach((f) => f()); }

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  emit();
}

function useStore<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(fallback);
  useEffect(() => {
    setState(read<T>(key, fallback));
    const onChange = () => setState(read<T>(key, fallback));
    subs.add(onChange);
    return () => { subs.delete(onChange); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const value = typeof next === "function" ? (next as (p: T) => T)(read<T>(key, fallback)) : next;
      write(key, value);
    },
    [key, fallback],
  );
  return [state, set];
}

/* ─── Recents ─── */
export function useRecents() {
  const [recents, setRecents] = useStore<Recent[]>(KEYS.recents, []);
  const addRecent = useCallback((r: Omit<Recent, "openedAt">) => {
    setRecents((prev) => {
      const filtered = prev.filter((x) => x.id !== r.id);
      return [{ ...r, openedAt: Date.now() }, ...filtered].slice(0, 12);
    });
  }, [setRecents]);
  const removeRecent = useCallback((id: string) => {
    setRecents((prev) => prev.filter((x) => x.id !== id));
  }, [setRecents]);
  const clearRecents = useCallback(() => setRecents([]), [setRecents]);
  return { recents, addRecent, removeRecent, clearRecents };
}

/* ─── Mode ─── */
export function useMode() {
  return useStore<Mode>(KEYS.mode, "student");
}

/* ─── Unlock codes for faculty/provost ─── */
const VALID_CODES: Record<string, "faculty" | "provost"> = {
  "FACULTY-2026": "faculty",
  "PROVOST-2026": "provost",
};
export function useUnlock() {
  const [unlocks, setUnlocks] = useStore<Record<string, boolean>>(KEYS.unlock, {});
  const submitCode = useCallback((code: string): "faculty" | "provost" | null => {
    const trimmed = code.trim().toUpperCase();
    const mode = VALID_CODES[trimmed];
    if (mode) {
      setUnlocks((prev) => ({ ...prev, [mode]: true }));
      return mode;
    }
    return null;
  }, [setUnlocks]);
  return { unlocks, submitCode };
}

/* ─── Progress for current lecture ─── */
export function useProgress(lectureId: string | null) {
  const [allProgress, setAllProgress] = useStore<Record<string, Progress>>(KEYS.progress, {});
  const progress: Progress = lectureId
    ? allProgress[lectureId] ?? {
        lectureId,
        sectionsCompleted: [],
        cardsReviewed: [],
        searchUsed: false,
        chatUsed: false,
        quizScore: null,
      }
    : { lectureId: "", sectionsCompleted: [], cardsReviewed: [], searchUsed: false, chatUsed: false, quizScore: null };

  const update = useCallback(
    (patch: Partial<Progress>) => {
      if (!lectureId) return;
      setAllProgress((prev) => ({
        ...prev,
        [lectureId]: { ...progress, ...patch, lectureId },
      }));
    },
    [lectureId, progress, setAllProgress],
  );

  const markSection = useCallback((id: number) => {
    if (!lectureId) return;
    setAllProgress((prev) => {
      const cur = prev[lectureId] ?? { lectureId, sectionsCompleted: [], cardsReviewed: [], searchUsed: false, chatUsed: false, quizScore: null };
      if (cur.sectionsCompleted.includes(id)) return prev;
      return { ...prev, [lectureId]: { ...cur, sectionsCompleted: [...cur.sectionsCompleted, id] } };
    });
  }, [lectureId, setAllProgress]);

  const markCard = useCallback((idx: number) => {
    if (!lectureId) return;
    setAllProgress((prev) => {
      const cur = prev[lectureId] ?? { lectureId, sectionsCompleted: [], cardsReviewed: [], searchUsed: false, chatUsed: false, quizScore: null };
      if (cur.cardsReviewed.includes(idx)) return prev;
      return { ...prev, [lectureId]: { ...cur, cardsReviewed: [...cur.cardsReviewed, idx] } };
    });
  }, [lectureId, setAllProgress]);

  return { progress, update, markSection, markCard };
}

/* ─── Achievements ─── */
export type Achievement = {
  id: string;
  title: string;
  desc: string;
  unlockedAt: number;
};
export function useAchievements() {
  const [achievements, setAchievements] = useStore<Achievement[]>(KEYS.achievements, []);
  const unlock = useCallback((a: Omit<Achievement, "unlockedAt">) => {
    setAchievements((prev) => {
      if (prev.some((x) => x.id === a.id)) return prev;
      return [{ ...a, unlockedAt: Date.now() }, ...prev];
    });
  }, [setAchievements]);
  return { achievements, unlock };
}

/* ─── Study session timer ─── */
export function useStudyTimer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  return {
    running, seconds,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    reset: () => { setRunning(false); setSeconds(0); },
  };
}

export function fmtClock(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
