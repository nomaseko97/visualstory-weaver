import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpenText, Newspaper, GraduationCap, Microscope,
  Wand2, Film, PenTool, BarChart3, ArrowRight,
} from "lucide-react";

import heroImage from "@/assets/hero-comic.jpg";
import { Aurora } from "@/components/Aurora";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VisualReads — Read in Pictures, Not Paragraphs" },
      { name: "description", content: "Turn articles, novels, lessons, research — or your own ideas — into comics, storyboards and cinematic scenes." },
      { property: "og:title", content: "VisualReads — Read in Pictures" },
      { property: "og:description", content: "Transform any text or idea into a visual story." },
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

function Index() {
  return (
    <main className="relative min-h-screen">
      <Aurora />
      <Toaster richColors position="top-center" />
      <SiteHeader />

      {/* Hero */}
      <section className="container mx-auto grid items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:pt-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="label-eyebrow">The future of reading</span>
          <h1 className="mt-4 font-display text-6xl leading-[0.95] text-foreground md:text-7xl">
            Read in <span className="gradient-text">pictures</span>,
            <br /> not paragraphs.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            VisualReads turns articles, novels, lessons, and research — or your own
            short ideas — into comics, storyboards, manga, and cinematic scenes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/create" className="neon-cta font-display text-base tracking-[0.18em]">
              START CREATING <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link to="/explore" className="chip px-5 py-2.5 text-sm">Explore stories</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {CONTENT_TYPES.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <c.icon className="h-4 w-4 text-accent" />
                {c.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-hero opacity-30 blur-3xl" />
          <img
            src={heroImage}
            alt="Open book exploding into comic panels"
            width={1600}
            height={1024}
            className="relative rounded-2xl panel-border"
          />
        </motion.div>
      </section>

      {/* Formats */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <span className="label-eyebrow">Formats</span>
          <h2 className="mt-3 font-display text-5xl"><span className="gradient-text">One text. Many ways to see it.</span></h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="glass-card p-6"
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="glass-card relative overflow-hidden p-12 text-center">
          <div className="absolute inset-0 bg-gradient-hero opacity-25" />
          <div className="absolute inset-0 halftone opacity-20" />
          <div className="relative">
            <h2 className="font-display text-5xl text-foreground md:text-6xl">
              <span className="gradient-text">Reading, reinvented.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground/85">Stop scrolling walls of text. Start seeing them.</p>
            <Link to="/create" className="neon-cta mt-8 inline-flex font-display text-base tracking-[0.18em]">
              TRY VISUALREAD FREE
            </Link>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 pb-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VisualReads — Read in pictures.
      </footer>
    </main>
  );
}
