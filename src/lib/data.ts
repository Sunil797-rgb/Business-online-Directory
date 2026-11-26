import "server-only";

import { CATEGORIES } from "./categories";
import { selectProducts, selectSuppliers } from "./filters";
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

/* -------------------------------------------------------------------------
 * Public queries
 * ---------------------------------------------------------------------- */

export async function listSuppliers(filters: SupplierFilters = {}): Promise<SupplierSummary[]> {
  const { suppliers, products } = await loadDataset();
  return selectSuppliers(suppliers, products, filters);
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
  return selectProducts(suppliers, products, filters);
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
