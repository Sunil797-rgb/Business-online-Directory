import Link from "next/link";
import { MapPin, Package, Phone, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "./category-icon";
import { RatingStars } from "./rating-stars";
import { VerifiedBadge } from "./verified-badge";
import { getCategory } from "@/lib/categories";
import { getDistrictName } from "@/lib/nepal";
import { npr, pricePerUnit } from "@/lib/format";
import type { SupplierSummary } from "@/lib/types";

export function SupplierCard({ supplier }: { supplier: SupplierSummary }) {
  const primaryCategory = getCategory(supplier.categorySlugs[0]);

  return (
    <Card className="group hover:border-primary/40 relative h-full overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-1 gap-4 p-5 pb-4">
        <div
          className="bg-primary/8 text-primary grid size-12 shrink-0 place-items-center rounded-xl"
          aria-hidden="true"
        >
          <CategoryIcon name={primaryCategory?.icon ?? "Store"} className="size-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-[0.9375rem] font-semibold">
              <Link href={`/suppliers/${supplier.slug}`} className="after:absolute after:inset-0">
                {supplier.businessName}
              </Link>
            </h3>
            {supplier.isVerified && <VerifiedBadge />}
          </div>

          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm text-pretty">
            {supplier.tagline}
          </p>

          <div className="text-muted-foreground mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {supplier.city}, {getDistrictName(supplier.districtSlug)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Package className="size-3.5" />
              {supplier.productCount} items
            </span>
            {supplier.deliveryAvailable && (
              <span className="text-success inline-flex items-center gap-1 font-medium">
                <Truck className="size-3.5" />
                Delivers
              </span>
            )}
          </div>
        </div>
      </div>

      {supplier.sampleProducts.length > 0 && (
        <div className="bg-muted/40 border-t px-5 py-3">
          <ul className="space-y-1">
            {supplier.sampleProducts.map((product) => (
              <li key={product.id} className="flex items-baseline justify-between gap-3 text-xs">
                <span className="text-muted-foreground truncate">{product.name}</span>
                <span className="tabular shrink-0 font-semibold">
                  {pricePerUnit(product.price, product.unit)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t px-5 py-3">
        <RatingStars rating={supplier.ratingAvg} count={supplier.ratingCount} />
        {supplier.minOrderAmount !== null ? (
          <Badge variant="muted" className="font-normal">
            Min order {npr(supplier.minOrderAmount, { compact: true })}
          </Badge>
        ) : (
          <Badge variant="muted" className="font-normal">
            No minimum
          </Badge>
        )}
      </div>

      {/* Sits above the stretched link so the phone number stays clickable. */}
      <a
        href={`tel:+977${supplier.phone.replace(/^0+/, "")}`}
        className="text-muted-foreground hover:text-primary absolute top-4 right-4 z-10 rounded-md p-1.5 transition-colors"
        aria-label={`Call ${supplier.businessName}`}
        title={supplier.phone}
      >
        <Phone className="size-4" />
      </a>
    </Card>
  );
}
