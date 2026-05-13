import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import {
  Wand2, Film, BookOpenText, BarChart3, Mic, Music2, Languages, Sparkles,
  Bookmark, Smartphone, Moon, Download, Users, Heart, Library, WifiOff,
} from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Features — VisualReads" }] }),
  component: Features,
});

const GROUPS = [
  {
    title: "AI Generation",
    items: [
      { icon: Wand2, label: "Comic & manga panels" },
      { icon: Film, label: "Cinematic storyboards" },
      { icon: BookOpenText, label: "Illustrated novels" },
      { icon: BarChart3, label: "Smart infographics" },
      { icon: Mic, label: "AI voice narration" },
      { icon: Music2, label: "Scene music suggestions" },
      { icon: Languages, label: "20+ languages" },
      { icon: Sparkles, label: "Style transfer" },
    ],
  },
  {
    title: "Reading Experience",
    items: [
      { icon: Bookmark, label: "Bookmarks & progress" },
      { icon: Smartphone, label: "Mobile-first reader" },
      { icon: Moon, label: "Dark / light mode" },
      { icon: Download, label: "Export to PDF / eBook" },
      { icon: Users, label: "Community sharing" },
      { icon: Heart, label: "Reactions & comments" },
      { icon: Library, label: "Story collections" },
      { icon: WifiOff, label: "Offline reading" },
    ],
  },
];

function Features() {
  return (
    <main className="relative min-h-screen">
      <Aurora />
      <Toaster richColors position="top-center" />
      <SiteHeader />
      <section className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <span className="label-eyebrow">Everything inside</span>
          <h1 className="mt-3 font-display text-5xl tracking-wide md:text-6xl">
            <span className="gradient-text">Built for the future of reading.</span>
          </h1>
          <p className="mt-3 text-muted-foreground">From AI panels to immersive reading — VisualReads is a complete platform.</p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-2">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="glass-card p-6"
            >
              <div className="label-eyebrow">{g.title}</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {g.items.map((it) => (
                  <div key={it.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-secondary to-primary">
                      <it.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="font-semibold">{it.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/create" className="neon-cta font-display text-sm tracking-[0.18em]">START CREATING</Link>
        </div>
      </section>
    </main>
  );
}
