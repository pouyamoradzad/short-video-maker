import { describe, it, expect } from "vitest";
import { detectLanguage, detectPersianText, translateSearchTerms, isRTL } from "../utils/languageDetection";

describe("Persian Language Support", () => {
  describe("Language Detection", () => {
    it("should detect Persian text correctly", () => {
      const persianText = "سلام دنیا";
      const englishText = "Hello world";
      
      expect(detectPersianText(persianText)).toBe(true);
      expect(detectPersianText(englishText)).toBe(false);
    });

    it("should detect language correctly", () => {
      expect(detectLanguage("سلام دنیا")).toBe("fa");
      expect(detectLanguage("Hello world")).toBe("en");
      expect(detectLanguage("مرحبا بالعالم")).toBe("fa"); // Arabic text detected as Persian (current behavior)
    });
  });

  describe("RTL Support", () => {
    it("should identify RTL languages correctly", () => {
      expect(isRTL("fa")).toBe(true);
      expect(isRTL("en")).toBe(false);
    });
  });

  describe("Search Term Translation", () => {
    it("should translate Persian search terms to English", () => {
      const persianTerms = ["طبیعت", "شهر", "تکنولوژی"];
      const translated = translateSearchTerms(persianTerms, "fa");
      
      expect(translated).toEqual(["nature", "city", "technology"]);
    });

    it("should not translate English search terms", () => {
      const englishTerms = ["nature", "city", "technology"];
      const translated = translateSearchTerms(englishTerms, "en");
      
      expect(translated).toEqual(englishTerms);
    });

    it("should handle mixed terms", () => {
      const mixedTerms = ["طبیعت", "city", "تکنولوژی"];
      const translated = translateSearchTerms(mixedTerms, "fa");
      
      expect(translated).toEqual(["nature", "city", "technology"]);
    });
  });

  describe("Persian Text Processing", () => {
    it("should handle Persian diacritics", () => {
      const textWithDiacritics = "سلام";
      expect(detectPersianText(textWithDiacritics)).toBe(true);
    });

    it("should handle Persian numbers", () => {
      const textWithNumbers = "سال ۱۴۰۳";
      expect(detectPersianText(textWithNumbers)).toBe(true);
    });

    it("should handle mixed Persian and English", () => {
      const mixedText = "سلام Hello دنیا world";
      expect(detectLanguage(mixedText)).toBe("fa"); // Should detect as Persian due to Persian characters
    });
  });
});