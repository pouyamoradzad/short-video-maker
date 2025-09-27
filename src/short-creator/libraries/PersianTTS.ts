import axios from "axios";
import { logger } from "../../config";
import { SupportedLanguage } from "../../types/shorts";

export interface PersianTTSResult {
  audio: ArrayBuffer;
  audioLength: number;
}

export class PersianTTS {
  private openaiApiKey: string;

  constructor(openaiApiKey: string) {
    this.openaiApiKey = openaiApiKey;
  }

  async generate(
    text: string,
    language: SupportedLanguage,
  ): Promise<PersianTTSResult> {
    if (language !== "fa") {
      throw new Error("PersianTTS only supports Persian language");
    }

    try {
      logger.debug({ text, language }, "Generating Persian TTS with OpenAI");
      
      const response = await axios.post(
        "https://api.openai.com/v1/audio/speech",
        {
          model: "tts-1",
          input: text,
          voice: "alloy", // You can use other voices like "echo", "fable", "onyx", "nova", "shimmer"
          response_format: "wav",
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const audioBuffer = Buffer.from(response.data);
      const audioLength = this.getAudioDuration(audioBuffer);

      logger.debug({ text, language, audioLength }, "Persian TTS generated successfully");

      return {
        audio: audioBuffer,
        audioLength,
      };
    } catch (error) {
      logger.error(error, "Error generating Persian TTS");
      throw new Error(`Failed to generate Persian TTS: ${error}`);
    }
  }

  private getAudioDuration(audioBuffer: Buffer): number {
    // This is a simplified duration calculation for WAV files
    // In a real implementation, you might want to use a proper audio library
    // For now, we'll estimate based on file size (this is not accurate)
    const sampleRate = 24000; // OpenAI TTS uses 24kHz
    const bytesPerSample = 2; // 16-bit audio
    const channels = 1; // Mono
    const bytesPerSecond = sampleRate * bytesPerSample * channels;
    
    // Rough estimation - in production, use a proper audio library
    return Math.max(1, audioBuffer.length / bytesPerSecond);
  }

  static async init(openaiApiKey: string): Promise<PersianTTS> {
    if (!openaiApiKey) {
      throw new Error("OpenAI API key is required for Persian TTS");
    }
    return new PersianTTS(openaiApiKey);
  }
}