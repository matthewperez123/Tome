/**
 * Romanized transliteration for Ancient Greek, Aramaic, and Arabic scripts.
 * Provides a toggleable reading aid for beginners.
 */

// Ancient Greek to Latin transliteration
const GREEK_MAP: Record<string, string> = {
  α: "a", β: "b", γ: "g", δ: "d", ε: "e", ζ: "z", η: "ē", θ: "th",
  ι: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", π: "p",
  ρ: "r", σ: "s", ς: "s", τ: "t", υ: "u", φ: "ph", χ: "ch", ψ: "ps",
  ω: "ō",
  Α: "A", Β: "B", Γ: "G", Δ: "D", Ε: "E", Ζ: "Z", Η: "Ē", Θ: "Th",
  Ι: "I", Κ: "K", Λ: "L", Μ: "M", Ν: "N", Ξ: "X", Ο: "O", Π: "P",
  Ρ: "R", Σ: "S", Τ: "T", Υ: "U", Φ: "Ph", Χ: "Ch", Ψ: "Ps", Ω: "Ō",
  // Diacritics — strip breathing marks and accents for simplicity
  ά: "a", έ: "e", ή: "ē", ί: "i", ό: "o", ύ: "u", ώ: "ō",
  ὰ: "a", ὲ: "e", ὴ: "ē", ὶ: "i", ὸ: "o", ὺ: "u", ὼ: "ō",
  ἀ: "a", ἁ: "ha", ἐ: "e", ἑ: "he", ἠ: "ē", ἡ: "hē",
  ἰ: "i", ἱ: "hi", ὀ: "o", ὁ: "ho", ὐ: "u", ὑ: "hu",
  ἄ: "a", ἅ: "ha", ἔ: "e", ἕ: "he", ἤ: "ē", ἥ: "hē",
  ἴ: "i", ἵ: "hi", ὄ: "o", ὅ: "ho", ὔ: "u", ὕ: "hu",
  ᾶ: "a", ῆ: "ē", ῖ: "i", ῦ: "u", ῶ: "ō",
  ᾳ: "ai", ῃ: "ēi", ῳ: "ōi",
  ϊ: "i", ϋ: "u",
};

// Basic Arabic to Latin transliteration (simplified scholarly standard)
const ARABIC_MAP: Record<string, string> = {
  ا: "a", ب: "b", ت: "t", ث: "th", ج: "j", ح: "ḥ", خ: "kh",
  د: "d", ذ: "dh", ر: "r", ز: "z", س: "s", ش: "sh", ص: "ṣ",
  ض: "ḍ", ط: "ṭ", ظ: "ẓ", ع: "ʿ", غ: "gh", ف: "f", ق: "q",
  ك: "k", ل: "l", م: "m", ن: "n", ه: "h", و: "w", ي: "y",
  ء: "ʾ", ة: "a", ى: "ā", آ: "ā",
  // Diacritics
  "\u064E": "a", "\u064F": "u", "\u0650": "i", // fatḥa, ḍamma, kasra
  "\u0651": "", // shadda (double consonant - handled contextually)
  "\u0652": "", // sukun
  "\u064B": "an", "\u064C": "un", "\u064D": "in", // tanwin
};

// Basic Aramaic (Syriac) to Latin transliteration
const ARAMAIC_MAP: Record<string, string> = {
  ܐ: "ʾ", ܒ: "b", ܓ: "g", ܕ: "d", ܗ: "h", ܘ: "w",
  ܙ: "z", ܚ: "ḥ", ܛ: "ṭ", ܝ: "y", ܟ: "k", ܠ: "l",
  ܡ: "m", ܢ: "n", ܣ: "s", ܥ: "ʿ", ܦ: "p", ܨ: "ṣ",
  ܩ: "q", ܪ: "r", ܫ: "sh", ܬ: "t",
};

function transliterateWithMap(
  text: string,
  charMap: Record<string, string>
): string {
  let result = "";
  for (const char of text) {
    result += charMap[char] ?? char;
  }
  return result;
}

export function transliterate(
  text: string,
  language: "GREEK" | "ARAMAIC" | "ARABIC"
): string {
  switch (language) {
    case "GREEK":
      return transliterateWithMap(text, GREEK_MAP);
    case "ARABIC":
      return transliterateWithMap(text, ARABIC_MAP);
    case "ARAMAIC":
      return transliterateWithMap(text, ARAMAIC_MAP);
    default:
      return text;
  }
}

export function needsTransliteration(language: string): boolean {
  return language === "GREEK" || language === "ARAMAIC" || language === "ARABIC";
}
