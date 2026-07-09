import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Wallet, Clock, Utensils, PartyPopper, Landmark, TreePine, Mountain, Waves, Sparkles, Lightbulb, Heart } from "lucide-react";
import { getState, STATES, type State } from "@/lib/states-data";
import { useWishlist } from "@/lib/wishlist-context";

export const Route = createFileRoute("/states/$stateId")({
  component: StateDetail,
  loader: ({ params }) => {
    const state = getState(params.stateId);
    if (!state) throw notFound();
    return { state };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "State — NavYatra" }] };
    return {
      meta: [
        { title: `${loaderData.state.name} — NavYatra` },
        { name: "description", content: `${loaderData.state.tagline} — explore ${loaderData.state.name} on NavYatra.` },
      ],
    };
  },
});

function StateDetail() {
  const data = Route.useLoaderData() as { state: State };
  const state = data.state;
  const { has, toggle } = useWishlist();
  const liked = has(state.id);

  const nearby = STATES.filter((s) => s.region === state.region && s.id !== state.id).slice(0, 3);

  return (
    <div className="relative">
      {/* HERO */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <motion.img
          src={state.hero}
          alt={state.name}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10">
          <Link to="/states" className="glass mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs">
            <ArrowLeft className="h-3 w-3" /> All States
          </Link>
          <div className="flex items-end gap-4">
            <span className="text-7xl drop-shadow-lg">{state.emoji}</span>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-[var(--saffron)]">{state.region} India</div>
              <h1 className="text-5xl font-black text-white drop-shadow-lg md:text-7xl" style={{ fontFamily: "'Playfair Display', serif" }}>{state.name}</h1>
              <p className="mt-1 text-lg text-white/90">{state.tagline}</p>
            </div>
            <button
              onClick={() => toggle(state.id)}
              className={`grid h-12 w-12 place-items-center rounded-2xl backdrop-blur transition ${liked ? "bg-red-500/80" : "bg-white/10 hover:bg-white/20"}`}
              aria-label="Wishlist"
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-white text-white" : "text-white"}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Quick facts */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact icon={MapPin} label="Capital" value={state.capital} />
          <Fact icon={Calendar} label="Best Time" value={state.bestTime} />
          <Fact icon={Wallet} label="Budget" value={state.budget} />
          <Fact icon={Clock} label="Duration" value={state.duration} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card icon={Sparkles} title="Culture & Vibe">
              <p className="text-muted-foreground">{state.culture}</p>
              <div className="mt-3 text-sm"><span className="text-muted-foreground">Traditional dress: </span>{state.dress}</div>
              <div className="mt-1 text-sm"><span className="text-muted-foreground">Languages: </span>{state.languages.join(", ")}</div>
            </Card>

            <Card icon={Landmark} title="Major Attractions">
              <ul className="grid gap-2 sm:grid-cols-2">
                {state.attractions.map((a) => (
                  <li key={a} className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-sm"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--teal-glow)]" /> {a}</li>
                ))}
              </ul>
            </Card>

            {state.cuisine.length > 0 && (
              <Card icon={Utensils} title="Famous Cuisine">
                <div className="flex flex-wrap gap-2">
                  {state.cuisine.map((c) => (
                    <span key={c} className="rounded-full bg-gradient-saffron/30 px-3 py-1.5 text-sm">{c}</span>
                  ))}
                </div>
              </Card>
            )}

            {state.festivals.length > 0 && (
              <Card icon={PartyPopper} title="Festivals">
                <div className="flex flex-wrap gap-2">
                  {state.festivals.map((f) => (
                    <span key={f} className="rounded-full bg-white/10 px-3 py-1.5 text-sm">{f}</span>
                  ))}
                </div>
              </Card>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {state.hillStations.length > 0 && (
                <Card icon={Mountain} title="Hill Stations">
                  <ul className="space-y-1 text-sm">{state.hillStations.map((h) => <li key={h}>• {h}</li>)}</ul>
                </Card>
              )}
              {state.beaches.length > 0 && (
                <Card icon={Waves} title="Beaches">
                  <ul className="space-y-1 text-sm">{state.beaches.map((b) => <li key={b}>• {b}</li>)}</ul>
                </Card>
              )}
              {state.wildlife.length > 0 && (
                <Card icon={TreePine} title="Wildlife">
                  <ul className="space-y-1 text-sm">{state.wildlife.map((w) => <li key={w}>• {w}</li>)}</ul>
                </Card>
              )}
              {state.unesco.length > 0 && (
                <Card icon={Landmark} title="UNESCO Heritage">
                  <ul className="space-y-1 text-sm">{state.unesco.map((u) => <li key={u}>• {u}</li>)}</ul>
                </Card>
              )}
            </div>

            <Card icon={Sparkles} title="Adventure Activities">
              <div className="flex flex-wrap gap-2">
                {state.adventure.map((a) => (
                  <span key={a} className="rounded-full bg-white/10 px-3 py-1.5 text-sm">{a}</span>
                ))}
              </div>
            </Card>

            <Card icon={Lightbulb} title="Fun Facts & Tips">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wider text-[var(--saffron)]">Fun facts</div>
                  <ul className="space-y-1.5 text-sm">{state.funFacts.map((f) => <li key={f}>✨ {f}</li>)}</ul>
                </div>
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wider text-[var(--teal-glow)]">Travel tips</div>
                  <ul className="space-y-1.5 text-sm">{state.tips.map((t) => <li key={t}>💡 {t}</li>)}</ul>
                </div>
              </div>
            </Card>

            {/* Gallery */}
            <Card icon={Sparkles} title="Photo Gallery">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {state.gallery.map((g, i) => (
                  <motion.img
                    key={i}
                    src={g}
                    alt=""
                    loading="lazy"
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square rounded-xl object-cover"
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <Card icon={MapPin} title="Top Cities">
              <ul className="space-y-1.5">{state.cities.map((c) => <li key={c} className="rounded-lg bg-white/5 px-3 py-2 text-sm">{c}</li>)}</ul>
            </Card>

            <Card icon={Calendar} title="Weather">
              <div className="text-sm text-muted-foreground">Best months: <span className="font-semibold text-foreground">{state.bestTime}</span></div>
              <div className="mt-2 text-xs text-muted-foreground">Seasons: {state.seasons.map((s) => <span key={s} className="mr-1 rounded-full bg-white/10 px-2 py-0.5">{s}</span>)}</div>
            </Card>

            {nearby.length > 0 && (
              <Card icon={MapPin} title="Nearby States">
                <div className="space-y-2">
                  {nearby.map((n) => (
                    <Link key={n.id} to="/states/$stateId" params={{ stateId: n.id }} className="flex items-center gap-3 rounded-xl bg-white/5 p-2 transition hover:bg-white/10">
                      <img src={n.hero} className="h-10 w-10 rounded-lg object-cover" alt="" />
                      <div>
                        <div className="text-sm font-semibold">{n.name}</div>
                        <div className="text-xs text-muted-foreground">{n.tagline}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon className="mb-1 h-4 w-4 text-[var(--saffron)]" />
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-white"><Icon className="h-4 w-4" /></div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
