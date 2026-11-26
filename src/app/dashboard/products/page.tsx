import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductTable } from "@/components/site/product-table";
import { EmptyState } from "@/components/site/empty-state";
import { getDashboardSupplier } from "@/lib/data";
import { priceFreshness } from "@/lib/format";
import { DATA_MODE } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Price list",
  robots: { index: false, follow: false },
};

export default async function DashboardProductsPage() {
  const supplier = await getDashboardSupplier();

  if (!supplier) {
    return (
      <EmptyState
        title="No listing yet"
        description="Create your supplier listing before adding products."
        action={
          <Button asChild>
            <Link href="/register-business">List your business</Link>
          </Button>
        }
      />
    );
  }

  const counts = {
    fresh: supplier.products.filter((p) => priceFreshness(p.priceUpdatedAt) === "fresh").length,
    recent: supplier.products.filter((p) => priceFreshness(p.priceUpdatedAt) === "recent").length,
    stale: supplier.products.filter((p) => priceFreshness(p.priceUpdatedAt) === "stale").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Your price list</h2>
          <p className="text-muted-foreground mt-1 text-sm text-pretty">
            Buyers compare these rates against every other supplier. Keeping them current is the
            single biggest thing you can do for your listing.
          </p>
        </div>
        <Button disabled={DATA_MODE === "demo"} title={DATA_MODE === "demo" ? "Connect Supabase to edit products" : undefined}>
          <Plus className="size-4" />
          Add product
        </Button>
      </div>

      <dl className="grid grid-cols-3 gap-4">
        {[
          { label: "Confirmed this week", value: counts.fresh, dot: "bg-success" },
          { label: "Confirmed this month", value: counts.recent, dot: "bg-warning" },
          { label: "Over a month old", value: counts.stale, dot: "bg-destructive" },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <dt className="text-muted-foreground flex items-center gap-2 text-xs text-pretty">
              <span className={`size-2 shrink-0 rounded-full ${item.dot}`} aria-hidden="true" />
              {item.label}
            </dt>
            <dd className="tabular mt-1.5 text-2xl font-bold">{item.value}</dd>
          </Card>
        ))}
      </dl>

      <ProductTable products={supplier.products} />

      {DATA_MODE === "demo" && (
        <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-3 text-xs text-pretty">
          This is a read-only sample. Connect a Supabase project to add, edit and reprice your own
          products — the schema and row-level security policies are in{" "}
          <code className="bg-muted rounded px-1 font-mono">supabase/migrations</code>.
        </p>
      )}
    </div>
  );
}
