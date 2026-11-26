/**
 * Core domain types for Thok Bazar.
 *
 * These mirror the Postgres schema in `supabase/migrations/0001_schema.sql`
 * so the same shapes flow through the demo seed data and the live Supabase
 * backend.
 */

export type UserRole = "buyer" | "supplier" | "admin";

/** Buyer-side business types — who is doing the buying. */
export type BuyerType =
  | "restaurant"
  | "cafe"
  | "hotel"
  | "bakery"
  | "catering"
  | "retailer"
  | "other";

/** How a supplier accepts payment. */
export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "esewa"
  | "khalti"
  | "fonepay"
  | "cheque"
  | "credit";

/** Units used in Nepali wholesale trade. */
export type Unit =
  | "kg"
  | "gram"
  | "litre"
  | "ml"
  | "piece"
  | "dozen"
  | "crate"
  | "carton"
  | "sack"
  | "bora"
  | "packet"
  | "bottle"
  | "bundle"
  | "tin";

export type InquiryStatus = "new" | "responded" | "quoted" | "closed";

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Devanagari name shown alongside the English one. */
  nameNe: string;
  /** Lucide icon name rendered by `components/site/category-icon.tsx`. */
  icon: string;
  description: string;
  sortOrder: number;
}

export interface OpeningHours {
  /** 0 = Sunday … 6 = Saturday. Nepali week starts Sunday. */
  day: number;
  open: string | null;
  close: string | null;
}

export interface Supplier {
  id: string;
  slug: string;
  ownerId: string | null;

  businessName: string;
  businessNameNe: string | null;
  categorySlugs: string[];
  tagline: string;
  description: string;
  establishedYear: number | null;

  /** Nepali business registration identifiers. */
  panVatNo: string | null;
  registrationNo: string | null;

  logoUrl: string | null;
  coverUrl: string | null;

  phone: string;
  phoneAlt: string | null;
  whatsapp: string | null;
  viber: string | null;
  email: string | null;
  website: string | null;

  addressLine: string;
  landmark: string | null;
  city: string;
  districtSlug: string;
  provinceId: number;

  minOrderAmount: number | null;
  deliveryAvailable: boolean;
  deliveryAreas: string[];
  deliveryNote: string | null;
  leadTimeHours: number | null;

  paymentMethods: PaymentMethod[];
  creditTerms: string | null;
  /** Free-form clauses shown on the "Terms & conditions" tab. */
  terms: SupplierTerm[];

  openingHours: OpeningHours[];

  isVerified: boolean;
  isActive: boolean;
  ratingAvg: number;
  ratingCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface SupplierTerm {
  title: string;
  body: string;
}

export interface Product {
  id: string;
  supplierId: string;
  name: string;
  nameNe: string | null;
  description: string | null;
  categorySlug: string;
  brand: string | null;

  unit: Unit;
  /** Price in NPR for one `unit`. */
  price: number;
  /** Optional discounted price for larger volumes. */
  bulkPrice: number | null;
  /** Quantity at which `bulkPrice` kicks in. */
  bulkMinQuantity: number | null;
  /** Smallest order the supplier will accept for this item. */
  minQuantity: number;

  inStock: boolean;
  imageUrl: string | null;
  /** ISO date the supplier last confirmed this price. */
  priceUpdatedAt: string;
}

export interface Review {
  id: string;
  supplierId: string;
  authorName: string;
  authorBusiness: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  supplierId: string;
  buyerId: string | null;
  buyerName: string;
  buyerBusiness: string | null;
  buyerType: BuyerType;
  phone: string;
  email: string | null;
  message: string;
  /** Line items the buyer wants quoted. */
  items: InquiryItem[];
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiryItem {
  productId: string | null;
  name: string;
  quantity: number;
  unit: Unit;
}

/** Everything a listing card needs, without loading the full product list. */
export interface SupplierSummary
  extends Pick<
    Supplier,
    | "id"
    | "slug"
    | "businessName"
    | "businessNameNe"
    | "tagline"
    | "categorySlugs"
    | "city"
    | "districtSlug"
    | "logoUrl"
    | "coverUrl"
    | "phone"
    | "minOrderAmount"
    | "deliveryAvailable"
    | "isVerified"
    | "ratingAvg"
    | "ratingCount"
    | "paymentMethods"
  > {
  productCount: number;
  /** A few representative products for the card preview. */
  sampleProducts: Pick<Product, "id" | "name" | "price" | "unit">[];
}

/** A product joined to the supplier that sells it — used for price comparison. */
export interface ProductListing extends Product {
  supplier: Pick<
    Supplier,
    | "id"
    | "slug"
    | "businessName"
    | "city"
    | "districtSlug"
    | "isVerified"
    | "deliveryAvailable"
    | "phone"
    | "minOrderAmount"
  >;
}

export interface SupplierFilters {
  query?: string;
  category?: string;
  district?: string;
  province?: number;
  verifiedOnly?: boolean;
  deliveryOnly?: boolean;
  maxMinOrder?: number;
  payment?: PaymentMethod;
  sort?: "rating" | "name" | "newest" | "products";
}

export interface ProductFilters {
  query?: string;
  category?: string;
  district?: string;
  inStockOnly?: boolean;
  sort?: "price_asc" | "price_desc" | "name" | "updated";
}
