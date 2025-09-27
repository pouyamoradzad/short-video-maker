import { LanguageEnum, SupportedLanguage } from "../types/shorts";

/**
 * Detects if text contains Persian characters
 */
export function detectPersianText(text: string): boolean {
  // Persian Unicode range: U+0600-U+06FF, U+0750-U+077F, U+08A0-U+08FF, U+FB50-U+FDFF, U+FE70-U+FEFF
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  // For now, just check if text contains Arabic/Persian characters
  // In a more sophisticated implementation, you could distinguish between Arabic and Persian
  return persianRegex.test(text);
}

/**
 * Detects the language of the given text
 */
export function detectLanguage(text: string): SupportedLanguage {
  if (detectPersianText(text)) {
    return LanguageEnum.persian;
  }
  return LanguageEnum.english;
}

/**
 * Checks if a language is RTL (Right-to-Left)
 */
export function isRTL(language: SupportedLanguage): boolean {
  return language === LanguageEnum.persian;
}

/**
 * Gets the appropriate Whisper model for the language
 */
export function getWhisperModelForLanguage(language: SupportedLanguage): string {
  if (language === LanguageEnum.persian) {
    // Use multilingual model for Persian
    return "medium";
  }
  return "medium.en";
}

/**
 * Translates Persian search terms to English for Pexels API
 */
export function translateSearchTerms(searchTerms: string[], language: SupportedLanguage): string[] {
  if (language !== LanguageEnum.persian) {
    return searchTerms;
  }

  // Simple Persian to English translation mapping for common terms
  const persianToEnglish: Record<string, string> = {
    // Nature terms
    "طبیعت": "nature",
    "درخت": "tree",
    "جنگل": "forest",
    "کوه": "mountain",
    "دریا": "sea",
    "اقیانوس": "ocean",
    "رودخانه": "river",
    "آسمان": "sky",
    "ابر": "cloud",
    "باران": "rain",
    "برف": "snow",
    "خورشید": "sun",
    "ماه": "moon",
    "ستاره": "star",
    
    // City/Urban terms
    "شهر": "city",
    "خیابان": "street",
    "ساختمان": "building",
    "ماشین": "car",
    "اتوبوس": "bus",
    "قطار": "train",
    "هواپیما": "airplane",
    
    // People terms
    "مرد": "man",
    "زن": "woman",
    "کودک": "child",
    "خانواده": "family",
    "دوست": "friend",
    
    // Technology terms
    "کامپیوتر": "computer",
    "موبایل": "mobile",
    "اینترنت": "internet",
    "تکنولوژی": "technology",
    
    // Business terms
    "کسب و کار": "business",
    "پول": "money",
    "کار": "work",
    "شرکت": "company",
    
    // Food terms
    "غذا": "food",
    "نوشیدنی": "drink",
    "میوه": "fruit",
    "سبزیجات": "vegetables",
    
    // Sports terms
    "فوتبال": "football",
    "بسکتبال": "basketball",
    "تنیس": "tennis",
    "شنا": "swimming",
    
    // General terms
    "زیبا": "beautiful",
    "خوب": "good",
    "بد": "bad",
    "جدید": "new",
    "قدیمی": "old",
    "بزرگ": "big",
    "کوچک": "small",
    "سریع": "fast",
    "آهسته": "slow",
  };

  return searchTerms.map(term => {
    const lowerTerm = term.toLowerCase().trim();
    return persianToEnglish[lowerTerm] || term;
  });
}