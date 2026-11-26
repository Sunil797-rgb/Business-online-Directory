import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Inbox,
  Package,
  Star,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/site/empty-state";
import { VerifiedBadge } from "@/components/site/verified-badge";
import { getDashboardSupplier, listInquiries } from "@/lib/data";
import { npr, priceFreshness, relativeTime } from "@/lib/format";
import { getDistrictName } from "@/lib/nepal";

export const metadata: Metadata = {
  title: "Supplier dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supplier = await getDashboardSupplier();

  if (!supplier) {
    return (
      <EmptyState
        icon={<Package className="size-6" />}
        title="No listing yet"
        description="Create your supplier listing to start appearing in buyer searches."
        action={
          <Button asChild>
            <Link href="/register-business">
              List your business
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
    );
  }

  const inquiries = await listInquiries(supplier.id);
  const newInquiries = inquiries.filter((i) => i.status === "new");
  const stalePrices = supplier.products.filter(
    (p) => priceFreshness(p.priceUpdatedAt) === "stale",
  );
  const outOfStock = supplier.products.filter((p) => !p.inStock);

  const stats = [
    { label: "Products listed", value: supplier.products.length, icon: Package },
    { label: "New enquiries", value: newInquiries.length, icon: Inbox },
    { label: "Average rating", value: supplier.ratingAvg.toFixed(1), icon: Star },
    { label: "Reviews", value: supplier.ratingCount, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{supplier.businessName}</h2>
              {supplier.isVerified ? (
                <VerifiedBadge />
              ) : (
                <Badge variant="warning">Verification pending</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {supplier.city}, {getDistrictName(supplier.districtSlug)} ·{" "}
              {supplier.deliveryAvailable
                ? `Delivers to ${supplier.deliveryAreas.length} districts`
                : "Pickup only"}
              {supplier.minOrderAmount !== null &&
                ` · Min order ${npr(supplier.minOrderAmount)}`}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/suppliers/${supplier.slug}`}>
              View public listing
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        </div>
      </Card>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-sm">{stat.label}</dt>
              <stat.icon className="text-muted-foreground size-4" aria-hidden="true" />
            </div>
            <dd className="tabular mt-2 text-2xl font-bold">{stat.value}</dd>
          </Card>
        ))}
      </dl>

      {(stalePrices.length > 0 || outOfStock.length > 0 || !supplier.isVerified) && (
        <Card className="border-warning/40 bg-warning/5 p-6">
          <h2 className="inline-flex items-center gap-2 font-semibold">
            <AlertTriangle className="text-warning size-5" />
            Things worth fixing
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {!supplier.isVerified && (
              <li className="flex items-start gap-2 text-pretty">
                <span className="bg-warning mt-1.5 size-1.5 shrink-0 rounded-full" />
                Send your PAN/VAT certificate to get the verified badge — verified listings rank
                above unverified ones in every search.
              </li>
            )}
            {stalePrices.length > 0 && (
              <li className="flex items-start gap-2 text-pretty">
                <span className="bg-warning mt-1.5 size-1.5 shrink-0 rounded-full" />
                <span>
                  <strong>{stalePrices.length}</strong>{" "}
                  {stalePrices.length === 1 ? "price has" : "prices have"} not been confirmed in
                  over a month. Buyers see these flagged in red.{" "}
                  <Link href="/dashboard/products" className="text-primary hover:underline">
                    Review them
                  </Link>
                </span>
              </li>
            )}
            {outOfStock.length > 0 && (
              <li className="flex items-start gap-2 text-pretty">
                <span className="bg-warning mt-1.5 size-1.5 shrink-0 rounded-full" />
                <span>
                  <strong>{outOfStock.length}</strong>{" "}
                  {outOfStock.length === 1 ? "item is" : "items are"} marked out of stock.
                </span>
              </li>
            )}
          </ul>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Latest enquiries</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/inquiries">
              See all {inquiries.length}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-muted-foreground mt-4 rounded-lg border border-dashed px-4 py-8 text-center text-sm">
            No enquiries yet. Adding your full price list is the fastest way to get the first one.
          </p>
        ) : (
          <ul className="mt-4 divide-y">
            {inquiries.slice(0, 4).map((inquiry) => (
              <li key={inquiry.id} className="flex flex-wrap items-start gap-3 py-3 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {inquiry.buyerName}
                    {inquiry.buyerBusiness && (
                      <span className="text-muted-foreground font-normal">
                        {" "}· {inquiry.buyerBusiness}
                      </span>
                    )}
                  </p>
                  <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
                    {inquiry.message}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={inquiry.status === "new" ? "default" : "muted"}>
                    {inquiry.status}
                  </Badge>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {relativeTime(inquiry.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
