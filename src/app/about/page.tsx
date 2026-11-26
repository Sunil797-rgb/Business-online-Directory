import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Thok Bazar is a wholesale supplier directory built for Nepali restaurants and small businesses.",
};

export default async function AboutPage() {
  const stats = await getStats();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About Thok Bazar</h1>

      <div className="mt-6 space-y-5 leading-relaxed text-pretty">
        <p>
          Opening a restaurant in Nepal is hard enough. Finding the people who supply it should not
          be. Most new kitchen owners end up sourcing through whoever a cousin recommends, paying
          whatever the first wholesaler quotes, and only discovering a better poultry farm or rice
          mill a year later — by accident.
        </p>
        <p>
          Thok Bazar (<span className="font-devanagari">थोक बजार</span>, &ldquo;wholesale
          market&rdquo;) puts that information in one place. Suppliers publish what they stock, what
          they charge, what their minimum order is, where they deliver and what their terms are.
          Buyers search by item and district, compare, and call whoever fits.
        </p>
        <p>
          We deliberately kept it a directory rather than a marketplace. Wholesale trade in Nepal
          runs on relationships, phone calls and credit arrangements that no checkout flow captures
          well. Our job is to get a restaurant owner to the right phone number with their eyes open
          — not to sit in the middle of the transaction taking a cut.
        </p>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          { label: "Suppliers", value: stats.supplierCount },
          { label: "Products priced", value: stats.productCount },
          { label: "Categories", value: stats.categoryCount },
          { label: "Districts", value: stats.districtCount },
        ].map((stat) => (
          <div key={stat.label}>
            <dd className="tabular text-2xl font-bold">{stat.value}</dd>
            <dt className="text-muted-foreground text-xs">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <Card className="mt-10 p-6">
        <h2 className="font-semibold">Who it is for</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
          Restaurants, cafés, hotels, bakeries, caterers, canteens, hostels and small retailers —
          anyone buying in bulk rather than at retail. On the supply side: poultry farms, rice
          mills, cold stores, dairies, kirana wholesalers, bakeries, liquor distributors, spice
          grinders, packaging suppliers and equipment dealers.
        </p>
      </Card>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/suppliers">Find a supplier</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/register-business">List your business</Link>
        </Button>
      </div>
    </div>
  );
}
