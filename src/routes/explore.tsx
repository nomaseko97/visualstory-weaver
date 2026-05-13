import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Aurora } from "@/components/Aurora";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";

const STORIES = [
  { tag: "MANGA",       title: "Neon Tokyo Detective",   author: "Aiko",  hue: "from-fuchsia-500 to-purple-700" },
  { tag: "CINEMATIC",   title: "The Last Lighthouse",    author: "Mara",  hue: "from-amber-400 to-rose-600" },
  { tag: "INFOGRAPHIC", title: "Climate, Visualized",    author: "Dev",   hue: "from-emerald-400 to-cyan-600" },
  { tag: "COMIC",       title: "Heist of the Century",   author: "Leo",   hue: "from-orange-400 to-red-600" },
  { tag: "STORYBOARD",  title: "First Contact",          author: "Iris",  hue: "from-indigo-400 to-violet-700" },
  { tag: "ILLUSTRATION",title: "Watercolor Wanderlust",  author: "Noa",   hue: "from-sky-400 to-teal-600" },
  { tag: "NEWS",        title: "Markets in Motion",      author: "Sam",   hue: "from-yellow-400 to-orange-600" },
  { tag: "RESEARCH",    title: "Quantum, Explained",     author: "Yuki",  hue: "from-purple-500 to-blue-700" },
];

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore — VisualReads" }] }),
  component: Explore,
});

function Explore() {
  return (
    <main className="relative min-h-screen">
      <Aurora />
      <Toaster richColors position="top-center" />
      <SiteHeader />
      <section className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <span className="label-eyebrow">Discover</span>
          <h1 className="mt-3 font-display text-5xl tracking-wide md:text-6xl">
            <span className="gradient-text">Explore visual stories.</span>
          </h1>
          <p className="mt-3 text-muted-foreground">A living gallery of comics, storyboards and infographics from the community.</p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STORIES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="glass-card overflow-hidden"
            >
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${s.hue}`}>
                <div className="absolute inset-0 halftone opacity-30" />
                <div className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white">{s.tag}</div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg tracking-wide">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">by {s.author}</p>
                <Link to="/reader" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Read →</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
