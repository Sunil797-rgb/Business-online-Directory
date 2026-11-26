"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { DISTRICTS_BY_PROMINENCE } from "@/lib/nepal";

const ANY = "__any__";

/** Search + filter bar for the cross-supplier price comparison page. */
export function ProductSearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  function push(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "" || value === ANY) next.delete(key);
      else next.set(key, value);
    }
    router.push(`/products${next.toString() ? `?${next}` : ""}`, { scroll: false });
  }

  return (
    <div className="bg-card space-y-4 rounded-xl border p-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          push({ q: query.trim() || null });
        }}
        role="search"
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a product across every supplier — rice, chicken, cooking oil…"
            aria-label="Search products"
            className="border-input placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/40 h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-[3px]"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-1.5">
          <Label htmlFor="product-category" className="text-xs">
            Category
          </Label>
          <Select
            value={params.get("category") ?? ANY}
            onValueChange={(value) => push({ category: value })}
          >
            <SelectTrigger id="product-category" size="sm">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={ANY}>All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-district" className="text-xs">
            Supplier district
          </Label>
          <Select
            value={params.get("district") ?? ANY}
            onValueChange={(value) => push({ district: value })}
          >
            <SelectTrigger id="product-district" size="sm">
              <SelectValue placeholder="Anywhere in Nepal" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={ANY}>Anywhere in Nepal</SelectItem>
              {DISTRICTS_BY_PROMINENCE.map((district) => (
                <SelectItem key={district.slug} value={district.slug}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2.5 pb-1.5">
          <Checkbox
            id="product-stock"
            checked={params.get("inStock") === "1"}
            onCheckedChange={(checked) => push({ inStock: checked ? "1" : null })}
          />
          <Label htmlFor="product-stock" className="font-normal whitespace-nowrap">
            In stock only
          </Label>
        </div>
      </div>
    </div>
  );
}
