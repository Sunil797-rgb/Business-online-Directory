import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/site/search-bar";
import { SupplierCard } from "@/components/site/supplier-card";
import { SupplierFiltersPanel } from "@/components/site/supplier-filters";
import { SortSelect } from "@/components/site/sort-select";
import { EmptyState } from "@/components/site/empty-state";
import { listSuppliers } from "@/lib/data";
import { getCategory } from "@/lib/categories";
import { getDistrictName } from "@/lib/nepal";
import type { PaymentMethod, SupplierFilters } from "@/lib/types";

export const metadata: Metadata = {
  title: "Find wholesale suppliers",
  description:
    "Search verified wholesale suppliers across Nepal by category, district, minimum order and delivery. Compare rates and contact them directly.",
};

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "products", label: "Most products" },
  { value: "name", label: "Name (A–Z)" },
  { value: "newest", label: "Newest listings" },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SuppliersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const maxMinOrderRaw = one(params.maxMinOrder);
  const maxMinOrder = maxMinOrderRaw ? Number(maxMinOrderRaw) : undefined;

  const filters: SupplierFilters = {
    query: one(params.q),
    category: one(params.category),
    district: one(params.district),
    verifiedOnly: one(params.verified) === "1",
    deliveryOnly: one(params.delivery) === "1",
    maxMinOrder: Number.isFinite(maxMinOrder) ? maxMinOrder : undefined,
    payment: one(params.payment) as PaymentMethod | undefined,
    sort: (one(params.sort) as SupplierFilters["sort"]) ?? "rating",
  };

  const suppliers = await listSuppliers(filters);

  const headingParts: string[] = [];
  if (filters.category) headingParts.push(getCategory(filters.category)?.name ?? filters.category);
  const heading = headingParts.length > 0 ? `${headingParts.join(" ")} suppliers` : "All suppliers";
  const where = filters.district ? ` in ${getDistrictName(filters.district)}` : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
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
    </div>
  );
}
