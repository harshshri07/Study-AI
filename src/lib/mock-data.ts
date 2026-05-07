export const mockLecture = {
  videoId: "kCc8FmEb1nY",
  title: "Let's build GPT: from scratch, in code, spelled out",
  channel: "Andrej Karpathy",
  duration: "1:56:20",
  outline: [
    { id: 1, title: "Introduction & Motivation", time: "0:00", seconds: 0 },
    { id: 2, title: "Reading and exploring the data", time: "7:52", seconds: 472 },
    { id: 3, title: "Tokenization & character encoding", time: "14:13", seconds: 853 },
    { id: 4, title: "Train/val split & data loader", time: "22:00", seconds: 1320 },
    { id: 5, title: "Bigram language model baseline", time: "31:15", seconds: 1875 },
    { id: 6, title: "Self-attention from scratch", time: "47:11", seconds: 2831 },
    { id: 7, title: "Multi-head attention & blocks", time: "1:08:40", seconds: 4120 },
    { id: 8, title: "Residual connections & LayerNorm", time: "1:25:33", seconds: 5133 },
    { id: 9, title: "Scaling up & final results", time: "1:42:18", seconds: 6138 },
  ],
  concepts: [
    "Self-attention", "Transformer", "Tokenization", "Embeddings", "Softmax",
    "Cross-entropy", "Backpropagation", "LayerNorm", "Residual", "Multi-head",
    "Positional encoding", "Decoder", "Bigram", "Logits",
  ],
  insights: [
    { kind: "aha", text: "Attention is fundamentally a *communication mechanism* — every token decides who to listen to." },
    { kind: "watchout", text: "Without √d_k scaling, softmax collapses and gradients vanish in higher dimensions." },
    { kind: "connection", text: "Residual connections + LayerNorm are what make 100+ layer stacks trainable at all." },
  ],
  summaries: {
    short: "This lecture builds a GPT-style transformer from scratch in PyTorch, starting with character-level tokenization of Shakespeare text and culminating in a working decoder-only language model. Karpathy walks through each component — embeddings, self-attention, multi-head attention, feed-forward layers, residual connections, and layer normalization — explaining both the mathematical intuition and the implementation.",
    medium: `Andrej Karpathy walks through building a GPT model from first principles. The lecture begins with a tiny Shakespeare corpus and a simple character-level tokenizer, then constructs a bigram baseline to establish the training loop and loss function (cross-entropy on next-token prediction).

The core of the lecture is a careful, ground-up derivation of self-attention: queries, keys, and values are introduced as projections of token embeddings, and the attention weights emerge as scaled dot products passed through softmax with a causal mask. From there, multi-head attention is shown as parallel attention operations whose outputs are concatenated and re-projected.

The transformer block is assembled by combining attention with a position-wise feed-forward network, residual connections (to ease optimization), and layer normalization (to stabilize training). The lecture closes by stacking blocks, scaling up parameters, and showing the model generating fluent Shakespeare-like text.`,
    long: `This is a complete, code-first introduction to transformer language models. Karpathy starts from absolutely nothing — a text file of Shakespeare — and ends with a working decoder-only transformer that generates plausible text, mirroring the architecture used in GPT-2 and GPT-3 at a smaller scale.

**Setup & data.** The dataset is loaded as a single string, then tokenized at the character level (vocabulary size ≈ 65). A train/val split is created and a get_batch helper samples random fixed-length windows for training.

**Bigram baseline.** A trivial model that predicts the next token from only the current token is implemented to establish the training loop, loss (negative log-likelihood / cross-entropy), and a simple sampling loop.

**Self-attention.** The mathematical heart of the lecture. Token embeddings are projected into queries (Q), keys (K), and values (V). Attention scores are computed as Q·Kᵀ/√d_k, masked with a lower-triangular matrix to prevent looking ahead, normalized with softmax, and used to weight V. Karpathy emphasizes that attention is fundamentally a *communication mechanism* between tokens — weighted aggregation based on learned similarity.

**Multi-head attention & transformer block.** Multiple attention heads run in parallel with smaller per-head dimensions and their outputs are concatenated. A block combines multi-head self-attention with a position-wise MLP. Residual connections wrap each sublayer to keep gradients flowing, and LayerNorm is applied (pre-norm style) for training stability.

**Scaling.** Stacking 6 blocks with 6 heads and embedding dim 384 produces a ~10M parameter model that, after training on a single GPU, generates surprisingly Shakespeare-like text. The lecture closes with a discussion of the gap between this educational model and full ChatGPT (pretraining vs fine-tuning vs RLHF).`,
  },
  flashcards: [
    { q: "What is the role of the causal mask in self-attention?", a: "It prevents tokens from attending to future positions by setting attention scores above the diagonal to -∞ before softmax, ensuring the model can only use past context for next-token prediction.", time: "52:30", seconds: 3150 },
    { q: "Why divide attention scores by √d_k?", a: "Without scaling, dot products grow with dimension, pushing softmax into saturated regions where gradients vanish. Dividing by √d_k keeps variance ~1 and softmax well-conditioned.", time: "58:12", seconds: 3492 },
    { q: "What problem do residual connections solve?", a: "They create a gradient highway from output to input, mitigating vanishing gradients in deep stacks and letting each sublayer learn a small refinement to the residual stream.", time: "1:28:45", seconds: 5325 },
    { q: "How does multi-head attention differ from single-head?", a: "It runs h smaller attention operations in parallel (each with d_k = d_model/h), concatenates the outputs, and projects them. This lets the model attend to different representation subspaces simultaneously.", time: "1:12:08", seconds: 4328 },
    { q: "Why is positional encoding needed?", a: "Self-attention is permutation-invariant — it has no notion of order. Positional embeddings are added to token embeddings so the model can distinguish 'cat sat' from 'sat cat'.", time: "45:20", seconds: 2720 },
    { q: "What loss function is used and why?", a: "Cross-entropy between predicted token distribution and the true next token. It's equivalent to negative log-likelihood and gives well-calibrated gradients for categorical outputs.", time: "28:45", seconds: 1725 },
  ],
  searchExamples: [
    "How does self-attention work?",
    "What is the purpose of LayerNorm?",
    "Why use multi-head attention?",
    "Explain the causal mask",
  ],
  quiz: [
    {
      q: "Which operation gives self-attention its 'communication' property?",
      choices: [
        "Scaled dot product between queries and keys, then softmax over values",
        "Element-wise product of token embeddings",
        "A learned recurrent gate over the sequence",
        "Convolution across the time dimension",
      ],
      answer: 0,
      explanation: "Q·Kᵀ/√d_k → softmax produces the per-token weights used to aggregate V — that aggregation is the 'communication'.",
    },
    {
      q: "Why is LayerNorm preferred over BatchNorm in transformers?",
      choices: [
        "It's strictly faster on GPUs",
        "It normalizes across the feature dimension per-token, independent of batch size",
        "It reduces the parameter count",
        "It removes the need for residual connections",
      ],
      answer: 1,
      explanation: "Batch statistics are unstable for variable-length sequences; LayerNorm keeps each token's activations stable regardless of batch.",
    },
    {
      q: "What does the causal mask do?",
      choices: [
        "Drops random tokens during training",
        "Prevents a position from attending to future positions",
        "Forces all heads to attend to the same tokens",
        "Normalizes the embedding magnitudes",
      ],
      answer: 1,
      explanation: "It zeros out attention to future tokens so the model can only use past context — required for autoregressive generation.",
    },
  ],
};

