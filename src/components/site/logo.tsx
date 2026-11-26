import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 outline-none", className)}
      aria-label="Thok Bazar home"
    >
      <span className="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-lg font-bold shadow-sm transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          {/* A stylised shop awning — the universal sign for a bazar stall. */}
          <path
            d="M3 8.5 4.6 4h14.8L21 8.5M3 8.5h18M3 8.5v11.2A1.3 1.3 0 0 0 4.3 21h15.4a1.3 1.3 0 0 0 1.3-1.3V8.5M8 8.5v2.2a2 2 0 1 1-4 0M12 8.5v2.2a2 2 0 1 1-4 0M16 8.5v2.2a2 2 0 1 1-4 0M20 8.5v2.2a2 2 0 1 1-4 0"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[0.975rem] font-bold tracking-tight">Thok Bazar</span>
          <span className="text-muted-foreground text-[0.6875rem] font-medium">थोक बजार</span>
        </span>
      )}
    </Link>
  );
}
