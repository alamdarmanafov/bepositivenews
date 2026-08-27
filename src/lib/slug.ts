const TRANSLIT: Record<string, string> = {
  ə: "e",
  Ə: "e",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ü: "u",
  Ü: "u",
  ç: "c",
  Ç: "c",
  ş: "s",
  Ş: "s",
  ğ: "g",
  Ğ: "g",
};

const DIACRITIC_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(input: string): string {
  const transliterated = input
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("");

  return transliterated
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITIC_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
