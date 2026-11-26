import { matchesTerms, parseQuery } from "./search";
import type {
  Product,
  ProductFilters,
  ProductListing,
  Supplier,
  SupplierFilters,
  SupplierSummary,
} from "./types";

/**
 * Pure filtering and sorting over in-memory supplier and product arrays.
 *
 * Kept free of any Node, Next or Supabase import so the exact same semantics
 * can run on the server (`lib/data.ts`) and in a browser bundle (the static
 * preview build). If search behaviour ever differs between the two, it is a
 * bug here, not two implementations drifting apart.
 */

export function matchesSupplier(
  supplier: Supplier,
  products: Product[],
  filters: SupplierFilters,
): boolean {
  if (!supplier.isActive) return false;

  if (filters.category && !supplier.categorySlugs.includes(filters.category)) return false;
  if (filters.district && supplier.districtSlug !== filters.district) return false;
  if (filters.province !== undefined && supplier.provinceId !== filters.province) return false;
  if (filters.verifiedOnly && !supplier.isVerified) return false;
  if (filters.deliveryOnly && !supplier.deliveryAvailable) return false;
  if (filters.payment && !supplier.paymentMethods.includes(filters.payment)) return false;

  if (filters.maxMinOrder !== undefined) {
    // A supplier with no stated minimum always qualifies.
    if (supplier.minOrderAmount !== null && supplier.minOrderAmount > filters.maxMinOrder) {
      return false;
    }
  }

  if (filters.query) {
    const haystack = [
      supplier.businessName,
      supplier.businessNameNe ?? "",
      supplier.tagline,
      supplier.description,
      supplier.city,
      supplier.districtSlug.replace(/-/g, " "),
      ...supplier.categorySlugs.map((slug) => slug.replace(/-/g, " ")),
      ...supplier.deliveryAreas,
      // Searching for "momo wrapper" should find the supplier that sells it.
      ...products.map((p) => `${p.name} ${p.nameNe ?? ""} ${p.brand ?? ""}`),
    ].join(" ");

    if (!matchesTerms(haystack, parseQuery(filters.query))) return false;
  }

  return true;
}

export function sortSuppliers(
  rows: { supplier: Supplier; productCount: number }[],
  sort: SupplierFilters["sort"],
) {
  const sorted = [...rows];
  switch (sort) {
    case "name":
      sorted.sort((a, b) => a.supplier.businessName.localeCompare(b.supplier.businessName));
      break;
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.supplier.createdAt).getTime() - new Date(a.supplier.createdAt).getTime(),
      );
      break;
    case "products":
      sorted.sort((a, b) => b.productCount - a.productCount);
      break;
    case "rating":
    default:
      // Verified listings first, then rating, then review volume.
      sorted.sort((a, b) => {
        if (a.supplier.isVerified !== b.supplier.isVerified) {
          return a.supplier.isVerified ? -1 : 1;
        }
        if (b.supplier.ratingAvg !== a.supplier.ratingAvg) {
          return b.supplier.ratingAvg - a.supplier.ratingAvg;
        }
        return b.supplier.ratingCount - a.supplier.ratingCount;
      });
  }
  return sorted;
}

export function toSummary(supplier: Supplier, products: Product[]): SupplierSummary {
  return {
    id: supplier.id,
    slug: supplier.slug,
    businessName: supplier.businessName,
    businessNameNe: supplier.businessNameNe,
    tagline: supplier.tagline,
    categorySlugs: supplier.categorySlugs,
    city: supplier.city,
    districtSlug: supplier.districtSlug,
    logoUrl: supplier.logoUrl,
    coverUrl: supplier.coverUrl,
    phone: supplier.phone,
    minOrderAmount: supplier.minOrderAmount,
    deliveryAvailable: supplier.deliveryAvailable,
    isVerified: supplier.isVerified,
    ratingAvg: supplier.ratingAvg,
    ratingCount: supplier.ratingCount,
    paymentMethods: supplier.paymentMethods,
    productCount: products.length,
    sampleProducts: products.slice(0, 3).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      unit: p.unit,
    })),
  };
}

export function groupProductsBySupplier(products: Product[]): Map<string, Product[]> {
  const map = new Map<string, Product[]>();
  for (const product of products) {
    const list = map.get(product.supplierId);
    if (list) list.push(product);
    else map.set(product.supplierId, [product]);
  }
  return map;
}

/** Filter + sort suppliers down to the card summaries a listing page renders. */
export function selectSuppliers(
  suppliers: Supplier[],
  products: Product[],
  filters: SupplierFilters = {},
): SupplierSummary[] {
  const bySupplier = groupProductsBySupplier(products);

  const matched = suppliers
    .map((supplier) => ({ supplier, products: bySupplier.get(supplier.id) ?? [] }))
    .filter(({ supplier, products: own }) => matchesSupplier(supplier, own, filters));

  return sortSuppliers(
    matched.map(({ supplier, products: own }) => ({ supplier, productCount: own.length })),
    filters.sort,
  ).map(({ supplier }) => toSummary(supplier, bySupplier.get(supplier.id) ?? []));
}

/** Product rows joined to their supplier — powers the price comparison page. */
export function selectProducts(
  suppliers: Supplier[],
  products: Product[],
  filters: ProductFilters = {},
): ProductListing[] {
  const supplierById = new Map(suppliers.map((s) => [s.id, s]));

  let listings: ProductListing[] = products.flatMap((product) => {
    const supplier = supplierById.get(product.supplierId);
    if (!supplier || !supplier.isActive) return [];
    return [
      {
        ...product,
        supplier: {
          id: supplier.id,
          slug: supplier.slug,
          businessName: supplier.businessName,
          city: supplier.city,
          districtSlug: supplier.districtSlug,
          isVerified: supplier.isVerified,
          deliveryAvailable: supplier.deliveryAvailable,
          phone: supplier.phone,
          minOrderAmount: supplier.minOrderAmount,
        },
      },
    ];
  });

  if (filters.category) {
    listings = listings.filter((l) => l.categorySlug === filters.category);
  }
  if (filters.district) {
    listings = listings.filter((l) => l.supplier.districtSlug === filters.district);
  }
  if (filters.inStockOnly) {
    listings = listings.filter((l) => l.inStock);
  }
  if (filters.query) {
    const terms = parseQuery(filters.query);
    listings = listings.filter((l) =>
      // Deliberately product fields only. Including the supplier's business
      // name would make a search for "rice" return every item sold by
      // "Everest Rice Mill" — dal included — which defeats the point of a
      // price comparison. Searching by supplier belongs on /suppliers.
      matchesTerms(`${l.name} ${l.nameNe ?? ""} ${l.brand ?? ""}`, terms),
    );
  }

  switch (filters.sort) {
    case "price_desc":
      listings.sort((a, b) => b.price - a.price);
      break;
    case "name":
      listings.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "updated":
      listings.sort(
        (a, b) => new Date(b.priceUpdatedAt).getTime() - new Date(a.priceUpdatedAt).getTime(),
      );
      break;
    case "price_asc":
    default:
      listings.sort((a, b) => a.price - b.price);
  }

  return listings;
}
