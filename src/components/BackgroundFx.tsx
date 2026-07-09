"use client";
import { motion } from "framer-motion";

export function AnimatedBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="blob"
        style={{ background: "var(--saffron)", width: 500, height: 500, top: "-10%", left: "-10%" }}
        animate={{ x: [0, 80, -40, 0], y: [0, 60, -30, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob"
        style={{ background: "var(--teal-glow)", width: 600, height: 600, top: "30%", right: "-15%" }}
        animate={{ x: [0, -80, 40, 0], y: [0, -60, 30, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob"
        style={{ background: "var(--magenta-glow)", width: 450, height: 450, bottom: "-10%", left: "20%" }}
        animate={{ x: [0, 60, -60, 0], y: [0, -40, 40, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function FloatingParticles({ count = 24 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = 2 + Math.random() * 4;
        const left = Math.random() * 100;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 10;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{ width: size, height: size, left: `${left}%`, bottom: -10 }}
            animate={{ y: [0, -1000], opacity: [0, 1, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}
