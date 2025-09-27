import { test, expect, describe } from "vitest";
import { LanguageDetector } from "./LanguageDetector";
import { LanguageEnum } from "../../types/shorts";

describe("Persian Language Support", () => {
  describe("LanguageDetector", () => {
    test("should detect Persian text correctly", () => {
      const persianText = "سلام دنیا";
      const result = LanguageDetector.detectLanguage(persianText);
      expect(result).toBe(LanguageEnum.fa);
    });

    test("should detect English text correctly", () => {
      const englishText = "Hello world";
      const result = LanguageDetector.detectLanguage(englishText);
      expect(result).toBe(LanguageEnum.en);
    });

    test("should detect mixed text as Persian if predominantly Persian", () => {
      const mixedText = "سلام world دنیا";
      const result = LanguageDetector.detectLanguage(mixedText);
      expect(result).toBe(LanguageEnum.fa);
    });

    test("should validate Persian text correctly", () => {
      expect(LanguageDetector.isValidPersianText("سلام دنیا")).toBe(true);
      expect(LanguageDetector.isValidPersianText("Hello world")).toBe(false);
      expect(LanguageDetector.isValidPersianText("")).toBe(false);
    });

    test("should check if text is predominantly Persian", () => {
      expect(LanguageDetector.isPredominantlyPersian("سلام دنیا")).toBe(true);
      expect(LanguageDetector.isPredominantlyPersian("Hello world")).toBe(false);
      expect(LanguageDetector.isPredominantlyPersian("سلام world")).toBe(true); // 50% Persian
    });
  });

  // Note: Integration tests for OpenAI TTS and Translation would require API keys
  // and should be run separately or with proper mocking
});

// Sample Persian texts for testing
export const SAMPLE_PERSIAN_TEXTS = {
  short: "سلام",
  medium: "این یک متن فارسی است",
  long: "این متن طولانی‌تری از متن فارسی است که برای تست استفاده می‌شود",
  withNumbers: "این متن شامل اعداد ۱۲۳ است",
  withPunctuation: "سلام دنیا! چطور هستید؟",
  mixed: "Hello سلام world دنیا",
  nature: "طبیعت زیبا و آرامش بخش است",
  city: "زندگی در شهر پر از انرژی است",
  technology: "فناوری زندگی ما را تغییر داده است",
};

export const SAMPLE_SEARCH_TERMS = {
  nature: ["طبیعت", "درخت", "آسمان", "آب"],
  city: ["شهر", "ساختمان", "خیابان", "مردم"],
  technology: ["فناوری", "کامپیوتر", "اینترنت", "موبایل"],
  emotions: ["خوشحالی", "غم", "عشق", "امید"],
};