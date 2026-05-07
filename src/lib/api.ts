/**
 * Mock API adapter — mirrors the planned server-function surface.
 * Swap implementations with real createServerFn calls later.
 */
import { mockLecture, mockSearchResults, mockFacultyAudit, mockCurriculumMap } from "./mock-data";

export type Lecture = typeof mockLecture;
export type SearchHit = (typeof mockSearchResults)[number];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function processUrl(_url: string): Promise<Lecture> {
  await sleep(400);
  return mockLecture;
}

export async function semanticSearch(query: string): Promise<SearchHit[]> {
  await sleep(450);
  if (!query.trim()) return [];
  return mockSearchResults;
}

/** Streaming chat — yields chunks. Consumer reduces them. */
export async function* chat(
  message: string,
  _history: { role: "user" | "assistant"; content: string }[],
): AsyncGenerator<string> {
  await sleep(180);
  const reply = craftReply(message);
  const tokens = reply.split(/(\s+)/);
  for (const t of tokens) {
    await sleep(18 + Math.random() * 30);
    yield t;
  }
}

function craftReply(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("attention")) {
    return "Self-attention lets each token decide which other tokens to listen to. Concretely: every token emits a **query**, a **key**, and a **value**. Attention weights come from softmax(Q·Kᵀ/√d_k), and the output is a weighted sum of V. The lecture covers this in §06 — *Self-attention from scratch* (47:11).";
  }
  if (lower.includes("layernorm") || lower.includes("normaliz")) {
    return "**LayerNorm** normalizes the activations within each token across the feature dimension. Unlike BatchNorm, it doesn't depend on batch statistics, so it works for variable-length sequences. It's applied pre-attention and pre-MLP in modern transformers — see §08 (1:25:33).";
  }
  if (lower.includes("residual")) {
    return "Residual connections add a sublayer's input to its output, creating a 'gradient highway' that keeps deep stacks trainable. Without them, signals collapse in 10+ layer stacks. Discussed in §08 — *Residual connections & LayerNorm* (1:25:33).";
  }
  return "Great question. Based on the lecture, the relevant section is *Self-attention from scratch* (47:11). The key idea is that **attention is a communication mechanism** — tokens learn who to attend to. Want me to surface the exact passage?";
}

export async function translate(_lectureId: string, langCode: string): Promise<{ ok: true; lang: string }> {
  await sleep(700);
  return { ok: true, lang: langCode };
}

export async function facultyAudit(_url: string) {
  await sleep(1200);
  return mockFacultyAudit;
}

export async function curriculumMap(_urls: string[], _objectives: string[]) {
  await sleep(1600);
  return mockCurriculumMap;
}
