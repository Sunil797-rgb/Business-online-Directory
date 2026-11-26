"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/site/search-bar";
import { SupplierCard } from "@/components/site/supplier-card";
import { SupplierFiltersPanel } from "@/components/site/supplier-filters";
import { SortSelect } from "@/components/site/sort-select";
import { EmptyState } from "@/components/site/empty-state";
import { selectSuppliers } from "@/lib/filters";
import { SEED_SUPPLIERS } from "@/lib/seed/suppliers";
import { SEED_PRODUCTS } from "@/lib/seed/products";
import { getCategory } from "@/lib/categories";
import { getDistrictName } from "@/lib/nepal";
import type { PaymentMethod, SupplierFilters } from "@/lib/types";

/**
 * Static-preview version of /suppliers.
 *
 * The shipped page reads `searchParams` on the server; a static export can't,
 * so this one reads them with `useSearchParams` and runs the identical
 * `selectSuppliers` filter in the browser. See preview/README.md.
 */

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "products", label: "Most products" },
  { value: "name", label: "Name (A–Z)" },
  { value: "newest", label: "Newest listings" },
];

function SuppliersView() {
  const params = useSearchParams();

  const filters: SupplierFilters = useMemo(() => {
    const maxMinOrderRaw = params.get("maxMinOrder");
    const maxMinOrder = maxMinOrderRaw ? Number(maxMinOrderRaw) : undefined;
    return {
      query: params.get("q") ?? undefined,
      category: params.get("category") ?? undefined,
      district: params.get("district") ?? undefined,
      verifiedOnly: params.get("verified") === "1",
      deliveryOnly: params.get("delivery") === "1",
      maxMinOrder: Number.isFinite(maxMinOrder) ? maxMinOrder : undefined,
      payment: (params.get("payment") as PaymentMethod | null) ?? undefined,
      sort: (params.get("sort") as SupplierFilters["sort"]) ?? "rating",
    };
  }, [params]);

  const suppliers = useMemo(
    () => selectSuppliers(SEED_SUPPLIERS, SEED_PRODUCTS, filters),
    [filters],
  );

  const heading = filters.category
    ? `${getCategory(filters.category)?.name ?? filters.category} suppliers`
    : "All suppliers";
  const where = filters.district ? ` in ${getDistrictName(filters.district)}` : "";

  return (
    <>
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {heading}
          {where}
        </h1>
        <p className="text-muted-foreground mt-2 text-pretty">
          {filters.query ? (
            <>
              Showing suppliers matching{" "}
              <span className="text-foreground font-medium">&ldquo;{filters.query}&rdquo;</span> —
              we search business names, descriptions and every product they list.
            </>
          ) : (
            "Filter by what you buy, where you are, and how you want to pay."
          )}
        </p>
      </header>

      <SearchBar
        className="mt-6"
        size="sm"
        defaultQuery={filters.query ?? ""}
        defaultDistrict={filters.district ?? ""}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[17rem_1fr]">
        <SupplierFiltersPanel resultCount={suppliers.length} />

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm tabular">
              {suppliers.length} {suppliers.length === 1 ? "result" : "results"}
            </p>
            <SortSelect options={SORT_OPTIONS} defaultValue="rating" basePath="/suppliers" />
          </div>

          {suppliers.length === 0 ? (
            <EmptyState
              title="No suppliers match those filters"
              description="Try widening the district, clearing the verified filter, or searching for the product name instead of the business name."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild variant="outline">
                    <Link href="/suppliers">Clear all filters</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register-business">
                      <Store className="size-4" />
                      List a supplier you know
                    </Link>
                  </Button>
                </div>
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {suppliers.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function SuppliersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        <SuppliersView />
      </Suspense>
    </div>
  );
}
