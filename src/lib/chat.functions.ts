import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { STATES } from "@/lib/states-data";

const ChatInput = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1).max(4000),
  })).min(1).max(30),
});

function buildContext() {
  return STATES.map((s) => {
    return `- ${s.name} (${s.capital}, ${s.region}): ${s.tagline}. Best time: ${s.bestTime}. Budget: ${s.budget}. Duration: ${s.duration}. Top attractions: ${s.attractions.slice(0, 4).join(", ")}. Famous food: ${s.cuisine.slice(0, 3).join(", ")}. Festivals: ${s.festivals.slice(0, 2).join(", ")}. Tags: ${s.tags.join(", ")}.`;
  }).join("\n");
}

export const chatWithBharatGuide = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const system = `You are "Bharat Guide" — the warm, witty AI travel companion for NavYatra, an AI-powered Indian tourism platform.

You help users discover Indian travel destinations. You know these 28 states in depth:

${buildContext()}

STYLE:
- Reply in a friendly, enthusiastic tone — like a knowledgeable local friend.
- Use short paragraphs, occasional emojis (sparingly), and **markdown** formatting (bold, lists) for clarity.
- When recommending destinations, always mention: why it fits, best time to visit, rough budget, and one insider tip.
- Compare states fairly when asked.
- For budget queries, use ₹ (Indian rupees).
- If asked something outside Indian travel, politely redirect to Indian tourism.
- Keep answers focused — 3-6 short paragraphs max unless the user asks for detail.`;

    const { callGeminiChat } = await import("./ai-gateway.server");
    const reply = await callGeminiChat({
      apiKey,
      system,
      messages: data.messages,
    });
    return { reply };
  });
