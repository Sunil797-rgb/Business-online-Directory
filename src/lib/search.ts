/**
 * Text matching for the directory's search boxes.
 *
 * Plain substring matching is wrong here: a search for "rice" matches the
 * word "price", so an LPG cylinder whose terms mention a "government-regulated
 * price" turns up under rice. Matching on word *prefixes* instead keeps
 * "rice" → "Jeera Masino rice" while dropping "price", and still lets someone
 * type "veg" and find "vegetables".
 */

/** Terms a user typed, lowercased and split on whitespace. */
export function parseQuery(query: string): string[] {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

const ASCII_WORD = /^[a-z0-9]+$/;

/**
 * True when every term prefixes some word in `haystack`.
 *
 * Non-ASCII terms (Devanagari, mostly) fall back to substring matching,
 * because JavaScript's `\b` is defined over ASCII word characters and would
 * never fire inside a Devanagari string.
 */
export function matchesTerms(haystack: string, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const text = haystack.toLowerCase();

  return terms.every((term) => {
    if (!ASCII_WORD.test(term)) return text.includes(term);
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}`).test(text);
  });
}
