import { Info } from "lucide-react";

/**
 * Preview-build banner. Replaces the app's demo banner so anyone opening the
 * shared link knows both that the data is invented and that this is a static
 * export rather than the running application.
 */
export function DemoBanner() {
  return (
    <div className="border-warning/35 bg-warning/12 text-foreground border-b">
      <div className="mx-auto flex max-w-7xl items-start gap-2.5 px-4 py-2 text-xs sm:items-center sm:text-[0.8125rem]">
        <Info className="text-warning mt-0.5 size-4 shrink-0 sm:mt-0" />
        <p className="text-pretty">
          <strong className="font-semibold">Static preview.</strong> Every business, phone number
          and price here is a made-up example. Search, filters and forms work; nothing is saved,
          and accounts are inactive.
        </p>
      </div>
    </div>
  );
}
