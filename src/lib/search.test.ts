import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { matchesTerms, parseQuery } from "./search.ts";
import { npr, priceFreshness, relativeTime, telHref, whatsappHref } from "./format.ts";

describe("matchesTerms", () => {
  it("matches a term at the start of a word", () => {
    assert.equal(matchesTerms("Jeera Masino rice — 25 kg bora", parseQuery("rice")), true);
  });

  it("does not match a term in the middle of a word", () => {
    // The bug this exists to prevent: "rice" matching "price", which put an
    // LPG cylinder in the results for a rice search.
    assert.equal(matchesTerms("government-regulated price", parseQuery("rice")), false);
    assert.equal(matchesTerms("Japanese", parseQuery("pan")), false);
  });

  it("matches partial words from the start", () => {
    assert.equal(matchesTerms("Vegetables and fruits", parseQuery("veg")), true);
  });

  it("requires every term, in any order", () => {
    assert.equal(matchesTerms("Momo wrapper 75 mm", parseQuery("wrapper momo")), true);
    assert.equal(matchesTerms("Momo wrapper 75 mm", parseQuery("momo bun")), false);
  });

  it("falls back to substring matching for Devanagari", () => {
    assert.equal(matchesTerms("गोलभेँडा tomato", parseQuery("गोलभेँडा")), true);
    assert.equal(matchesTerms("तरकारी", parseQuery("मासु")), false);
  });

  it("treats an empty query as matching everything", () => {
    assert.equal(matchesTerms("anything", parseQuery("   ")), true);
  });

  it("does not blow up on regex metacharacters", () => {
    assert.equal(matchesTerms("Burger bun (75 mm)", parseQuery("(75")), true);
  });
});

describe("npr", () => {
  it("uses South Asian digit grouping", () => {
    assert.equal(npr(100000), "Rs 1,00,000");
    assert.equal(npr(2890), "Rs 2,890");
  });

  it("keeps paisa only when there are any", () => {
    assert.equal(npr(14.5), "Rs 14.5");
    assert.equal(npr(19), "Rs 19");
  });

  it("compacts large amounts into lakh", () => {
    assert.equal(npr(100000, { compact: true }), "Rs 1 lakh");
    assert.equal(npr(10000, { compact: true }), "Rs 10k");
  });
});

describe("telHref", () => {
  it("adds the Nepal country code", () => {
    assert.equal(telHref("9801234567"), "tel:+9779801234567");
  });

  it("strips a leading zero from a landline", () => {
    assert.equal(telHref("01-4256710"), "tel:+97714256710");
  });

  it("leaves an already-international number alone", () => {
    assert.equal(telHref("+977 9801234567"), "tel:+9779801234567");
  });

  it("does not double the country code", () => {
    assert.equal(telHref("9779801234567"), "tel:+9779801234567");
    assert.equal(whatsappHref("9779801234567"), "https://wa.me/9779801234567");
  });
});

describe("price freshness", () => {
  const now = new Date("2026-11-26T00:00:00.000Z");
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();

  it("grades a price by how recently it was confirmed", () => {
    assert.equal(priceFreshness(daysAgo(2), now), "fresh");
    assert.equal(priceFreshness(daysAgo(7), now), "fresh");
    assert.equal(priceFreshness(daysAgo(20), now), "recent");
    assert.equal(priceFreshness(daysAgo(45), now), "stale");
  });

  it("describes the age in words", () => {
    assert.equal(relativeTime(daysAgo(0), now), "today");
    assert.equal(relativeTime(daysAgo(1), now), "yesterday");
    assert.equal(relativeTime(daysAgo(10), now), "1 week ago");
    assert.equal(relativeTime(daysAgo(60), now), "2 months ago");
  });
});
