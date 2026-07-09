import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";
import { STATES, REGIONS } from "@/lib/states-data";
import { StateCard } from "@/components/StateCard";

const searchSchema = z.object({
  tag: z.string().optional(),
  region: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/explore")({
  component: Explore,
  validateSearch: (s: Record<string, unknown>) => searchSchema.parse(s),
});

const ALL_TAGS = ["beach", "mountain", "desert", "forest", "snow", "luxury", "culture", "adventure", "family", "honeymoon", "solo", "pilgrimage", "wildlife", "food", "history", "photography"];

function Explore() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q || "");
  const [tag, setTag] = useState<string | undefined>(search.tag);
  const [region, setRegion] = useState<string | undefined>(search.region);

  const filtered = useMemo(() => {
    return STATES.filter((s) => {
      if (region && s.region !== region) return false;
      if (tag && !(s.tags as string[]).includes(tag)) return false;
      if (q && !`${s.name} ${s.capital} ${s.cities.join(" ")} ${s.attractions.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, tag, region]);

  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="text-xs uppercase tracking-widest text-[var(--saffron)]">Explore India</div>
          <h1 className="mt-2 text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Every corner, <span className="text-gradient">every story</span>
          </h1>
        </motion.div>

        <div className="glass mb-6 rounded-2xl p-4">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search states, cities, monuments…"
              className="w-full rounded-xl border border-border bg-white/5 py-3 pl-10 pr-3 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <FilterChip active={!region} onClick={() => setRegion(undefined)}>All regions</FilterChip>
            {REGIONS.map((r) => (
              <FilterChip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={!tag} onClick={() => setTag(undefined)}>All vibes</FilterChip>
            {ALL_TAGS.map((t) => (
              <FilterChip key={t} active={tag === t} onClick={() => setTag(t)}>{t}</FilterChip>
            ))}
          </div>
        </div>

        <div className="mb-4 text-sm text-muted-foreground">{filtered.length} destinations</div>

        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No matches. Try clearing filters.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, i) => <StateCard key={s.id} state={s} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
        active ? "bg-gradient-primary text-white shadow-md" : "bg-white/5 hover:bg-white/15"
      }`}
    >
      {children}
    </button>
  );
}
