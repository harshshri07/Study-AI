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
  { confidence: "high", excerpt: "...self-attention computes a weighted sum of values, where the weights come from the compatibility of queries and keys via softmax...", time: "49:22", seconds: 2962 },
  { confidence: "high", excerpt: "...the key insight is that every token emits a query asking 'what am I looking for?' and a key advertising 'what do I contain?'...", time: "53:10", seconds: 3190 },
  { confidence: "medium", excerpt: "...this scaled dot-product attention is then masked so that future positions cannot leak into the current step...", time: "55:48", seconds: 3348 },
];
