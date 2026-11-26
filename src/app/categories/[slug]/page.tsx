import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SupplierCard } from "@/components/site/supplier-card";
import { CategoryIcon } from "@/components/site/category-icon";
import { EmptyState } from "@/components/site/empty-state";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getDistrictName } from "@/lib/nepal";
import { listProducts, listSuppliers } from "@/lib/data";
import { npr, unitLabel } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: `${category.name} suppliers in Nepal`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const [suppliers, products] = await Promise.all([
    listSuppliers({ category: slug, sort: "rating" }),
    listProducts({ category: slug, sort: "price_asc", inStockOnly: true }),
  ]);

  // Cheapest listing per distinct product name, to show a quick price snapshot.
  const cheapest = new Map<string, (typeof products)[number]>();
  for (const product of products) {
    const key = product.name.toLowerCase();
    if (!cheapest.has(key)) cheapest.set(key, product);
  }
  const priceSnapshot = [...cheapest.values()].slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <nav aria-label="Breadcrumb">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
          <li>
            <Link href="/categories" className="hover:text-foreground">
              Categories
            </Link>
          </li>
          <ChevronRight className="size-3" />
          <li className="text-foreground font-medium">{category.name}</li>
        </ol>
      </nav>

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
        <span
          className="bg-primary/10 text-primary grid size-14 shrink-0 place-items-center rounded-2xl"
          aria-hidden="true"
        >
          <CategoryIcon name={category.icon} className="size-7" />
        </span>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {category.name} suppliers
          </h1>
          <p className="text-muted-foreground font-devanagari text-sm">{category.nameNe}</p>
          <p className="mt-3 text-pretty">{category.description}</p>
        </div>
      </header>

      {priceSnapshot.length > 0 && (
        <Card className="mt-8 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold">
              <TrendingDown className="text-primary size-4" />
              Lowest listed rate right now
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/products?category=${category.slug}`}>Compare all prices</Link>
            </Button>
          </div>
          <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            {priceSnapshot.map((product) => (
              <li
                key={product.id}
                className="flex items-baseline justify-between gap-3 border-b pb-2 text-sm last:border-b-0"
              >
                <span className="truncate" title={product.name}>
                  {product.name}
                </span>
                <span className="tabular shrink-0 font-semibold">
                  {npr(product.price)}
                  <span className="text-muted-foreground font-normal">
                    /{unitLabel(product.unit)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tabular">
            {suppliers.length} {suppliers.length === 1 ? "supplier" : "suppliers"}
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href={`/suppliers?category=${category.slug}`}>Filter these results</Link>
          </Button>
        </div>

        {suppliers.length === 0 ? (
          <EmptyState
            title={`No ${category.name.toLowerCase()} suppliers listed yet`}
            description="Be the first. Listing is free and takes a few minutes."
            action={
              <Button asChild>
                <Link href="/register-business">List your business</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        )}
      </div>

      {suppliers.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold">
            {category.name} suppliers by district
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[...new Set(suppliers.map((s) => s.districtSlug))].map((districtSlug) => (
              <li key={districtSlug}>
                <Link
                  href={`/suppliers?category=${category.slug}&district=${districtSlug}`}
                  className="bg-card hover:border-primary/50 hover:text-primary rounded-full border px-3 py-1.5 text-xs transition-colors"
                >
                  {getDistrictName(districtSlug)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
