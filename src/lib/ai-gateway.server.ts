export async function callGeminiChat(opts: {
  apiKey: string;
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
}) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": opts.apiKey,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: opts.system },
        ...opts.messages,
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gateway ${res.status}: ${body}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}
