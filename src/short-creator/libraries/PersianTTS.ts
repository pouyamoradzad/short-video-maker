import axios from "axios";
import { logger } from "../../logger";
import { Language } from "../../types/shorts";

export interface PersianTTSOptions {
  text: string;
  voice?: string;
  language?: Language;
}

export interface PersianTTSResult {
  audio: ArrayBuffer;
  audioLength: number;
}

export class PersianTTS {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://api.openai.com/v1") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async generate(options: PersianTTSOptions): Promise<PersianTTSResult> {
    const { text, voice = "alloy", language = "fa" } = options;

    logger.debug({ text, voice, language }, "Generating Persian TTS with OpenAI");

    try {
      const response = await axios.post(
        `${this.baseUrl}/audio/speech`,
        {
          model: "tts-1",
          input: text,
          voice: voice,
          response_format: "wav",
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const audioBuffer = response.data as ArrayBuffer;
      
      // Calculate audio length (rough estimation for WAV files)
      // WAV files have 44-byte header, then audio data
      const audioDataLength = audioBuffer.byteLength - 44;
      const sampleRate = 24000; // OpenAI TTS uses 24kHz
      const bytesPerSample = 2; // 16-bit audio
      const audioLength = audioDataLength / (sampleRate * bytesPerSample);

      logger.debug({ text, voice, audioLength }, "Persian TTS generated successfully");

      return {
        audio: audioBuffer,
        audioLength: audioLength,
      };
    } catch (error) {
      logger.error(error, "Error generating Persian TTS");
      throw new Error(`Failed to generate Persian TTS: ${error}`);
    }
  }

  listAvailableVoices(): string[] {
    return [
      "alloy",    // Female voice
      "echo",     // Male voice
      "fable",    // Male voice
      "onyx",     // Male voice
      "nova",     // Female voice
      "shimmer",  // Female voice
    ];
  }
}