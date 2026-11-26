import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BadgeCheck, Phone, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductSearchBar } from "@/components/site/product-search";
import { SortSelect } from "@/components/site/sort-select";
import { PriceFreshness } from "@/components/site/price-freshness";
import { EmptyState } from "@/components/site/empty-state";
import { listProducts } from "@/lib/data";
import { getCategory } from "@/lib/categories";
import { getDistrictName } from "@/lib/nepal";
import { npr, telHref, unitLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductFilters, ProductListing } from "@/lib/types";

export const metadata: Metadata = {
  title: "Compare wholesale prices",
  description:
    "Search any product across every wholesale supplier in Nepal and sort by price. Rates are stamped with the date the supplier last confirmed them.",
};

const SORT_OPTIONS = [
  { value: "price_asc", label: "Cheapest first" },
  { value: "price_desc", label: "Most expensive" },
  { value: "name", label: "Name (A–Z)" },
  { value: "updated", label: "Recently updated" },
];

const RESULT_LIMIT = 120;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Across the whole result set, find the cheapest listing of each product that
 * more than one supplier sells. That pair — "three people sell this, here is
 * the cheapest" — is the reason the page exists, so it gets a badge.
 */
function findLowestPriced(listings: ProductListing[]): Set<string> {
  const best = new Map<string, { id: string; price: number; sellers: number }>();

  for (const listing of listings) {
    const key = listing.name.toLowerCase();
    const current = best.get(key);
    if (!current) {
      best.set(key, { id: listing.id, price: listing.price, sellers: 1 });
    } else {
      best.set(key, {
        id: listing.price < current.price ? listing.id : current.id,
        price: Math.min(listing.price, current.price),
        sellers: current.sellers + 1,
      });
    }
  }

  return new Set(
    [...best.values()].filter((entry) => entry.sellers > 1).map((entry) => entry.id),
  );
}

async function ProductResults({ filters }: { filters: ProductFilters }) {
  const all = await listProducts(filters);
  const products = all.slice(0, RESULT_LIMIT);
  const lowest = findLowestPriced(all);

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products match that search"
        description="Try a shorter term — 'rice' rather than 'jeera masino rice 25 kg' — or clear the district filter."
        action={
          <Button asChild variant="outline">
            <Link href="/products">Clear filters</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm tabular">
          {all.length} {all.length === 1 ? "listing" : "listings"}
          {all.length > RESULT_LIMIT && ` · showing first ${RESULT_LIMIT}`}
        </p>
        <SortSelect options={SORT_OPTIONS} defaultValue="price_asc" basePath="/products" />
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <caption className="sr-only">Wholesale prices across suppliers</caption>
          <thead className="bg-muted/60">
            <tr className="text-muted-foreground text-left text-xs">
              <th scope="col" className="px-4 py-2.5 font-medium">Product</th>
              <th scope="col" className="hidden px-4 py-2.5 font-medium md:table-cell">Supplier</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Rate</th>
              <th scope="col" className="hidden px-4 py-2.5 text-right font-medium lg:table-cell">
                Min qty
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">
                <span className="sr-only">Contact</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr
                key={product.id}
                className={cn("hover:bg-muted/40 transition-colors", !product.inStock && "opacity-60")}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium">{product.name}</span>
                    {product.nameNe && (
                      <span className="text-muted-foreground font-devanagari text-xs">
                        {product.nameNe}
                      </span>
                    )}
                    {!product.inStock && (
                      <Badge variant="destructive" className="text-[0.6875rem]">
                        Out of stock
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    <Link
                      href={`/categories/${product.categorySlug}`}
                      className="hover:text-foreground"
                    >
                      {getCategory(product.categorySlug)?.name ?? product.categorySlug}
                    </Link>
                  </p>
                  {/* On narrow screens the supplier column is hidden, so repeat it. */}
                  <p className="mt-1 text-xs md:hidden">
                    <Link
                      href={`/suppliers/${product.supplier.slug}`}
                      className="text-primary font-medium"
                    >
                      {product.supplier.businessName}
                    </Link>
                    <span className="text-muted-foreground">
                      {" "}· {getDistrictName(product.supplier.districtSlug)}
                    </span>
                  </p>
                </td>

                <td className="hidden px-4 py-3 md:table-cell">
                  <Link
                    href={`/suppliers/${product.supplier.slug}`}
                    className="hover:text-primary inline-flex items-center gap-1.5 font-medium"
                  >
                    {product.supplier.businessName}
                    {product.supplier.isVerified && (
                      <BadgeCheck className="text-success size-3.5 shrink-0" aria-label="Verified" />
                    )}
                  </Link>
                  <p className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
                    <span>
                      {product.supplier.city}, {getDistrictName(product.supplier.districtSlug)}
                    </span>
                    {product.supplier.deliveryAvailable && (
                      <span className="text-success inline-flex items-center gap-1">
                        <Truck className="size-3" />
                        Delivers
                      </span>
                    )}
                  </p>
                </td>

                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    {lowest.has(product.id) && (
                      <Badge variant="success" className="px-1.5 text-[0.6875rem]">
                        Lowest
                      </Badge>
                    )}
                    <span className="tabular font-semibold">{npr(product.price)}</span>
                  </span>
                  <span className="text-muted-foreground block text-xs">
                    per {unitLabel(product.unit)}
                  </span>
                  <PriceFreshness iso={product.priceUpdatedAt} className="mt-0.5 justify-end" />
                </td>

                <td className="tabular text-muted-foreground hidden px-4 py-3 text-right whitespace-nowrap lg:table-cell">
                  {product.minQuantity} {unitLabel(product.unit)}
                  {product.supplier.minOrderAmount !== null && (
                    <span className="block text-xs">
                      min {npr(product.supplier.minOrderAmount, { compact: true })}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  <Button asChild variant="outline" size="icon-sm" aria-label={`Call ${product.supplier.businessName}`}>
                    <a href={telHref(product.supplier.phone)}>
                      <Phone className="size-3.5" />
                    </a>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const filters: ProductFilters = {
    query: one(params.q),
    category: one(params.category),
    district: one(params.district),
    inStockOnly: one(params.inStock) === "1",
    sort: (one(params.sort) as ProductFilters["sort"]) ?? "price_asc",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Compare wholesale prices</h1>
        <p className="text-muted-foreground mt-2 text-pretty">
          One search across every supplier&rsquo;s price list. Sort by rate, check how fresh the
          price is, then call whoever suits you.
        </p>
      </header>

      <div className="mt-6">
        <Suspense fallback={<Skeleton className="h-44 w-full rounded-xl" />}>
          <ProductSearchBar />
        </Suspense>
      </div>

      <div className="mt-6">
        <Suspense
          key={JSON.stringify(filters)}
          fallback={
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          }
        >
          <ProductResults filters={filters} />
        </Suspense>
      </div>

      <p className="text-muted-foreground mt-6 text-xs text-pretty">
        Prices are published by suppliers and are indicative. Fresh produce, meat and LPG move with
        the market — always confirm the rate on the day you order.
      </p>
    </div>
  );
}
