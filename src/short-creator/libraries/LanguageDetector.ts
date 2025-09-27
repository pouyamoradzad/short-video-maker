import { LanguageEnum } from "../../types/shorts";

export class LanguageDetector {
  /**
   * Detects if text contains Persian characters
   * Persian Unicode ranges: U+0600–U+06FF (Arabic), U+0750–U+077F (Arabic Supplement), 
   * U+08A0–U+08FF (Arabic Extended-A), U+FB50–U+FDFF (Arabic Presentation Forms-A),
   * U+FE70–U+FEFF (Arabic Presentation Forms-B)
   */
  static detectLanguage(text: string): LanguageEnum {
    // Persian/Farsi character ranges
    const persianPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    
    if (persianPattern.test(text)) {
      return LanguageEnum.fa;
    }
    
    // Default to English
    return LanguageEnum.en;
  }

  /**
   * Checks if the text is predominantly Persian
   * Returns true if more than 30% of the characters are Persian
   */
  static isPredominantlyPersian(text: string): boolean {
    const persianPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
    const persianMatches = text.match(persianPattern);
    const totalChars = text.replace(/\s/g, '').length; // Exclude spaces
    
    if (totalChars === 0) return false;
    
    const persianCharCount = persianMatches ? persianMatches.length : 0;
    const persianRatio = persianCharCount / totalChars;
    
    return persianRatio > 0.3;
  }

  /**
   * Validates if text is suitable for Persian TTS
   */
  static isValidPersianText(text: string): boolean {
    // Check if text contains Persian characters and is not empty
    const trimmed = text.trim();
    if (!trimmed) return false;
    
    return this.isPredominantlyPersian(trimmed);
  }
}