import { logger } from "../../logger";

type GenerateParams = {
  text: string;
  apiKey?: string;
  language?: string; // e.g., "fa"
  voice?: string; // optional
};

export class OpenAITTS {
  static async generate(
    params: GenerateParams,
  ): Promise<{ audio: ArrayBuffer; audioLength: number }> {
    const { text, apiKey, language, voice } = params;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is required for OpenAI TTS when using Persian language",
      );
    }

    // Using OpenAI Realtime/TTS endpoint-compatible API format
    // We'll request WAV (PCM) to stay consistent with pipeline
    const model = "gpt-4o-mini-tts"; // supports many languages including Persian
    const payload = {
      model,
      voice: voice || "alloy",
      input: text,
      format: "wav",
      language: language || "fa",
    } as Record<string, unknown>;

    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error({ status: res.status, errText }, "OpenAI TTS error");
      throw new Error(`OpenAI TTS error: ${res.status} ${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    // we need length in seconds for sequencing; approximate via WAV header
    const dataView = new DataView(arrayBuffer);
    const numChannels = dataView.getUint16(22, true) || 1;
    const sampleRate = dataView.getUint32(24, true) || 24000;
    const byteRate = dataView.getUint32(28, true) || sampleRate * numChannels * 2;
    const dataSize = dataView.getUint32(40, true) || arrayBuffer.byteLength - 44;
    const audioLength = dataSize / byteRate;

    logger.debug({ language, audioLength }, "Audio generated with OpenAI TTS");
    return { audio: arrayBuffer, audioLength };
  }
}

