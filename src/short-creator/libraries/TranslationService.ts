import OpenAI from "openai";
import { logger } from "../../config";

export class TranslationService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required for translation functionality");
    }
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Translates Persian search terms to English for Pexels API
   */
  async translatePersianToEnglish(persianTerms: string[]): Promise<string[]> {
    try {
      logger.debug({ persianTerms }, "Translating Persian terms to English");

      const prompt = `Translate the following Persian words/phrases to English. 
      These are search terms for finding stock videos, so provide simple, commonly used English words that would work well for video search.
      Return only the English translations, one per line, without any extra formatting or numbering:

      ${persianTerms.join('\n')}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a translator. Translate Persian/Farsi terms to simple English words suitable for video search."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      const translatedText = response.choices[0]?.message?.content?.trim();
      if (!translatedText) {
        throw new Error("No translation received from OpenAI");
      }

      const translatedTerms = translatedText
        .split('\n')
        .map(term => term.trim())
        .filter(term => term.length > 0)
        .slice(0, persianTerms.length); // Ensure we don't get more terms than input

      logger.debug({ persianTerms, translatedTerms }, "Translation completed");

      return translatedTerms.length > 0 ? translatedTerms : persianTerms;
    } catch (error) {
      logger.error(error, "Error translating Persian terms");
      // Fallback: return original terms if translation fails
      return persianTerms;
    }
  }

  /**
   * Simple fallback translation for common Persian words
   */
  private fallbackTranslation(persianTerm: string): string {
    const commonTranslations: Record<string, string> = {
      'طبیعت': 'nature',
      'آسمان': 'sky',
      'دریا': 'ocean',
      'کوه': 'mountain',
      'جنگل': 'forest',
      'شهر': 'city',
      'خورشید': 'sun',
      'ماه': 'moon',
      'ستاره': 'star',
      'آب': 'water',
      'آتش': 'fire',
      'باد': 'wind',
      'زمین': 'earth',
      'انسان': 'people',
      'خانواده': 'family',
      'کودک': 'child',
      'مرد': 'man',
      'زن': 'woman',
      'عشق': 'love',
      'زندگی': 'life',
      'خوشحالی': 'happiness',
      'غمگین': 'sad',
      'موسیقی': 'music',
      'رقص': 'dance',
      'ورزش': 'sport',
      'بازی': 'game',
    };

    return commonTranslations[persianTerm] || persianTerm;
  }

  /**
   * Translates with fallback
   */
  async translateWithFallback(persianTerms: string[]): Promise<string[]> {
    try {
      return await this.translatePersianToEnglish(persianTerms);
    } catch (error) {
      logger.warn("Using fallback translation");
      return persianTerms.map(term => this.fallbackTranslation(term));
    }
  }

  static init(apiKey: string): TranslationService {
    return new TranslationService(apiKey);
  }
}