"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { CATEGORIES } from "@/lib/categories";
import { DISTRICTS_BY_PROMINENCE } from "@/lib/nepal";
import { ALL_PAYMENT_METHODS, npr, paymentLabel } from "@/lib/format";

const ANY = "__any__";

const MIN_ORDER_STEPS = [2000, 5000, 10000, 20000, 50000];

/**
 * All filter state lives in the URL, so a filtered view can be bookmarked,
 * shared on Viber, or linked to from a category page.
 */
export function SupplierFiltersPanel({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "" || value === ANY) next.delete(key);
        else next.set(key, value);
      }
      startTransition(() => {
        router.push(`/suppliers${next.toString() ? `?${next}` : ""}`, { scroll: false });
      });
    },
    [params, router],
  );

  const activeCount = ["category", "district", "verified", "delivery", "maxMinOrder", "payment"]
    .filter((key) => params.get(key))
    .length;

  return (
    <aside
      className="lg:sticky lg:top-20 lg:self-start"
      aria-label="Filter suppliers"
      data-pending={pending ? "" : undefined}
    >
      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4" />
            Filters
          </h2>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 px-2 text-xs"
              onClick={() =>
                update({
                  category: null,
                  district: null,
                  verified: null,
                  delivery: null,
                  maxMinOrder: null,
                  payment: null,
                })
              }
            >
              <X className="size-3" />
              Clear {activeCount}
            </Button>
          )}
        </div>

        <p className="text-muted-foreground mt-1 text-xs tabular">
          {resultCount} {resultCount === 1 ? "supplier" : "suppliers"} match
        </p>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="filter-category">Category</Label>
            <Select
              value={params.get("category") ?? ANY}
              onValueChange={(v) => update({ category: v })}
            >
              <SelectTrigger id="filter-category" size="sm">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value={ANY}>All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-district">District</Label>
            <Select
              value={params.get("district") ?? ANY}
              onValueChange={(v) => update({ district: v })}
            >
              <SelectTrigger id="filter-district" size="sm">
                <SelectValue placeholder="Anywhere in Nepal" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value={ANY}>Anywhere in Nepal</SelectItem>
                {DISTRICTS_BY_PROMINENCE.map((d) => (
                  <SelectItem key={d.slug} value={d.slug}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-min-order">Minimum order up to</Label>
            <Select
              value={params.get("maxMinOrder") ?? ANY}
              onValueChange={(v) => update({ maxMinOrder: v })}
            >
              <SelectTrigger id="filter-min-order" size="sm">
                <SelectValue placeholder="Any minimum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any minimum</SelectItem>
                {MIN_ORDER_STEPS.map((amount) => (
                  <SelectItem key={amount} value={String(amount)}>
                    {npr(amount)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-payment">Accepts payment by</Label>
            <Select
              value={params.get("payment") ?? ANY}
              onValueChange={(v) => update({ payment: v })}
            >
              <SelectTrigger id="filter-payment" size="sm">
                <SelectValue placeholder="Any method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any method</SelectItem>
                {ALL_PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {paymentLabel(method)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="filter-verified"
              checked={params.get("verified") === "1"}
              onCheckedChange={(checked) => update({ verified: checked ? "1" : null })}
            />
            <Label htmlFor="filter-verified" className="font-normal">
              Verified businesses only
            </Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="filter-delivery"
              checked={params.get("delivery") === "1"}
              onCheckedChange={(checked) => update({ delivery: checked ? "1" : null })}
            />
            <Label htmlFor="filter-delivery" className="font-normal">
              Offers delivery
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}
