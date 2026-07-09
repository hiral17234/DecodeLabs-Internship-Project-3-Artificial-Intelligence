import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { State } from "@/lib/states-data";
import { useWishlist } from "@/lib/wishlist-context";

export function StateCard({ state, index = 0 }: { state: State; index?: number }) {
  const { has, toggle } = useWishlist();
  const liked = has(state.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6, rotateX: 3, rotateY: -3 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative"
    >
      <Link
        to="/states/$stateId"
        params={{ stateId: state.id }}
        className="glass relative block overflow-hidden rounded-3xl transition hover:shadow-2xl"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={state.hero}
            alt={state.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button
            onClick={(e) => { e.preventDefault(); toggle(state.id); }}
            className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition ${liked ? "bg-red-500/80" : "bg-black/40 hover:bg-black/60"}`}
            aria-label="Wishlist"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-white text-white" : "text-white"}`} />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-3xl drop-shadow-lg">{state.emoji}</span>
            <div>
              <div className="text-lg font-bold text-white drop-shadow">{state.name}</div>
              <div className="text-xs text-white/80">{state.tagline}</div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {state.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/80">{t}</span>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{state.duration}</span>
            <span className="font-semibold text-foreground">{state.budget}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
