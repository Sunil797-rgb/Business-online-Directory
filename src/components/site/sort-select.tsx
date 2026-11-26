"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortSelect({
  options,
  defaultValue,
  basePath,
  label = "Sort by",
}: {
  options: { value: string; label: string }[];
  defaultValue: string;
  basePath: string;
  label?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground hidden text-xs sm:inline">{label}</span>
      <Select
        value={params.get("sort") ?? defaultValue}
        onValueChange={(value) => {
          const next = new URLSearchParams(params.toString());
          if (value === defaultValue) next.delete("sort");
          else next.set("sort", value);
          router.push(`${basePath}${next.toString() ? `?${next}` : ""}`, { scroll: false });
        }}
      >
        <SelectTrigger size="sm" className="w-44" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
