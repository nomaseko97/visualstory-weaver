import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { Volume2, BookmarkPlus, Share2 } from "lucide-react";

export const Route = createFileRoute("/reader")({
  head: () => ({ meta: [{ title: "Reader — VisualReads" }] }),
  component: Reader,
});

const SCENES = [
  { caption: "Rain hammers the neon streets. A lone figure steps out of the noodle bar.", hue: "from-fuchsia-600 to-purple-900" },
  { caption: "Across the alley, a holographic message flickers — 'They know.'", hue: "from-indigo-600 to-cyan-700" },
  { caption: "She tightens her coat, eyes narrowing. The chase begins.", hue: "from-rose-600 to-orange-700" },
  { caption: "Above the skyline, the moon turns blood red.", hue: "from-red-600 to-amber-700" },
];

function Reader() {
  return (
    <main className="relative min-h-screen">
      <Aurora />
      <Toaster richColors position="top-center" />
      <SiteHeader />
      <section className="container mx-auto max-w-3xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <span className="label-eyebrow">Now reading</span>
          <h1 className="mt-3 font-display text-5xl tracking-wide">Neon Tokyo Detective</h1>
          <p className="mt-2 text-muted-foreground">Chapter 1 — by Aiko</p>
          <div className="mt-4 flex justify-center gap-2">
            <button className="chip"><Volume2 className="h-3.5 w-3.5" /> Read aloud</button>
            <button className="chip"><BookmarkPlus className="h-3.5 w-3.5" /> Bookmark</button>
            <button className="chip"><Share2 className="h-3.5 w-3.5" /> Share</button>
          </div>
        </motion.div>

        <div className="mt-10 space-y-8">
          {SCENES.map((s, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.05, ease: [0.34, 1.56, 0.64, 1] }}
              className="glass-card overflow-hidden"
            >
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${s.hue}`}>
                <div className="absolute inset-0 halftone opacity-30" />
                <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white">PANEL {i + 1}</div>
              </div>
              <figcaption className="border-t border-white/10 bg-background/40 px-5 py-4 font-display text-lg tracking-wide">
                {s.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/explore" className="neon-cta font-display text-sm tracking-[0.18em]">BACK TO EXPLORE</Link>
        </div>
      </section>
    </main>
  );
}
