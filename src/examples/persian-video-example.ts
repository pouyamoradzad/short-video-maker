/**
 * Example of creating a short video with Persian language support
 * This demonstrates how to use the short-video-maker with Persian text,
 * Persian TTS, and Persian captions with RTL support.
 */

import { ShortCreator } from "../short-creator/ShortCreator";
import { Config } from "../config";
import { Kokoro } from "../short-creator/libraries/Kokoro";
import { OpenAITTS } from "../short-creator/libraries/OpenAITTS";
import { TranslationService } from "../short-creator/libraries/TranslationService";
import { Remotion } from "../short-creator/libraries/Remotion";
import { Whisper } from "../short-creator/libraries/Whisper";
import { FFMpeg } from "../short-creator/libraries/FFmpeg";
import { PexelsAPI } from "../short-creator/libraries/Pexels";
import { MusicManager } from "../short-creator/music";
import { 
  LanguageEnum, 
  TtsEngineEnum, 
  MusicMoodEnum, 
  OrientationEnum,
  CaptionPositionEnum 
} from "../types/shorts";

async function createPersianVideo() {
  // Initialize configuration
  const config = new Config();
  
  // Ensure required API keys are set
  if (!config.openaiApiKey) {
    throw new Error("OpenAI API key is required for Persian TTS. Set OPENAI_API_KEY environment variable.");
  }
  if (!config.pexelsApiKey) {
    throw new Error("Pexels API key is required for video search. Set PEXELS_API_KEY environment variable.");
  }

  // Initialize all services
  const remotion = await Remotion.init(config);
  const kokoro = await Kokoro.init(config.kokoroModelPrecision);
  const openaiTts = OpenAITTS.init(config.openaiApiKey);
  const translationService = TranslationService.init(config.openaiApiKey);
  const whisper = await Whisper.init(config);
  const ffmpeg = await FFMpeg.init();
  const pexelsApi = new PexelsAPI(config.pexelsApiKey);
  const musicManager = new MusicManager(config);

  // Create ShortCreator instance
  const shortCreator = new ShortCreator(
    config,
    remotion,
    kokoro,
    openaiTts,
    translationService,
    whisper,
    ffmpeg,
    pexelsApi,
    musicManager,
  );

  // Persian video example 1: Nature and Peace
  const persianScenes1 = [
    {
      text: "طبیعت زیبا و آرامش بخش است",
      searchTerms: ["طبیعت", "آرامش", "زیبایی"], // Will be translated to ["nature", "peace", "beauty"]
    },
    {
      text: "درختان سبز و آسمان آبی",
      searchTerms: ["درخت", "آسمان", "سبز"], // Will be translated to ["tree", "sky", "green"]
    },
    {
      text: "پرندگان در آزادی پرواز می‌کنند",
      searchTerms: ["پرنده", "پرواز", "آزادی"], // Will be translated to ["bird", "flight", "freedom"]
    },
  ];

  // Persian video example 2: City Life
  const persianScenes2 = [
    {
      text: "زندگی در شهر پر از انرژی است",
      searchTerms: ["شهر", "زندگی", "انرژی"], // Will be translated to ["city", "life", "energy"]
    },
    {
      text: "مردم در خیابان‌ها قدم می‌زنند",
      searchTerms: ["مردم", "خیابان", "قدم زدن"], // Will be translated to ["people", "street", "walking"]
    },
  ];

  console.log("Creating Persian nature video...");
  const videoId1 = shortCreator.addToQueue(persianScenes1, {
    language: LanguageEnum.fa,
    ttsEngine: TtsEngineEnum.openai,
    orientation: OrientationEnum.portrait,
    captionPosition: CaptionPositionEnum.bottom,
    music: MusicMoodEnum.chill,
    paddingBack: 2000,
  });

  console.log("Creating Persian city life video...");
  const videoId2 = shortCreator.addToQueue(persianScenes2, {
    language: LanguageEnum.fa,
    ttsEngine: TtsEngineEnum.openai,
    orientation: OrientationEnum.landscape,
    captionPosition: CaptionPositionEnum.center,
    music: MusicMoodEnum.excited,
    paddingBack: 1500,
  });

  console.log(`Persian videos queued with IDs: ${videoId1}, ${videoId2}`);
  console.log("Videos will be processed in the background.");
  
  return [videoId1, videoId2];
}

// Export for use in other files
export { createPersianVideo };

// Example usage if running directly
if (require.main === module) {
  createPersianVideo()
    .then((videoIds) => {
      console.log("Persian video creation initiated successfully!");
      console.log("Video IDs:", videoIds);
    })
    .catch((error) => {
      console.error("Error creating Persian videos:", error);
      process.exit(1);
    });
}