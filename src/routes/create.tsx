import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileText, Mail, Code2, BookOpen, Newspaper, Megaphone,
  BarChart3, Film, Image as ImageIcon, FlaskConical,
  Search, Copy, Check, Sparkles, Wand2, Loader2,
} from "lucide-react";

import { Aurora } from "@/components/Aurora";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { visualizeText } from "@/lib/visualize.functions";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create — VisualRead" },
      { name: "description", content: "Generate comics, infographics, cinematic scenes and more from a topic or text." },
    ],
  }),
  component: CreatePage,
});

const CONTENT_TYPES = [
  { id: "blog", icon: FileText, label: "Blog Post", desc: "Long-form article with sections" },
  { id: "email", icon: Mail, label: "Email", desc: "Subject + body, any tone" },
  { id: "code", icon: Code2, label: "Code", desc: "Snippets, refactors, explainers" },
  { id: "story", icon: BookOpen, label: "Visual Story", desc: "Comic / storyboard panels" },
  { id: "news", icon: Newspaper, label: "News Brief", desc: "Punchy summary of an article" },
  { id: "ad", icon: Megaphone, label: "Ad / Caption", desc: "Social copy & hooks" },
  { id: "infographic", icon: BarChart3, label: "Infographic", desc: "Stats turned into visuals" },
  { id: "scene", icon: Film, label: "Cinematic Scene", desc: "Storyboard for film/TV" },
  { id: "illustration", icon: ImageIcon, label: "Illustration", desc: "Single key-art prompt" },
  { id: "research", icon: FlaskConical, label: "Research Recap", desc: "Paper → digestible visual" },
] as const;

const STYLES = ["Manga", "Western Comic", "Graphic Novel", "Pixar 3D", "Watercolor", "Noir Ink", "Cinematic", "Minimal"];
const TONES = ["Epic", "Friendly", "Professional", "Witty", "Dark", "Inspirational"];
const LEVELS = ["Kids", "Teen", "Young Adult", "Adult", "Expert"];

const STYLE_TO_BACKEND: Record<string, "comic" | "manga" | "cinematic" | "infographic"> = {
  Manga: "manga", "Western Comic": "comic", "Graphic Novel": "comic", "Pixar 3D": "cinematic",
  Watercolor: "comic", "Noir Ink": "manga", Cinematic: "cinematic", Minimal: "infographic",
};

const PROMPTS = [
  { tag: "STORY",        title: "Turn article into 8-panel comic",  body: "Transform the following article into an 8-panel visual comic. For each panel, give: scene description, character dialogue, and a one-line caption. Keep pacing tight.", chips: ["#comic", "#article", "#storyboard"] },
  { tag: "BLOG",         title: "SaaS launch blog post",            body: "Write a 900-word launch blog post for [PRODUCT]. Include: hook, problem, solution, 3 feature highlights, customer quote placeholder, and a CTA. Tone: confident, friendly.", chips: ["#blog", "#saas", "#launch"] },
  { tag: "EMAIL",        title: "Cold outreach email",              body: "Write a 90-word cold email to [PERSONA] at [COMPANY]. Reference [PAIN POINT]. Offer [VALUE]. End with a single, low-friction CTA.", chips: ["#email", "#sales", "#cold"] },
  { tag: "CODE",         title: "Refactor React component",         body: "Refactor this React component for readability and performance. Extract hooks, memoize where useful, and add TypeScript types. Explain each change. [PASTE CODE]", chips: ["#code", "#react", "#refactor"] },
  { tag: "CODE",         title: "Explain code to a beginner",       body: "Explain the following code to a beginner using a simple analogy and a step-by-step walkthrough. Add a short visual diagram description. [PASTE CODE]", chips: ["#code", "#teach", "#explain"] },
  { tag: "NEWS",         title: "News article → 60-sec brief",      body: "Summarize this news article into a 60-second visual brief: headline (8 words), 3 bullets, 1 quote, and a closing 'why it matters' line. [PASTE ARTICLE]", chips: ["#news", "#summary", "#brief"] },
  { tag: "INFOGRAPHIC",  title: "Infographic from stats",           body: "Design an infographic outline using these stats. Provide: title, 5 key data points (with comparisons), suggested chart type for each, and a closing insight.", chips: ["#data", "#chart", "#viz"] },
  { tag: "SCENE",        title: "Cinematic opening scene",          body: "Write the opening scene for a [GENRE] film about [THEME]. Include shot list (wide/close/medium), lighting, sound design notes, and dialogue.", chips: ["#film", "#opening", "#scene"] },
  { tag: "ILLUSTRATION", title: "Children's book illustration",     body: "Create an image prompt for a children's book illustration of [SUBJECT] in [SETTING]. Style: warm watercolor, soft light, friendly faces, 4:3 ratio.", chips: ["#kids", "#book", "#art"] },
  { tag: "AD",           title: "TikTok hook + caption",            body: "Write 5 TikTok hook variants and 3 caption options for [PRODUCT]. Each hook ≤ 8 words, scroll-stopping, no emojis in hooks.", chips: ["#tiktok", "#hook", "#ad"] },
  { tag: "RESEARCH",     title: "Paper → 1-page digest",            body: "Condense this research paper into a one-page visual digest: TL;DR, method, key findings (3), limitations, and a real-world implication.", chips: ["#research", "#digest", "#science"] },
  { tag: "STORY",        title: "Manga fight scene",                body: "Render this short story moment as 6 manga panels with speed lines, expressive faces, and minimal dialogue bubbles.", chips: ["#manga", "#action", "#panels"] },
];

