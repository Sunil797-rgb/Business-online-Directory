"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISTRICTS_BY_PROMINENCE } from "@/lib/nepal";
import { cn } from "@/lib/utils";

const ANY_DISTRICT = "__any__";

/**
 * The hero search. Deliberately two fields only — what you need and where —
 * because that is the whole question a restaurant owner is asking.
 */
export function SearchBar({
  defaultQuery = "",
  defaultDistrict = "",
  className,
  size = "lg",
}: {
  defaultQuery?: string;
  defaultDistrict?: string;
  className?: string;
  size?: "lg" | "sm";
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [district, setDistrict] = useState(defaultDistrict || ANY_DISTRICT);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (district && district !== ANY_DISTRICT) params.set("district", district);
    router.push(`/suppliers${params.toString() ? `?${params}` : ""}`);
  }

  const tall = size === "lg";

  return (
    <form
      onSubmit={submit}
      role="search"
      className={cn(
        "bg-card flex flex-col gap-2 rounded-xl border p-2 shadow-sm sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="relative flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you need? e.g. chicken, rice, momo wrapper"
          aria-label="What are you looking for"
          className={cn(
            "placeholder:text-muted-foreground/70 w-full rounded-lg bg-transparent pr-3 pl-9 text-sm outline-none",
            tall ? "h-11" : "h-9",
          )}
        />
      </div>

      <div className="bg-border hidden w-px self-stretch sm:block" />

      <Select value={district} onValueChange={setDistrict}>
        <SelectTrigger
          aria-label="District"
          className={cn(
            "border-0 shadow-none sm:w-52 focus-visible:ring-0",
            tall ? "!h-11" : "!h-9",
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <MapPin className="text-muted-foreground size-4 shrink-0" />
            <SelectValue placeholder="Anywhere in Nepal" />
          </span>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value={ANY_DISTRICT}>Anywhere in Nepal</SelectItem>
          {DISTRICTS_BY_PROMINENCE.map((d) => (
            <SelectItem key={d.slug} value={d.slug}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" size={tall ? "lg" : "default"} className="sm:px-6">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  );
}
