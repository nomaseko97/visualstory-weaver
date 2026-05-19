import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import {
  PenLine, Wand2, Images, BookOpenText, ArrowRight,
  Sparkles, Film, BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "How it works — VisualReads" },
      { name: "description", content: "See how VisualReads turns a few words, an article, or your own story into visual scenes." },
    ],
  }),
  component: Explore,
});

const STEPS = [
  {
    icon: PenLine,
    step: "01",
    title: "Type or paste anything",
    desc: "A few words like “winter in SA”, a full news article, or your own short story. No length minimum — start small or go long.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Pick a vibe",
    desc: "Choose a visual style (manga, comic, cinematic, infographic), tone, and reading level. Tweak the length to fit your scene.",
  },
  {
    icon: Images,
    step: "03",
    title: "Watch it become panels",
    desc: "Your idea is broken into a sequence of visual scenes — each with its own illustration and short caption.",
  },
  {
    icon: BookOpenText,
    step: "04",
    title: "Read in pictures",
    desc: "Scroll through your story like a comic, share it, or remix it into a different style with one click.",
  },
];

const EXAMPLES = [
  { tag: "FEW WORDS", input: "winter in SA", output: "4 cinematic frames: misty Drakensberg dawn, frosted vineyards, kids in beanies on a Joburg street, fireside boerewors." },
  { tag: "ARTICLE",   input: "A news piece about a record-breaking solar flare", output: "An 8-panel infographic comic explaining the flare, its cause, and what it means for satellites." },
  { tag: "OWN STORY", input: "“The lighthouse keeper found a letter in a bottle…”", output: "A moody graphic-novel sequence — windswept cliffs, candlelit room, the letter unfolding." },
];

const FORMATS = [
  { icon: Sparkles, label: "Comic & manga panels" },
  { icon: Film,     label: "Cinematic storyboards" },
  { icon: BarChart3,label: "Smart infographics" },
  { icon: BookOpenText, label: "Illustrated novels" },
];

function Explore() {
  return (
    <main className="relative min-h-screen">
      <Aurora />
      <Toaster richColors position="top-center" />
      <SiteHeader />

      <section className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <span className="label-eyebrow">How it works</span>
          <h1 className="mt-3 font-display text-5xl tracking-wide md:text-6xl">
            <span className="gradient-text">From a thought to a story — in seconds.</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            VisualReads takes whatever you bring — a few words, a long article, or a story you wrote yourself — and turns it into a sequence of visual scenes you can read like a comic.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="glass-card relative p-6"
            >
              <div className="absolute right-4 top-4 font-display text-3xl tracking-wider text-primary/40">{s.step}</div>
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-secondary to-primary">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-xl tracking-wide">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Examples */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="text-center">
            <span className="label-eyebrow">Examples</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              <span className="gradient-text">Bring anything. Get a story back.</span>
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {EXAMPLES.map((e, i) => (
              <motion.div
                key={e.tag}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="glass-card p-5"
              >
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary">
                  {e.tag}
                </span>
                <p className="mt-3 font-display text-lg leading-snug">"{e.input}"</p>
                <div className="my-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5 text-accent" /> becomes
                </div>
                <p className="text-sm text-muted-foreground">{e.output}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Formats */}
        <div className="mx-auto mt-16 max-w-6xl glass-card p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FORMATS.map((f) => (
              <div key={f.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-secondary to-primary">
                  <f.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="font-semibold">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/create" className="neon-cta font-display text-sm tracking-[0.18em]">
            TRY IT NOW <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
