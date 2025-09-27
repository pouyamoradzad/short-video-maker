import { logger } from "../../logger";
import { Config } from "../../config";

// Minimal client to call OpenAI TTS endpoint via fetch
// Expects env OPENAI_API_KEY available in Config

export class OpenAITTS {
  constructor(private config: Config) {}

  // language: BCP-47 like 'fa' or 'en'
  // voice: OpenAI voice id like 'alloy', 'verse', or fallback
  async generate(
    text: string,
    language: string = "en",
    voice: string = "alloy",
  ): Promise<{
    audio: ArrayBuffer;
    audioLength: number;
  }> {
    if (!this.config.openaiApiKey) {
      throw new Error(
        "OPENAI_API_KEY is not set. Please set it to use OpenAI TTS.",
      );
    }

    // OpenAI Realtime or TTS endpoint; using TTS speech API
    // Docs: https://platform.openai.com/docs/guides/text-to-speech
    const url = "https://api.openai.com/v1/audio/speech";
    const body = {
      model: "gpt-4o-mini-tts", // supports multiple languages including Persian
      voice,
      input: text,
      // container=wav gives raw WAV audio for our ffmpeg pipeline
      format: "wav",
      // Provide language hint
      language,
    } as Record<string, unknown>;

    logger.debug({ language, voice }, "Generating TTS via OpenAI");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const textBody = await res.text();
      logger.error({ status: res.status, textBody }, "OpenAI TTS error");
      throw new Error(`OpenAI TTS failed: ${res.status}`);
    }

    const audioArrayBuffer = await res.arrayBuffer();

    // Estimate audio length from WAV header if present; fall back to duration via decode in ffmpeg step if needed
    const audioLength = OpenAITTS.estimateWavDurationSeconds(audioArrayBuffer);

    return { audio: audioArrayBuffer, audioLength };
  }

  static estimateWavDurationSeconds(buffer: ArrayBuffer): number {
    try {
      const view = new DataView(buffer);
      // Byte rate at offset 28 (little endian uint32)
      const byteRate = view.getUint32(28, true);
      // Data chunk size typically at 40 (uint32 LE)
      const dataSize = view.getUint32(40, true);
      if (byteRate > 0 && dataSize > 0) {
        return dataSize / byteRate;
      }
    } catch (_e) {
      // ignore
    }
    return 0; // caller may adjust/pad later
  }
}

