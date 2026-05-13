import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { visualizeText } from "@/lib/visualize.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, BookOpen } from "lucide-react";
import { toast } from "sonner";

const STYLES = [
  { id: "comic", label: "Comic" },
  { id: "manga", label: "Manga" },
  { id: "cinematic", label: "Cinematic" },
  { id: "infographic", label: "Infographic" },
] as const;

const SAMPLE = `On the morning of October 12th, scientists at the Arecibo Observatory detected an unusual radio pulse from deep space. The signal repeated every 1.4 seconds with mathematical precision — too perfect to be natural. Dr. Mira Voss raced to the control room, her coffee forgotten. "If this is real," she whispered, "everything changes."`;

export function VisualizerDemo() {
  const [text, setText] = useState(SAMPLE);
  const [style, setStyle] = useState<(typeof STYLES)[number]["id"]>("comic");
  const visualize = useServerFn(visualizeText);

  const mutation = useMutation({
    mutationFn: (vars: { text: string; style: typeof style }) =>
      visualize({ data: vars }),
    onError: (e: Error) => toast.error(e.message ?? "Something went wrong"),
  });

  const panels = mutation.data?.panels ?? [];

  return (
    <section id="demo" className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-accent px-4 py-1 text-sm font-bold text-accent-foreground">
          <Sparkles className="h-4 w-4" /> Try it live
        </span>
        <h2 className="mt-4 text-5xl text-foreground text-stroke">Paste. Read in pictures.</h2>
        <p className="mt-3 text-muted-foreground">
          Drop in any article, story or paragraph. Watch it become a 4-panel visual story.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-gradient-panel p-6 panel-border">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Paste an article, story, or any text here..."
          className="resize-none border-2 border-ink bg-background/60 text-base"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold transition ${
                  style === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Button
            size="lg"
            onClick={() => mutation.mutate({ text, style })}
            disabled={mutation.isPending || text.trim().length < 20}
            className="border-2 border-ink bg-primary font-display text-lg tracking-wide text-primary-foreground hover:bg-primary/90"
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
      </div>

      {panels.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {panels.map((p, i) => (
            <figure
              key={i}
              className="animate-panel-in overflow-hidden rounded-xl bg-card panel-border"
              style={{ animationDelay: `${i * 120}ms` }}
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
              <figcaption className="border-t-[3px] border-ink bg-accent px-4 py-3 font-display text-lg text-accent-foreground">
                {i + 1}. {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {mutation.isPending && (
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-card panel-border" />
          ))}
        </div>
      )}
    </section>
  );
}
