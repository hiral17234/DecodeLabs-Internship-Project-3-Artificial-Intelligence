import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User as UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { chatWithBharatGuide } from "@/lib/chat.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/assistant")({ component: Assistant });

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Best places in Kerala?",
  "Suggest destinations under ₹10,000",
  "Where should I travel during monsoon?",
  "Compare Goa and Kerala",
  "Which state is best for wildlife?",
  "Honeymoon recommendations",
  "Show me UNESCO heritage sites",
  "Weekend trips near Delhi",
];

function Assistant() {
  const chatFn = useServerFn(chatWithBharatGuide);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "**Namaste! 🙏** I'm **Bharat Guide** — your AI travel companion for exploring India.\n\nAsk me anything: hidden gems, budget trips, festivals, food trails, or a full itinerary. Where shall we begin?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await chatFn({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply || "Sorry, I couldn't come up with an answer." }]);
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (msg.includes("429")) toast.error("Rate limit hit. Try again in a moment.");
      else if (msg.includes("402")) toast.error("AI credits exhausted. Please upgrade.");
      else toast.error("Something went wrong. Please try again.");
      setMessages(next);
    } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-4xl flex-col px-4 py-6">
      <div className="mb-4 text-center">
        <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-saffron shadow-xl">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          <span className="text-gradient-saffron">Bharat</span> Guide
        </h1>
        <p className="text-xs text-muted-foreground">Powered by Gemini 2.5 Flash</p>
      </div>

      <div ref={scrollRef} className="glass flex-1 overflow-y-auto rounded-3xl p-4">
        <div className="space-y-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.role === "user" ? "bg-gradient-primary" : "bg-gradient-saffron"}`}>
                {m.role === "user" ? <UserIcon className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-gradient-primary text-white" : "glass"}`}>
                <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-saffron">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="glass flex items-center gap-1 rounded-2xl px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-white/60"
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {messages.length <= 2 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="glass rounded-full px-3 py-1.5 text-xs transition hover:bg-white/20">
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="glass mt-3 flex items-center gap-2 rounded-2xl p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Bharat Guide anything about India…"
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
