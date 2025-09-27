import { LanguageEnum, type Language } from "../types/shorts";

/**
 * Detects if text contains Persian characters
 */
export function detectPersianText(text: string): boolean {
  // Persian Unicode range: U+0600-U+06FF, U+0750-U+077F, U+08A0-U+08FF, U+FB50-U+FDFF, U+FE70-U+FEFF
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return persianRegex.test(text);
}

/**
 * Detects the language of the given text
 */
export function detectLanguage(text: string): Language {
  if (detectPersianText(text)) {
    return LanguageEnum.fa;
  }
  return LanguageEnum.en;
}

/**
 * Translates Persian search terms to English for Pexels API
 */
export function translateSearchTermsForPexels(searchTerms: string[]): string[] {
  // Simple mapping of common Persian terms to English equivalents
  const persianToEnglishMap: Record<string, string> = {
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
    "خورشید": "sun",
    "ماه": "moon",
    "ستاره": "star",
    
    // City/Urban terms
    "شهر": "city",
    "خیابان": "street",
    "ماشین": "car",
    "ساختمان": "building",
    "پل": "bridge",
    
    // People terms
    "مردم": "people",
    "زن": "woman",
    "مرد": "man",
    "کودک": "child",
    "خانواده": "family",
    
    // Technology terms
    "کامپیوتر": "computer",
    "موبایل": "mobile",
    "اینترنت": "internet",
    "تکنولوژی": "technology",
    
    // Business terms
    "تجارت": "business",
    "پول": "money",
    "کار": "work",
    "شرکت": "company",
    
    // Food terms
    "غذا": "food",
    "نوشیدنی": "drink",
    "میوه": "fruit",
    
    // Sports terms
    "ورزش": "sport",
    "فوتبال": "football",
    "بسکتبال": "basketball",
    "تنیس": "tennis",
    
    // Abstract terms
    "عشق": "love",
    "خوشحالی": "happiness",
    "غم": "sadness",
    "امید": "hope",
    "رویا": "dream",
    "موفقیت": "success",
    "شکست": "failure",
    "زندگی": "life",
    "مرگ": "death",
    "زمان": "time",
    "مکان": "place",
    "سفر": "travel",
    "ماجرا": "adventure",
  };

  return searchTerms.map(term => {
    const lowerTerm = term.toLowerCase().trim();
    return persianToEnglishMap[lowerTerm] || term;
  });
}

/**
 * Checks if text is RTL (Right-to-Left)
 */
export function isRTL(text: string): boolean {
  return detectPersianText(text);
}