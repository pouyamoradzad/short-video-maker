import { describe, it, expect, beforeEach } from "vitest";
import { detectLanguage, detectPersianText, translateSearchTermsForPexels, isRTL } from "../utils/languageDetection";

describe("Persian Language Support", () => {
  describe("Language Detection", () => {
    it("should detect Persian text correctly", () => {
      const persianText = "سلام دنیا";
      const englishText = "Hello world";
      const mixedText = "Hello سلام";
      
      expect(detectPersianText(persianText)).toBe(true);
      expect(detectPersianText(englishText)).toBe(false);
      expect(detectPersianText(mixedText)).toBe(true);
    });

    it("should detect language correctly", () => {
      expect(detectLanguage("سلام دنیا")).toBe("fa");
      expect(detectLanguage("Hello world")).toBe("en");
      expect(detectLanguage("سلام Hello")).toBe("fa");
    });

    it("should detect RTL text correctly", () => {
      expect(isRTL("سلام دنیا")).toBe(true);
      expect(isRTL("Hello world")).toBe(false);
      expect(isRTL("سلام Hello")).toBe(true);
    });
  });

  describe("Search Terms Translation", () => {
    it("should translate Persian search terms to English", () => {
      const persianTerms = ["طبیعت", "کوه", "دریا"];
      const translatedTerms = translateSearchTermsForPexels(persianTerms);
      
      expect(translatedTerms).toEqual(["nature", "mountain", "sea"]);
    });

    it("should handle mixed Persian and English terms", () => {
      const mixedTerms = ["طبیعت", "city", "کوه"];
      const translatedTerms = translateSearchTermsForPexels(mixedTerms);
      
      expect(translatedTerms).toEqual(["nature", "city", "mountain"]);
    });

    it("should return original terms for unknown Persian words", () => {
      const unknownTerms = ["کلمه_ناشناخته", "طبیعت"];
      const translatedTerms = translateSearchTermsForPexels(unknownTerms);
      
      expect(translatedTerms).toEqual(["کلمه_ناشناخته", "nature"]);
    });

    it("should handle empty arrays", () => {
      const emptyTerms: string[] = [];
      const translatedTerms = translateSearchTermsForPexels(emptyTerms);
      
      expect(translatedTerms).toEqual([]);
    });
  });

  describe("Persian Text Processing", () => {
    it("should handle Persian diacritics", () => {
      const textWithDiacritics = "مُحَمَّد";
      expect(detectPersianText(textWithDiacritics)).toBe(true);
      expect(isRTL(textWithDiacritics)).toBe(true);
    });

    it("should handle Persian numbers", () => {
      const persianNumbers = "۱۲۳۴۵";
      expect(detectPersianText(persianNumbers)).toBe(true);
    });

    it("should handle mixed content with Persian and English", () => {
      const mixedContent = "Hello سلام world دنیا";
      expect(detectPersianText(mixedContent)).toBe(true);
      expect(detectLanguage(mixedContent)).toBe("fa");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings", () => {
      expect(detectPersianText("")).toBe(false);
      expect(detectLanguage("")).toBe("en");
      expect(isRTL("")).toBe(false);
    });

    it("should handle strings with only spaces", () => {
      expect(detectPersianText("   ")).toBe(false);
      expect(detectLanguage("   ")).toBe("en");
    });

    it("should handle strings with special characters", () => {
      expect(detectPersianText("!@#$%^&*()")).toBe(false);
      expect(detectLanguage("!@#$%^&*()")).toBe("en");
    });
  });
});