function CreatePage() {
  const [contentType, setContentType] = useState<(typeof CONTENT_TYPES)[number]["id"]>("story");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [tone, setTone] = useState("Professional");
  const [level, setLevel] = useState("Adult");
  const [length, setLength] = useState(8);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const visualize = useServerFn(visualizeText);
  const mutation = useMutation({
    mutationFn: (vars: { text: string; style: "comic" | "manga" | "cinematic" | "infographic" }) =>
      visualize({ data: vars }),
    onError: (e: Error) => toast.error(e.message ?? "Generation failed"),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROMPTS;
    return PROMPTS.filter((p) =>
      [p.title, p.body, p.tag, ...p.chips].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  const canGenerate = topic.trim().length >= 3 && !mutation.isPending;

  const copy = async (i: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      toast.success("Prompt copied");
      setTimeout(() => setCopied(null), 1300);
    } catch {
      toast.error("Copy failed");
    }
  };

  const usePrompt = (text: string) => {
    setTopic(text);
    toast.success("Loaded into editor");
    document.getElementById("topic")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const panels = mutation.data?.panels ?? [];

  return (
    <main className="relative min-h-screen">
      <Aurora />
      <Toaster richColors position="top-center" />
      <SiteHeader />

      <section className="container mx-auto px-4 pb-10 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="label-eyebrow">AI Content Generator</span>
          <h1 className="mt-3 font-display text-5xl tracking-wide md:text-6xl">
            <span className="gradient-text">Bring any text to life.</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pick a content type, paste your topic, choose a vibe — we'll render it.
          </p>
        </motion.div>

        {/* Generator card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="glass-card mx-auto mt-8 max-w-6xl p-6 md:p-8"
        >
          <div className="label-eyebrow">Content Type</div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CONTENT_TYPES.map((c) => {
              const active = contentType === c.id;
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setContentType(c.id)}
                  className={`group rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-primary/60 bg-primary/10 shadow-[0_0_24px_oklch(0.7_0.22_320/0.35)]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <c.icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="mt-3 font-display text-sm tracking-wider text-foreground">
                    {c.label.toUpperCase()}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-muted-foreground">{c.desc}</div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8">
            <label htmlFor="topic" className="label-eyebrow">Topic or paste text</label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={6}
              placeholder="e.g. Turn this article into an 8-panel manga about a samurai detective in neon Tokyo..."
              className="mt-3 resize-none border-white/10 bg-white/[0.03] text-base"
            />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div>
              <div className="label-eyebrow">Visual Style</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button key={s} type="button" onClick={() => setStyle(s)} className={`chip ${style === s ? "chip-active" : ""}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="label-eyebrow">Tone</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button key={t} type="button" onClick={() => setTone(t)} className={`chip ${tone === t ? "chip-active" : ""}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="label-eyebrow">Level</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <button key={l} type="button" onClick={() => setLevel(l)} className={`chip ${level === l ? "chip-active" : ""}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div className="label-eyebrow">Length</div>
              <div className="font-display tracking-wider text-primary">{length} sections</div>
            </div>
            <input
              type="range"
              min={2}
              max={16}
              step={1}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
              style={{ background: `linear-gradient(90deg, oklch(0.78 0.18 320) ${(length - 2) / 14 * 100}%, oklch(1 0 0 / 0.08) ${(length - 2) / 14 * 100}%)` }}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              type="button"
              whileHover={canGenerate ? { scale: 1.02 } : undefined}
              whileTap={canGenerate ? { scale: 0.98 } : undefined}
              disabled={!canGenerate}
              onClick={() =>
                mutation.mutate({ text: `[${contentType}|${tone}|${level}|${style}] ${topic}`, style: STYLE_TO_BACKEND[style] ?? "cinematic" })
              }
              className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary via-primary to-accent px-7 py-3 font-display tracking-[0.18em] text-primary-foreground shadow-[0_0_30px_oklch(0.7_0.22_320/0.55)] disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {mutation.isPending ? "GENERATING…" : "GENERATE"}
            </motion.button>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              Powered by Lovable AI — real-time generation enabled.
            </div>
          </div>
        </motion.div>

        {/* Output */}
        {mutation.isPending && (
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="glass-card aspect-[4/3] animate-pulse" />
            ))}
          </div>
        )}
        {panels.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {panels.map((p, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                className="glass-card overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.caption} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
                  )}
                </div>
                <figcaption className="border-t border-white/10 bg-background/40 px-4 py-3 font-display text-lg">
                  {i + 1}. {p.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </section>

      {/* Prompt library */}
      <section className="container mx-auto px-4 pb-24 pt-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-4xl tracking-wide md:text-5xl">
              Steal a <span className="gradient-text italic">starter prompt.</span>
            </h2>
            <p className="mt-2 text-muted-foreground">Searchable, copy-to-clipboard. Click "Use" to load it into the generator.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts, tags, types..."
              className="border-white/10 bg-white/[0.03] pl-9"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
              className="glass-card flex flex-col p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg leading-snug tracking-wide">{p.title}</h3>
                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary">
                  {p.tag}
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.body}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.chips.map((c) => (
                  <span key={c} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">{c}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => copy(i, p.body)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-white/10"
                >
                  {copied === i ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === i ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => usePrompt(p.body)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-secondary to-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_18px_oklch(0.7_0.22_320/0.45)]"
                >
                  Use prompt
                </button>
              </div>
            </motion.article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted-foreground">No prompts found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
