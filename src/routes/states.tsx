import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { STATES } from "@/lib/states-data";
import { StateCard } from "@/components/StateCard";

export const Route = createFileRoute("/states")({ component: StatesList });

function StatesList() {
  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="text-xs uppercase tracking-widest text-[var(--saffron)]">All 28 States</div>
          <h1 className="mt-2 text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            The <span className="text-gradient-saffron">complete</span> map of Bharat
          </h1>
          <p className="mt-3 text-muted-foreground">From Himalayan peaks to coastal shores — dive into every state.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {STATES.map((s, i) => <StateCard key={s.id} state={s} index={i} />)}
        </div>
      </div>
    </div>
  );
}
