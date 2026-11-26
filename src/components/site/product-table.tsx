import { Badge } from "@/components/ui/badge";
import { PriceFreshness } from "./price-freshness";
import { npr, unitLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

/** The price list on a supplier's profile. */
export function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-10 text-center text-sm">
        This supplier has not published a price list yet. Call them for current rates.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <caption className="sr-only">Product price list</caption>
        <thead className="bg-muted/60">
          <tr className="text-muted-foreground text-left text-xs">
            <th scope="col" className="px-4 py-2.5 font-medium">Item</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Rate</th>
            <th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">
              Bulk rate
            </th>
            <th scope="col" className="hidden px-4 py-2.5 text-right font-medium md:table-cell">
              Min qty
            </th>
            <th scope="col" className="hidden px-4 py-2.5 text-right font-medium lg:table-cell">
              Updated
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
                {product.description && (
                  <p className="text-muted-foreground mt-0.5 text-xs text-pretty">
                    {product.description}
                  </p>
                )}
                {product.brand && (
                  <p className="text-muted-foreground mt-0.5 text-xs">Brand: {product.brand}</p>
                )}
                {/* Small screens lose the bulk/min columns, so repeat the key facts. */}
                <p className="text-muted-foreground mt-1 text-xs sm:hidden">
                  Min {product.minQuantity} {unitLabel(product.unit)}
                  {product.bulkPrice !== null && product.bulkMinQuantity !== null && (
                    <> · {npr(product.bulkPrice)} from {product.bulkMinQuantity}</>
                  )}
                </p>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <span className="tabular font-semibold">{npr(product.price)}</span>
                <span className="text-muted-foreground block text-xs">
                  per {unitLabel(product.unit)}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-right whitespace-nowrap sm:table-cell">
                {product.bulkPrice !== null && product.bulkMinQuantity !== null ? (
                  <>
                    <span className="tabular text-success font-semibold">
                      {npr(product.bulkPrice)}
                    </span>
                    <span className="text-muted-foreground block text-xs">
                      from {product.bulkMinQuantity} {unitLabel(product.unit)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground" aria-hidden="true">
                      —
                    </span>
                    <span className="sr-only">No bulk rate</span>
                  </>
                )}
              </td>
              <td className="tabular text-muted-foreground hidden px-4 py-3 text-right whitespace-nowrap md:table-cell">
                {product.minQuantity} {unitLabel(product.unit)}
              </td>
              <td className="hidden px-4 py-3 text-right whitespace-nowrap lg:table-cell">
                <PriceFreshness iso={product.priceUpdatedAt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
