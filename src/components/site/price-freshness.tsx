import { priceFreshness, relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const TONE = {
  fresh: { dot: "bg-success", text: "text-muted-foreground" },
  recent: { dot: "bg-warning", text: "text-muted-foreground" },
  stale: { dot: "bg-destructive", text: "text-destructive" },
} as const;

/**
 * A price nobody has touched in two months is a lead, not a quote. The dot
 * tells buyers how much to trust the number before they pick up the phone.
 */
export function PriceFreshness({ iso, className }: { iso: string; className?: string }) {
  const level = priceFreshness(iso);
  const tone = TONE[level];

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs", tone.text, className)}
      title={
        level === "stale"
          ? "This price has not been confirmed recently — check with the supplier."
          : "Price confirmed by the supplier"
      }
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} aria-hidden="true" />
      {relativeTime(iso)}
    </span>
  );
}
