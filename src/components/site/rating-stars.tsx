import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  count,
  size = "sm",
  className,
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const starSize = size === "md" ? "size-4" : "size-3.5";
  const rounded = Math.round(rating * 2) / 2;

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`Rated ${rating.toFixed(1)} out of 5${count ? ` from ${count} reviews` : ""}`}
    >
      <span className="flex items-center gap-px" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i <= rounded
                ? "fill-warning text-warning"
                : i - 0.5 === rounded
                  ? "fill-warning/50 text-warning"
                  : "fill-muted text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      <span className="tabular text-xs font-medium">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-muted-foreground text-xs">({count})</span>
      )}
    </span>
  );
}
