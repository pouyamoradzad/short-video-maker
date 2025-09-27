import { Config } from "../../config";
import { logger } from "../../logger";

// Minimal translator using OpenAI; falls back to no-op if key missing
export class Translator {
  constructor(private config: Config) {}

  async faToEnKeywords(keywords: string[]): Promise<string[]> {
    if (!keywords.length) return keywords;
    if (!this.config.openaiApiKey) {
      return keywords; // no translation if key missing
    }

    const prompt = `Translate the following Persian keywords to concise English search terms. Keep them short (1-2 words each), comma-separated. Input: ${keywords.join(
      ", "
    )}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You translate keywords for stock search." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      logger.error({ text, status: res.status }, "Translation failed");
      return keywords;
    }
    const json = (await res.json()) as any;
    const content: string = json.choices?.[0]?.message?.content ?? "";
    const parts = content
      .split(/,|\n|;/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
    return parts.length ? parts : keywords;
  }
}

