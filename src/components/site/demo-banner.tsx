import { Info } from "lucide-react";
import { DATA_MODE } from "@/lib/supabase/config";

/**
 * Shown whenever the app is running on bundled seed data, so nobody mistakes
 * the sample listings for real businesses.
 */
export function DemoBanner() {
  if (DATA_MODE === "live") return null;

  return (
    <div className="border-warning/35 bg-warning/12 text-foreground border-b">
      <div className="mx-auto flex max-w-7xl items-start gap-2.5 px-4 py-2 text-xs sm:items-center sm:text-[0.8125rem]">
        <Info className="text-warning mt-0.5 size-4 shrink-0 sm:mt-0" />
        <p className="text-pretty">
          <strong className="font-semibold">Demo data.</strong> Every business, phone number and
          price here is a made-up example. Connect a Supabase project (see{" "}
          <code className="bg-foreground/8 rounded px-1 py-0.5 font-mono text-[0.95em]">
            .env.example
          </code>
          ) to run on real listings.
        </p>
      </div>
    </div>
  );
}
