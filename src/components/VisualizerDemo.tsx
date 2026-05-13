import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { visualizeText } from "@/lib/visualize.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, BookOpen, Search, Copy, Check, Library } from "lucide-react";
import { toast } from "sonner";

const STYLES = [
  { id: "comic", label: "Comic" },
  { id: "manga", label: "Manga" },
  { id: "cinematic", label: "Cinematic" },
  { id: "infographic", label: "Infographic" },
] as const;

type StyleId = (typeof STYLES)[number]["id"];

const SAMPLE = `On the morning of October 12th, scientists at the Arecibo Observatory detected an unusual radio pulse from deep space. The signal repeated every 1.4 seconds with mathematical precision — too perfect to be natural. Dr. Mira Voss raced to the control room, her coffee forgotten. "If this is real," she whispered, "everything changes."`;

const PROMPT_LIBRARY: { category: string; title: string; prompt: string }[] = [
  { category: "News", title: "Breaking news scene", prompt: "Turn this news article into a 4-panel breaking-news comic with a reporter on the scene, dramatic lighting, and bold headline captions." },
  { category: "Fiction", title: "Fantasy chapter opener", prompt: "Render this fantasy passage as a cinematic graphic-novel page: wide establishing shot, hero close-up, action beat, emotional reaction." },
  { category: "Manga", title: "Shonen action beat", prompt: "Convert this scene into manga panels with speed lines, dynamic camera angles, expressive faces, and sparse dialogue bubbles." },
  { category: "Education", title: "Concept explainer", prompt: "Explain this educational topic as 4 illustrated infographic panels with icons, arrows, and one short caption per panel." },
  { category: "Children", title: "Bedtime storybook", prompt: "Turn this story into a soft, watercolor children's book with friendly characters and big, gentle scenes." },
  { category: "Science", title: "Discovery storyboard", prompt: "Visualize this scientific discovery as a cinematic storyboard: lab close-up, data on screen, eureka reaction, world-changing implication." },
  { category: "History", title: "Historical reenactment", prompt: "Depict this historical event as a sequence of painterly cinematic frames with period-accurate costumes and lighting." },
  { category: "Crime", title: "Noir investigation", prompt: "Render this as a noir comic: high-contrast shadows, rain, a detective monologue caption per panel." },
  { category: "Romance", title: "Romance vignette", prompt: "Show this romantic moment in 4 soft, illustrated panels — glance, reach, touch, kiss — with minimal dialogue." },
  { category: "Tech", title: "Product explainer", prompt: "Turn this tech explainer into a clean infographic comic: problem, mechanism, benefit, call-to-action." },
  { category: "Business", title: "Startup story", prompt: "Tell this business story as a 4-panel rise-and-grind comic: idea, struggle, breakthrough, scale." },
  { category: "Adventure", title: "Quest opening", prompt: "Open this adventure as cinematic frames: vast landscape, hero silhouette, threat reveal, leap into action." },
];

export function VisualizerDemo() {
  const [text, setText] = useState(SAMPLE);
  const [style, setStyle] = useState<StyleId>("comic");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const visualize = useServerFn(visualizeText);

  const mutation = useMutation({
    mutationFn: (vars: { text: string; style: StyleId }) => visualize({ data: vars }),
    onError: (e: Error) => toast.error(e.message ?? "Something went wrong"),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROMPT_LIBRARY;
    return PROMPT_LIBRARY.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q),
    );
  }, [query]);

  const copy = async (id: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      toast.success("Prompt copied");
      setTimeout(() => setCopiedId(null), 1400);
    } catch {
      toast.error("Copy failed");
    }
  };

  const usePrompt = (prompt: string) => {
    setText(prompt);
    toast.success("Loaded into editor");
  };

  const panels = mutation.data?.panels ?? [];
  const canSubmit = !mutation.isPending && text.trim().length >= 20;

  return (
    <section id="demo" className="container relative mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-accent" /> AI Content Generator
        </span>
        <h2 className="mt-4 text-5xl text-foreground text-stroke md:text-6xl">
          Paste. Read in pictures.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Drop in any article, story or paragraph — or pick a prompt from the library.
        </p>
      </motion.div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 rounded-2xl glass p-6"
        >
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste an article, story, or any text here..."
            className="resize-none border-white/10 bg-background/40 text-base"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    style === s.id
                      ? "border-primary/60 bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.72_0.22_30/0.5)]"
                      : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Button
              type="button"
              size="lg"
              onClick={() => mutation.mutate({ text, style })}
              disabled={!canSubmit}
              className="relative z-10 cursor-pointer bg-gradient-to-r from-primary to-secondary font-display text-lg tracking-wide text-primary-foreground shadow-[0_0_30px_oklch(0.55_0.25_295/0.6)] hover:opacity-95 disabled:opacity-60"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Drawing...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" /> Visualize
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Prompt Library */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl glass p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <Library className="h-4 w-4 text-accent" />
            <h3 className="font-display text-xl tracking-wide">Prompt Library</h3>
          </div>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts (e.g. manga, news)..."
              className="border-white/10 bg-background/40 pl-9"
            />
          </div>
          <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No prompts found.</p>
            )}
            {filtered.map((p, i) => {
              const id = `${p.category}-${i}`;
              const isCopied = copiedId === id;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.02 }}
                  className="group rounded-lg border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-secondary/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                          {p.category}
                        </span>
                        <h4 className="truncate text-sm font-semibold">{p.title}</h4>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.prompt}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(id, p.prompt)}
                      title="Copy to clipboard"
                      className="shrink-0 rounded-md border border-white/10 bg-background/40 p-1.5 text-muted-foreground transition hover:text-foreground"
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => usePrompt(p.prompt)}
                    className="mt-2 text-xs font-semibold text-primary hover:underline"
                  >
                    Use this prompt →
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.aside>
      </div>

      {panels.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {panels.map((p, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
              className="overflow-hidden rounded-xl glass"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.caption} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <figcaption className="border-t border-white/10 bg-background/40 px-4 py-3 font-display text-lg">
                {i + 1}. {p.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      )}

      {mutation.isPending && (
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-xl glass" />
          ))}
        </div>
      )}
    </section>
  );
}