export const exampleUrls = [
  { label: "Karpathy: Build GPT from scratch", url: "https://youtube.com/watch?v=kCc8FmEb1nY" },
  { label: "3Blue1Brown: Neural Networks", url: "https://youtube.com/watch?v=aircAruvnKk" },
  { label: "MIT 6.S191: Intro to Deep Learning", url: "https://youtube.com/watch?v=ErnWZxJovaM" },
];

export const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

export const mockSearchResults = [
  { confidence: "high" as const, excerpt: "...self-attention computes a weighted sum of values, where the weights come from the compatibility of queries and keys via softmax...", time: "49:22", seconds: 2962, sectionTitle: "Self-attention from scratch" },
  { confidence: "high" as const, excerpt: "...the key insight is that every token emits a query asking 'what am I looking for?' and a key advertising 'what do I contain?'...", time: "53:10", seconds: 3190, sectionTitle: "Self-attention from scratch" },
  { confidence: "medium" as const, excerpt: "...this scaled dot-product attention is then masked so that future positions cannot leak into the current step...", time: "55:48", seconds: 3348, sectionTitle: "Self-attention from scratch" },
];

/* ─── Faculty Audit mock report ─── */
export const mockFacultyAudit = {
  videoId: "kCc8FmEb1nY",
  title: "Let's build GPT: from scratch, in code, spelled out",
  scores: {
    clarity: 92,
    structure: 88,
    pacing: 79,
    examples: 95,
    engagement: 84,
    rigor: 91,
  },
  overall: 88,
  strengths: [
    "Builds intuition before formalism — every formula is preceded by a worked example.",
    "Code-first approach reinforces every concept with an executable cell.",
    "Strong vocabulary discipline: introduces a term once, then uses it consistently.",
  ],
  improvements: [
    "Section on positional encodings is rushed (~3 min) for a conceptually deep idea.",
    "No explicit recap between attention → multi-head transitions; novices may lose thread.",
    "Could add a short comparison to RNN/LSTM for context.",
  ],
  bloomCoverage: [
    { level: "Remember", pct: 18 },
    { level: "Understand", pct: 27 },
    { level: "Apply", pct: 24 },
    { level: "Analyze", pct: 18 },
    { level: "Evaluate", pct: 9 },
    { level: "Create", pct: 4 },
  ],
};

/* ─── Provost Map mock report ─── */
export const mockCurriculumMap = {
  objectives: [
    "Explain attention mechanisms",
    "Implement a transformer in code",
    "Reason about training stability",
    "Compare model architectures",
  ],
  videos: [
    { id: "kCc8FmEb1nY", title: "Let's build GPT — Karpathy", coverage: [95, 92, 70, 35], status: "ok" as const },
    { id: "aircAruvnKk", title: "3B1B — Neural Networks", coverage: [10, 5, 60, 80], status: "ok" as const },
    { id: "ErnWZxJovaM", title: "MIT 6.S191 — Intro DL", coverage: [55, 40, 65, 78], status: "ok" as const },
    { id: "INVALID_x", title: "(failed to fetch)", coverage: [0, 0, 0, 0], status: "error" as const, error: "Captions disabled" },
  ],
  gaps: [
    { objective: "Compare model architectures", note: "Only 1 of 3 valid videos covers this above 70%." },
  ],
};
