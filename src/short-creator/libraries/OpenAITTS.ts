import OpenAI from "openai";
import { logger } from "../../config";

export class OpenAITTS {
  private openai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required for TTS functionality");
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generate(
    text: string,
    voice: OpenAI.Audio.Speech.SpeechCreateParams["voice"] = "alloy",
    language?: string
  ): Promise<{
    audio: ArrayBuffer;
    audioLength: number;
  }> {
    try {
      logger.debug({ text, voice, language }, "Generating audio with OpenAI TTS");

      const mp3 = await this.openai.audio.speech.create({
        model: "tts-1",
        voice,
        input: text,
        response_format: "mp3",
      });

      const audioBuffer = await mp3.arrayBuffer();
      
      // Estimate audio length (approximate calculation based on average speaking rate)
      // This is a rough estimate - for more accurate timing, we'd need to analyze the actual audio
      const wordsPerMinute = 150; // Average speaking rate
      const words = text.split(/\s+/).length;
      const audioLength = (words / wordsPerMinute) * 60;

      logger.debug({ text, voice, audioLength }, "Audio generated with OpenAI TTS");

      return {
        audio: audioBuffer,
        audioLength,
      };
    } catch (error) {
      logger.error(error, "Error generating audio with OpenAI TTS");
      throw error;
    }
  }

  static init(apiKey: string): OpenAITTS {
    return new OpenAITTS(apiKey);
  }

  listAvailableVoices(): OpenAI.Audio.Speech.SpeechCreateParams["voice"][] {
    // OpenAI TTS available voices
    return ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  }
}