import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { STATES, type State } from "@/lib/states-data";

export const Route = createFileRoute("/recommendation")({ component: Recommendation });

type Answers = {
  budget?: 1 | 2 | 3 | 4;
  season?: "summer" | "winter" | "monsoon";
  purpose?: string;
  vibe?: string[];
  duration?: string;
  transport?: string;
};

const questions = [
  {
    key: "budget" as const, title: "What's your budget?", subtitle: "Per person, all-inclusive",
    options: [
      { v: 1, label: "₹5,000", emoji: "💵" },
      { v: 2, label: "₹10,000", emoji: "💰" },
      { v: 3, label: "₹20,000", emoji: "💎" },
      { v: 4, label: "₹50,000+", emoji: "👑" },
    ],
  },
  {
    key: "season" as const, title: "When are you traveling?", subtitle: "Pick your favorite season",
    options: [
      { v: "summer", label: "Summer", emoji: "☀️" },
      { v: "winter", label: "Winter", emoji: "❄️" },
      { v: "monsoon", label: "Monsoon", emoji: "🌧️" },
    ],
  },
  {
    key: "purpose" as const, title: "What's the trip for?", subtitle: "Your primary purpose",
    options: [
      { v: "family", label: "Family", emoji: "👨‍👩‍👧" }, { v: "honeymoon", label: "Honeymoon", emoji: "💕" },
      { v: "solo", label: "Solo", emoji: "🎒" }, { v: "friends", label: "Friends", emoji: "🥂" },
      { v: "adventure", label: "Adventure", emoji: "🪂" }, { v: "pilgrimage", label: "Pilgrimage", emoji: "🕉️" },
      { v: "photography", label: "Photography", emoji: "📸" }, { v: "food", label: "Food", emoji: "🍛" },
    ],
  },
  {
    key: "vibe" as const, title: "Your dream landscape?", subtitle: "Pick as many as you like", multi: true,
    options: [
      { v: "beach", label: "Beaches", emoji: "🏖️" }, { v: "mountain", label: "Mountains", emoji: "⛰️" },
      { v: "desert", label: "Desert", emoji: "🏜️" }, { v: "forest", label: "Forest", emoji: "🌲" },
      { v: "snow", label: "Snow", emoji: "❄️" }, { v: "luxury", label: "Luxury", emoji: "✨" },
      { v: "culture", label: "Culture", emoji: "🎭" }, { v: "wildlife", label: "Wildlife", emoji: "🐯" },
      { v: "history", label: "History", emoji: "🏛️" },
    ],
  },
  {
    key: "duration" as const, title: "How long do you have?",
    options: [
      { v: "weekend", label: "Weekend" }, { v: "3", label: "3 Days" }, { v: "5", label: "5 Days" },
      { v: "7", label: "7 Days" }, { v: "10", label: "10 Days" }, { v: "14", label: "14+ Days" },
    ],
  },
  {
    key: "transport" as const, title: "Preferred transport?",
    options: [
      { v: "flight", label: "Flight", emoji: "✈️" }, { v: "train", label: "Train", emoji: "🚆" },
      { v: "road", label: "Road Trip", emoji: "🚗" },
    ],
  },
];

function scoreStates(a: Answers): { state: State; score: number; reasons: string[] }[] {
  return STATES.map((s) => {
    let score = 0;
    const reasons: string[] = [];
    if (a.budget && s.budgetTier <= a.budget) { score += 20; reasons.push(`Fits your ₹ budget`); }
    if (a.season && s.seasons.includes(a.season)) { score += 20; reasons.push(`Perfect in ${a.season}`); }
    if (a.purpose && (s.tags as string[]).includes(a.purpose)) { score += 25; reasons.push(`Great for ${a.purpose} trips`); }
    if (a.vibe) {
      for (const v of a.vibe) {
        if ((s.tags as string[]).includes(v)) { score += 10; reasons.push(`${v} vibes match`); }
      }
    }
    if (a.duration) {
      const days = a.duration === "weekend" ? 2 : parseInt(a.duration);
      const sMin = parseInt(s.duration);
      if (days >= sMin - 2) { score += 10; reasons.push(`Enough time to enjoy`); }
    }
    return { state: s, score, reasons: [...new Set(reasons)].slice(0, 4) };
  }).sort((x, y) => y.score - x.score);
}

function Recommendation() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const q = questions[step];
  const isLast = step === questions.length - 1;

  const pick = (v: any) => {
    if ((q as any).multi) {
      const arr = ((answers as any)[q.key] as string[]) || [];
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      setAnswers({ ...answers, [q.key]: next });
    } else {
      setAnswers({ ...answers, [q.key]: v });
      setTimeout(() => (isLast ? setShowResults(true) : setStep(step + 1)), 300);
    }
  };

  const results = showResults ? scoreStates(answers).slice(0, 5) : [];
  const maxScore = results[0]?.score || 100;

  if (showResults) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <Sparkles className="mx-auto mb-2 h-6 w-6 text-[var(--saffron)]" />
          <div className="text-xs uppercase tracking-widest text-[var(--saffron)]">Your AI Match</div>
          <h1 className="mt-2 text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Top <span className="text-gradient">5 Recommendations</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Based on your preferences — ranked by our weighted algorithm.</p>
          <button onClick={() => { setShowResults(false); setStep(0); setAnswers({}); }} className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
            Try again
          </button>
        </motion.div>

        <div className="space-y-4">
          {results.map((r, i) => {
            const match = Math.round((r.score / (maxScore || 1)) * 100);
            return (
              <motion.div
                key={r.state.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="glass overflow-hidden rounded-3xl"
              >
                <div className="grid md:grid-cols-[280px_1fr]">
                  <img src={r.state.hero} alt="" className="h-48 w-full object-cover md:h-full" />
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-[var(--saffron)]">#{i + 1} · {r.state.region} India</div>
                        <h3 className="text-2xl font-bold">{r.state.emoji} {r.state.name}</h3>
                        <p className="text-sm text-muted-foreground">{r.state.tagline}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-gradient">{match}%</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">Match</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.reasons.map((rs) => (
                        <span key={rs} className="rounded-full bg-[var(--teal-glow)]/20 px-2.5 py-1 text-xs">✓ {rs}</span>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Info label="Budget" value={r.state.budget} />
                      <Info label="Duration" value={r.state.duration} />
                      <Info label="Best Time" value={r.state.bestTime} />
                    </div>
                    <Link to="/states/$stateId" params={{ stateId: r.state.id }} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-white">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {step + 1} / {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-gradient-primary" animate={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          className="glass rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{q.title}</h2>
          {(q as any).subtitle && <p className="mt-1 text-muted-foreground">{(q as any).subtitle}</p>}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {q.options.map((o: any) => {
              const selected = (q as any).multi
                ? (((answers as any)[q.key] as string[]) || []).includes(o.v)
                : (answers as any)[q.key] === o.v;
              return (
                <motion.button
                  key={String(o.v)}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pick(o.v)}
                  className={`rounded-2xl border-2 p-4 text-center transition ${
                    selected ? "border-[var(--primary)] bg-gradient-primary text-white shadow-xl" : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  {o.emoji && <div className="text-3xl">{o.emoji}</div>}
                  <div className="mt-1 text-sm font-semibold">{o.label}</div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm disabled:opacity-30"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            {((q as any).multi || answers[q.key as keyof Answers]) && (
              <button
                onClick={() => (isLast ? setShowResults(true) : setStep(step + 1))}
                className="flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-white"
              >
                {isLast ? "Get Recommendations" : "Next"} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold">{value}</div>
    </div>
  );
}
