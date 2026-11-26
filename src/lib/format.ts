import type { PaymentMethod, Unit } from "./types";

/**
 * Format an amount in Nepali rupees.
 *
 * Nepal uses the South Asian digit grouping (1,00,000 = one lakh), which is
 * what `en-IN` produces — `en-NP` is not a reliable locale in every runtime.
 */
export function npr(amount: number, options: { compact?: boolean } = {}): string {
  if (options.compact) {
    if (amount >= 10_000_000) return `Rs ${(amount / 10_000_000).toFixed(1)} crore`;
    if (amount >= 100_000) return `Rs ${(amount / 100_000).toFixed(amount % 100_000 === 0 ? 0 : 1)} lakh`;
    if (amount >= 1_000) return `Rs ${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)}k`;
  }
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(amount);
  return `Rs ${formatted}`;
}

const UNIT_LABELS: Record<Unit, { short: string; long: string }> = {
  kg: { short: "kg", long: "kilogram" },
  gram: { short: "g", long: "gram" },
  litre: { short: "L", long: "litre" },
  ml: { short: "ml", long: "millilitre" },
  piece: { short: "pc", long: "piece" },
  dozen: { short: "dzn", long: "dozen" },
  crate: { short: "crate", long: "crate" },
  carton: { short: "carton", long: "carton" },
  sack: { short: "sack", long: "sack" },
  bora: { short: "bora", long: "bora (sack)" },
  packet: { short: "pkt", long: "packet" },
  bottle: { short: "btl", long: "bottle" },
  bundle: { short: "bundle", long: "bundle" },
  tin: { short: "tin", long: "tin" },
};

export function unitLabel(unit: Unit, long = false): string {
  const entry = UNIT_LABELS[unit];
  if (!entry) return unit;
  return long ? entry.long : entry.short;
}

export const ALL_UNITS = Object.keys(UNIT_LABELS) as Unit[];

/** "Rs 185 / kg" */
export function pricePerUnit(price: number, unit: Unit): string {
  return `${npr(price)} / ${unitLabel(unit)}`;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  esewa: "eSewa",
  khalti: "Khalti",
  fonepay: "FonePay",
  cheque: "Cheque",
  credit: "Credit account",
};

export function paymentLabel(method: PaymentMethod): string {
  return PAYMENT_LABELS[method] ?? method;
}

export const ALL_PAYMENT_METHODS = Object.keys(PAYMENT_LABELS) as PaymentMethod[];

/**
 * Normalise a Nepali phone number for `tel:` links.
 * Accepts "9801234567", "01-4567890", "+977 9801234567".
 */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("977")) return `tel:+${digits}`;
  return `tel:+977${digits.replace(/^0+/, "")}`;
}

export function whatsappHref(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  const withCountry = digits.startsWith("977") ? digits : `977${digits}`;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${withCountry}${query}`;
}

export function viberHref(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  const withCountry = digits.startsWith("977") ? digits : `977${digits}`;
  return `viber://chat?number=%2B${withCountry}`;
}

/** "2 days ago", "3 weeks ago" — for "price updated" freshness. */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const day = 86_400_000;
  const days = Math.floor(diffMs / day);

  if (days < 0) return "scheduled";
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

/** How stale a listed price is — drives the colour of the freshness dot. */
export function priceFreshness(iso: string, now: Date = new Date()): "fresh" | "recent" | "stale" {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 7) return "fresh";
  if (days <= 30) return "recent";
  return "stale";
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function dayName(day: number): string {
  return DAY_NAMES[day] ?? "";
}

/** Convert "06:00" to "6:00 AM". */
export function timeLabel(value: string | null): string {
  if (!value) return "Closed";
  const [hStr, mStr] = value.split(":");
  const h = Number(hStr);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${suffix}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
