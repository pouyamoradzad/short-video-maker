import { Kokoro } from "./Kokoro";
import { PersianTTS } from "./PersianTTS";
import { Language, Voices } from "../../types/shorts";
import { logger } from "../../logger";

export interface UnifiedTTSResult {
  audio: ArrayBuffer;
  audioLength: number;
}

export class UnifiedTTS {
  constructor(
    private kokoro: Kokoro,
    private persianTTS: PersianTTS,
  ) {}

  async generate(
    text: string,
    voice: Voices,
    language: Language = "en"
  ): Promise<UnifiedTTSResult> {
    logger.debug({ text, voice, language }, "Generating TTS with UnifiedTTS");

    if (language === "fa") {
      // Use Persian TTS for Persian text
      const persianVoice = this.mapKokoroVoiceToPersian(voice);
      return await this.persianTTS.generate({
        text,
        voice: persianVoice,
        language: "fa",
      });
    } else {
      // Use Kokoro for English text
      return await this.kokoro.generate(text, voice);
    }
  }

  private mapKokoroVoiceToPersian(kokoroVoice: Voices): string {
    // Map Kokoro voices to Persian TTS voices
    const voiceMapping: Record<string, string> = {
      // Female voices
      "af_heart": "nova",
      "af_alloy": "alloy", 
      "af_aoede": "shimmer",
      "af_bella": "nova",
      "af_jessica": "alloy",
      "af_kore": "shimmer",
      "af_nicole": "nova",
      "af_nova": "nova",
      "af_river": "alloy",
      "af_sarah": "shimmer",
      "af_sky": "nova",
      "bf_emma": "alloy",
      "bf_isabella": "nova",
      "bf_alice": "shimmer",
      "bf_lily": "nova",
      
      // Male voices
      "am_adam": "echo",
      "am_echo": "echo",
      "am_eric": "fable",
      "am_fenrir": "onyx",
      "am_liam": "echo",
      "am_michael": "fable",
      "am_onyx": "onyx",
      "am_puck": "echo",
      "am_santa": "fable",
      "bm_george": "onyx",
      "bm_lewis": "echo",
      "bm_daniel": "fable",
      "bm_fable": "fable",
    };

    return voiceMapping[kokoroVoice] || "alloy";
  }

  listAvailableVoices(): Voices[] {
    return this.kokoro.listAvailableVoices();
  }

  listAvailablePersianVoices(): string[] {
    return this.persianTTS.listAvailableVoices();
  }
}