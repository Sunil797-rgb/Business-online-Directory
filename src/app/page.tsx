import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  MapPin,
  PhoneCall,
  Search,
  Store,
  TrendingDown,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/site/search-bar";
import { SupplierCard } from "@/components/site/supplier-card";
import { CategoryIcon } from "@/components/site/category-icon";
import { CATEGORIES } from "@/lib/categories";
import { getDistrictName } from "@/lib/nepal";
import { getCategoryCounts, getDistrictCounts, getFeaturedSuppliers, getStats } from "@/lib/data";

const POPULAR_SEARCHES = [
  "chicken",
  "rice",
  "vegetables",
  "momo wrapper",
  "cooking oil",
  "paneer",
  "beer",
  "burger bun",
];

const STEPS = [
  {
    icon: Search,
    title: "Search what your kitchen needs",
    body: "Type an item — chicken, jeera masino, momo wrapper — and filter by your district. You get suppliers who actually stock it, not a phone book.",
  },
  {
    icon: ClipboardList,
    title: "Compare rates and read the terms",
    body: "Every listing shows the price list, minimum order, delivery areas, payment methods and the supplier's own terms and conditions before you commit.",
  },
  {
    icon: PhoneCall,
    title: "Call the supplier and buy direct",
    body: "Ring them, message on Viber, or send an enquiry with your quantities. You deal with the supplier directly — no commission, no middleman.",
  },
];

export default async function HomePage() {
  const [stats, featured, categoryCounts, districtCounts] = await Promise.all([
    getStats(),
    getFeaturedSuppliers(6),
    getCategoryCounts(),
    getDistrictCounts(),
  ]);

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="from-primary/8 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="max-w-3xl">
            <Badge variant="outline" className="bg-background/80 gap-1.5 px-3 py-1">
              <Store className="size-3.5" />
              {stats.supplierCount} suppliers · {stats.districtCount} districts
            </Badge>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Find the wholesale supplier your{" "}
              <span className="text-primary">restaurant</span> actually needs
            </h1>

            <p className="text-muted-foreground mt-5 max-w-2xl text-base text-pretty sm:text-lg">
              Poultry farms, rice mills, vegetable traders, wholesale bakeries, liquor depots and
              kirana wholesalers — with their price lists, minimum orders and terms in the open.
              Search, compare, then call them directly.
            </p>

            <SearchBar className="mt-8 max-w-3xl" />

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/suppliers?q=${encodeURIComponent(term)}`}
                  className="border-border/70 bg-background/70 hover:border-primary/50 hover:text-primary rounded-full border px-2.5 py-1 text-xs transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {[
              { label: "Suppliers listed", value: stats.supplierCount },
              { label: "Products with prices", value: stats.productCount },
              { label: "Supply categories", value: stats.categoryCount },
              { label: "Verified businesses", value: stats.verifiedCount },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-muted-foreground text-xs">{stat.label}</dt>
                <dd className="tabular text-2xl font-bold sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Categories                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Browse by what you buy
            </h2>
            <p className="text-muted-foreground mt-2 text-pretty">
              Sixteen categories covering the whole restaurant supply chain.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/categories">
              All categories
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const count = categoryCounts[category.slug] ?? 0;
            return (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group bg-card hover:border-primary/50 flex h-full flex-col gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
                >
                  <span className="bg-primary/8 text-primary grid size-10 place-items-center rounded-lg transition-transform group-hover:scale-110">
                    <CategoryIcon name={category.icon} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{category.name}</span>
                    <span className="text-muted-foreground font-devanagari mt-0.5 block text-xs">
                      {category.nameNe}
                    </span>
                  </span>
                  <span className="text-muted-foreground text-xs tabular">
                    {count} {count === 1 ? "supplier" : "suppliers"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How it works                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-muted/40 border-y">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Thok Bazar is a directory, not a marketplace. We help you find and judge a supplier;
            you place the order with them yourself.
          </p>

          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <step.icon className="text-primary size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm text-pretty">{step.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured suppliers                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Top-rated suppliers</h2>
            <p className="text-muted-foreground mt-2 text-pretty">
              Verified businesses with the strongest reviews from buyers.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/suppliers">
              Browse all {stats.supplierCount}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Price comparison teaser + districts                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="from-primary/10 bg-gradient-to-br to-transparent p-7 lg:col-span-2">
            <TrendingDown className="text-primary size-7" />
            <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
              Paying too much for rice?
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm text-pretty">
              Search any item across every supplier at once and sort by price. {stats.productCount}{" "}
              products with live rates, each stamped with the date the supplier last confirmed it.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/products">
                  Compare prices
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/products?q=rice">Try &ldquo;rice&rdquo;</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-7">
            <MapPin className="text-primary size-7" />
            <h2 className="mt-4 text-lg font-bold tracking-tight">Suppliers near you</h2>
            <ul className="mt-4 space-y-2">
              {districtCounts.slice(0, 7).map((district) => (
                <li key={district.slug}>
                  <Link
                    href={`/suppliers?district=${district.slug}`}
                    className="group flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="group-hover:text-primary transition-colors">
                      {getDistrictName(district.slug)}
                    </span>
                    <span className="text-muted-foreground tabular text-xs">{district.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Supplier CTA                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <Card className="overflow-hidden">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Badge variant="secondary" className="gap-1.5">
                <Store className="size-3.5" />
                For suppliers
              </Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                Restaurants are searching for what you sell right now
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl text-pretty">
                List your farm, mill, depot or bakery with your product list, rates and terms.
                Buyers call you directly — Thok Bazar takes no commission on any order.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/register-business">
                    List your business free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/for-suppliers">How it works for suppliers</Link>
                </Button>
              </div>
            </div>

            <ul className="space-y-3">
              {[
                { icon: BadgeCheck, text: "Free listing with your full price list" },
                { icon: PhoneCall, text: "Buyers call you — no commission, ever" },
                { icon: Truck, text: "Show your delivery areas and minimum order" },
                { icon: ClipboardList, text: "Publish your terms so there are no surprises" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm">
                  <item.icon className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span className="text-pretty">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </>
  );
}
