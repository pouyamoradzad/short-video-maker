import { Kokoro } from "./Kokoro";
import { PersianTTS } from "./PersianTTS";
import { SupportedLanguage, Voices } from "../../types/shorts";
import { logger } from "../../config";

export interface TTSResult {
  audio: ArrayBuffer;
  audioLength: number;
}

export class UnifiedTTS {
  constructor(
    private kokoro: Kokoro,
    private persianTTS: PersianTTS | null,
  ) {}

  async generate(
    text: string,
    voice: Voices,
    language: SupportedLanguage,
  ): Promise<TTSResult> {
    logger.debug({ text, voice, language }, "Generating TTS");

    if (language === "fa") {
      if (!this.persianTTS) {
        throw new Error("Persian TTS is not configured. Please set OPENAI_API_KEY environment variable.");
      }
      return await this.persianTTS.generate(text, language);
    } else {
      // Use Kokoro for English
      return await this.kokoro.generate(text, voice);
    }
  }

  listAvailableVoices(language: SupportedLanguage): Voices[] {
    if (language === "fa") {
      // For Persian, we don't have multiple voices in this implementation
      // You could extend this to return different OpenAI voices
      return ["af_heart"]; // Return a default voice
    }
    return this.kokoro.listAvailableVoices();
  }

  static async init(
    kokoro: Kokoro,
    openaiApiKey?: string,
  ): Promise<UnifiedTTS> {
    let persianTTS: PersianTTS | null = null;
    
    if (openaiApiKey) {
      try {
        persianTTS = await PersianTTS.init(openaiApiKey);
        logger.info("Persian TTS initialized successfully");
      } catch (error) {
        logger.warn("Failed to initialize Persian TTS:", error);
      }
    } else {
      logger.warn("OpenAI API key not provided. Persian TTS will not be available.");
    }

    return new UnifiedTTS(kokoro, persianTTS);
  }
}