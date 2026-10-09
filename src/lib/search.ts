function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("pl").normalize("NFKD").replace(/\p{M}/gu, "").replace(/ł/g, "l");
}

export function matchesSearchText(text: string, query: string): boolean {
  const words = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  const normalized = normalizeSearch(text);
  return words.every((word) => normalized.includes(word));
}
