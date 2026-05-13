import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { VisualizerDemo } from "@/components/VisualizerDemo";
import heroImage from "@/assets/hero-comic.jpg";
import { Toaster } from "@/components/ui/sonner";
import {
  BookOpenText,
  Newspaper,
  GraduationCap,
  Microscope,
  Wand2,
  Film,
  PenTool,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VisualReads — Read in Pictures, Not Paragraphs" },
      {
        name: "description",
        content:
          "VisualReads turns articles, novels, and educational content into comics, storyboards, and cinematic scenes. The future of reading is visual.",
      },
      { property: "og:title", content: "VisualReads — Read in Pictures" },
      {
        property: "og:description",
        content: "Transform any text into a visual story with AI.",
      },
      { property: "og:image", content: heroImage },
    ],
  }),
  component: Index,
});

const CONTENT_TYPES = [
  { icon: Newspaper, label: "News articles" },
  { icon: BookOpenText, label: "Stories & novels" },
  { icon: GraduationCap, label: "Educational content" },
  { icon: Microscope, label: "Research summaries" },
];

const FORMATS = [
  { icon: Wand2, title: "Comic Panels", desc: "Bold ink, halftone shading, dynamic frames." },
  { icon: Film, title: "Cinematic Storyboards", desc: "Wide-frame scenes with dramatic lighting." },
  { icon: PenTool, title: "Manga", desc: "Expressive black-and-white sequential art." },
  { icon: BarChart3, title: "Infographics", desc: "Clean visual breakdowns of dense ideas." },
];

function Aurora() {
  return (
    <div className="aurora-bg" aria-hidden>
      <div className="aurora-blob b1" />
      <div className="aurora-blob b2" />
      <div className="aurora-blob b3" />
    </div>
  );
}

function Index() {
  return (
    <main className="relative min-h-screen">
      <Aurora />
      <Toaster richColors position="top-center" />

      {/* Nav */}
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary panel-border">
            <BookOpenText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl tracking-wide">VisualReads</span>
        </div>
        <a href="#demo">
          <Button variant="outline" className="border-2 border-ink bg-card font-bold">
            Try the demo
          </Button>
        </a>
      </header>

      {/* Hero */}
      <section className="container mx-auto grid items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pt-20">
        <div className="bg-glow">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-secondary px-4 py-1 text-sm font-bold text-secondary-foreground">
            <Sparkle /> The future of reading
          </span>
          <h1 className="mt-5 text-6xl leading-[0.95] text-foreground text-stroke md:text-7xl">
            Read in <span className="text-primary">pictures</span>,
            <br /> not paragraphs.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            VisualReads turns articles, novels, lessons, and research into
            comics, storyboards, manga, and cinematic scenes — instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo">
              <Button
                size="lg"
                className="border-2 border-ink bg-primary font-display text-lg text-primary-foreground hover:bg-primary/90"
              >
                Visualize a story
              </Button>
            </a>
            <a href="#formats">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-ink bg-card font-display text-lg"
              >
                See formats
              </Button>
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {CONTENT_TYPES.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <c.icon className="h-4 w-4 text-accent" />
                {c.label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-hero opacity-30 blur-3xl" />
          <img
            src={heroImage}
            alt="Open book exploding into comic panels"
            width={1600}
            height={1024}
            className="relative rounded-2xl panel-border"
          />
        </div>
      </section>

      {/* Formats */}
      <section id="formats" className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-5xl text-stroke">One text. Four ways to see it.</h2>
          <p className="mt-3 text-muted-foreground">
            Choose how you want your story rendered.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-xl bg-gradient-panel p-6 panel-border transition hover:-translate-y-1"
              style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 0.5}deg)` }}
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary panel-border">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <VisualizerDemo />

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 text-center panel-border">
          <div className="absolute inset-0 halftone opacity-30" />
          <div className="relative">
            <h2 className="text-5xl text-white text-stroke md:text-6xl">
              Reading, reinvented.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Stop scrolling walls of text. Start seeing them.
            </p>
            <a href="#demo" className="mt-8 inline-block">
              <Button
                size="lg"
                className="border-2 border-ink bg-accent font-display text-lg text-accent-foreground hover:bg-accent/90"
              >
                Try VisualReads free
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 pb-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VisualReads — Read in pictures.
      </footer>
    </main>
  );
}

function Sparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
    </svg>
  );
}
