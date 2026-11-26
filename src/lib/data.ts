import "server-only";

import { CATEGORIES } from "./categories";
import { matchesTerms, parseQuery } from "./search";
import { SEED_PRODUCTS } from "./seed/products";
import { SEED_REVIEWS } from "./seed/reviews";
import { SEED_SUPPLIERS } from "./seed/suppliers";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import {
  mapProductRow,
  mapSupplierRow,
  type ProductRow,
  type SupplierRow,
} from "./supabase/mappers";
import type {
  Inquiry,
  Product,
  ProductFilters,
  ProductListing,
  Review,
  Supplier,
  SupplierFilters,
  SupplierSummary,
} from "./types";

export interface SupplierDetail extends Supplier {
  products: Product[];
  reviews: Review[];
}

export interface DirectoryStats {
  supplierCount: number;
  productCount: number;
  categoryCount: number;
  districtCount: number;
  verifiedCount: number;
}

/* -------------------------------------------------------------------------
 * Shared filtering — applied in memory so demo mode and live mode agree on
 * the exact semantics of a search.
 * ---------------------------------------------------------------------- */

function matchesSupplier(
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

function sortSuppliers(
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

function toSummary(supplier: Supplier, products: Product[]): SupplierSummary {
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

/* -------------------------------------------------------------------------
 * Loading — one of two sources depending on configuration.
 * ---------------------------------------------------------------------- */

interface Dataset {
  suppliers: Supplier[];
  products: Product[];
  reviews: Review[];
}

/**
 * Load the working set.
 *
 * In live mode this pulls active suppliers and their products from Supabase.
 * If that call fails for any reason we fall back to the seed data rather than
 * showing an empty directory, and log the error server-side.
 */
async function loadDataset(): Promise<Dataset> {
  if (!isSupabaseConfigured()) {
    return { suppliers: SEED_SUPPLIERS, products: SEED_PRODUCTS, reviews: SEED_REVIEWS };
  }

  try {
    const supabase = await createClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const [suppliersRes, productsRes, reviewsRes] = await Promise.all([
      supabase.from("suppliers").select("*").eq("is_active", true),
      supabase.from("products").select("*"),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
    ]);

    if (suppliersRes.error) throw suppliersRes.error;
    if (productsRes.error) throw productsRes.error;

    return {
      suppliers: (suppliersRes.data as SupplierRow[]).map(mapSupplierRow),
      products: (productsRes.data as ProductRow[]).map(mapProductRow),
      reviews: (reviewsRes.data ?? []) as Review[],
    };
  } catch (error) {
    console.error("[thokbazar] Supabase read failed, falling back to seed data:", error);
    return { suppliers: SEED_SUPPLIERS, products: SEED_PRODUCTS, reviews: SEED_REVIEWS };
  }
}

function groupProducts(products: Product[]): Map<string, Product[]> {
  const map = new Map<string, Product[]>();
  for (const product of products) {
    const list = map.get(product.supplierId);
    if (list) list.push(product);
    else map.set(product.supplierId, [product]);
  }
  return map;
}

/* -------------------------------------------------------------------------
 * Public queries
 * ---------------------------------------------------------------------- */

export async function listSuppliers(filters: SupplierFilters = {}): Promise<SupplierSummary[]> {
  const { suppliers, products } = await loadDataset();
  const bySupplier = groupProducts(products);

  const matched = suppliers
    .map((supplier) => ({
      supplier,
      products: bySupplier.get(supplier.id) ?? [],
    }))
    .filter(({ supplier, products: own }) => matchesSupplier(supplier, own, filters));

  return sortSuppliers(
    matched.map(({ supplier, products: own }) => ({ supplier, productCount: own.length })),
    filters.sort,
  ).map(({ supplier }) => toSummary(supplier, bySupplier.get(supplier.id) ?? []));
}

export async function getSupplierBySlug(slug: string): Promise<SupplierDetail | null> {
  const { suppliers, products, reviews } = await loadDataset();
  const supplier = suppliers.find((s) => s.slug === slug);
  if (!supplier) return null;

  return {
    ...supplier,
    products: products
      .filter((p) => p.supplierId === supplier.id)
      .sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.name.localeCompare(b.name)),
    reviews: reviews
      .filter((r) => r.supplierId === supplier.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  };
}

export async function listSupplierSlugs(): Promise<string[]> {
  const { suppliers } = await loadDataset();
  return suppliers.map((s) => s.slug);
}

/** Product rows joined to their supplier — powers the price comparison page. */
export async function listProducts(filters: ProductFilters = {}): Promise<ProductListing[]> {
  const { suppliers, products } = await loadDataset();
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

/** How many active suppliers sit in each category. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { suppliers } = await loadDataset();
  const counts: Record<string, number> = {};
  for (const category of CATEGORIES) counts[category.slug] = 0;
  for (const supplier of suppliers) {
    if (!supplier.isActive) continue;
    for (const slug of supplier.categorySlugs) {
      counts[slug] = (counts[slug] ?? 0) + 1;
    }
  }
  return counts;
}

/** Districts that actually have suppliers, most first. */
export async function getDistrictCounts(): Promise<{ slug: string; count: number }[]> {
  const { suppliers } = await loadDataset();
  const counts = new Map<string, number>();
  for (const supplier of suppliers) {
    if (!supplier.isActive) continue;
    counts.set(supplier.districtSlug, (counts.get(supplier.districtSlug) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export async function getStats(): Promise<DirectoryStats> {
  const { suppliers, products } = await loadDataset();
  const active = suppliers.filter((s) => s.isActive);
  return {
    supplierCount: active.length,
    productCount: products.length,
    categoryCount: CATEGORIES.length,
    districtCount: new Set(active.map((s) => s.districtSlug)).size,
    verifiedCount: active.filter((s) => s.isVerified).length,
  };
}

export async function getFeaturedSuppliers(limit = 6): Promise<SupplierSummary[]> {
  const all = await listSuppliers({ sort: "rating" });
  return all.slice(0, limit);
}

/** Suppliers in the same category, excluding the one being viewed. */
export async function getRelatedSuppliers(
  supplier: Pick<Supplier, "id" | "categorySlugs">,
  limit = 3,
): Promise<SupplierSummary[]> {
  const results: SupplierSummary[] = [];
  const seen = new Set<string>([supplier.id]);

  for (const category of supplier.categorySlugs) {
    const inCategory = await listSuppliers({ category, sort: "rating" });
    for (const candidate of inCategory) {
      if (seen.has(candidate.id)) continue;
      seen.add(candidate.id);
      results.push(candidate);
      if (results.length >= limit) return results;
    }
  }
  return results;
}

/** Inquiries received by a supplier — used by the supplier dashboard. */
export async function listInquiries(supplierId: string): Promise<Inquiry[]> {
  if (!isSupabaseConfigured()) {
    const { SEED_INQUIRIES } = await import("./seed/inquiries");
    return SEED_INQUIRIES.filter((i) => i.supplierId === supplierId);
  }

  try {
    const supabase = await createClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("supplier_id", supplierId)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const { mapInquiryRow } = await import("./supabase/mappers");
    return (data ?? []).map(mapInquiryRow);
  } catch (error) {
    console.error("[thokbazar] Failed to load inquiries:", error);
    return [];
  }
}

/**
 * The supplier the dashboard should show.
 *
 * In live mode that is the listing owned by the signed-in user. In demo mode
 * we hand back a representative listing so the dashboard is explorable
 * without an account.
 */
export async function getDashboardSupplier(): Promise<SupplierDetail | null> {
  if (!isSupabaseConfigured()) {
    return getSupplierBySlug("sunrise-poultry-farm-hatchery");
  }

  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return null;

    const { data, error } = await supabase
      .from("suppliers")
      .select("slug")
      .eq("owner_id", auth.user.id)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return getSupplierBySlug(data.slug as string);
  } catch (error) {
    console.error("[thokbazar] Failed to resolve dashboard supplier:", error);
    return null;
  }
}
