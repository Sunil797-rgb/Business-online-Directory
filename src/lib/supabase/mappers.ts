import type {
  Inquiry,
  InquiryItem,
  InquiryStatus,
  OpeningHours,
  PaymentMethod,
  Product,
  Supplier,
  SupplierTerm,
  Unit,
} from "../types";

/**
 * Row shapes as they come back from Postgres (snake_case) and the mapping to
 * the camelCase domain types the UI uses. Keeping the translation in one file
 * means a schema change only has to be reflected here.
 */

export interface SupplierRow {
  id: string;
  slug: string;
  owner_id: string | null;
  business_name: string;
  business_name_ne: string | null;
  category_slugs: string[] | null;
  tagline: string | null;
  description: string | null;
  established_year: number | null;
  pan_vat_no: string | null;
  registration_no: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string;
  phone_alt: string | null;
  whatsapp: string | null;
  viber: string | null;
  email: string | null;
  website: string | null;
  address_line: string | null;
  landmark: string | null;
  city: string | null;
  district_slug: string;
  province_id: number;
  min_order_amount: number | null;
  delivery_available: boolean | null;
  delivery_areas: string[] | null;
  delivery_note: string | null;
  lead_time_hours: number | null;
  payment_methods: string[] | null;
  credit_terms: string | null;
  terms: SupplierTerm[] | null;
  opening_hours: OpeningHours[] | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  rating_avg: number | null;
  rating_count: number | null;
  created_at: string;
  updated_at: string;
}

export function mapSupplierRow(row: SupplierRow): Supplier {
  return {
    id: row.id,
    slug: row.slug,
    ownerId: row.owner_id,
    businessName: row.business_name,
    businessNameNe: row.business_name_ne,
    categorySlugs: row.category_slugs ?? [],
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    establishedYear: row.established_year,
    panVatNo: row.pan_vat_no,
    registrationNo: row.registration_no,
    logoUrl: row.logo_url,
    coverUrl: row.cover_url,
    phone: row.phone,
    phoneAlt: row.phone_alt,
    whatsapp: row.whatsapp,
    viber: row.viber,
    email: row.email,
    website: row.website,
    addressLine: row.address_line ?? "",
    landmark: row.landmark,
    city: row.city ?? "",
    districtSlug: row.district_slug,
    provinceId: row.province_id,
    minOrderAmount: row.min_order_amount,
    deliveryAvailable: row.delivery_available ?? false,
    deliveryAreas: row.delivery_areas ?? [],
    deliveryNote: row.delivery_note,
    leadTimeHours: row.lead_time_hours,
    paymentMethods: (row.payment_methods ?? []) as PaymentMethod[],
    creditTerms: row.credit_terms,
    terms: row.terms ?? [],
    openingHours: row.opening_hours ?? [],
    isVerified: row.is_verified ?? false,
    isActive: row.is_active ?? true,
    ratingAvg: Number(row.rating_avg ?? 0),
    ratingCount: row.rating_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface ProductRow {
  id: string;
  supplier_id: string;
  name: string;
  name_ne: string | null;
  description: string | null;
  category_slug: string;
  brand: string | null;
  unit: string;
  price: number | string;
  bulk_price: number | string | null;
  bulk_min_quantity: number | null;
  min_quantity: number | null;
  in_stock: boolean | null;
  image_url: string | null;
  price_updated_at: string;
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    supplierId: row.supplier_id,
    name: row.name,
    nameNe: row.name_ne,
    description: row.description,
    categorySlug: row.category_slug,
    brand: row.brand,
    unit: row.unit as Unit,
    price: Number(row.price),
    bulkPrice: row.bulk_price === null ? null : Number(row.bulk_price),
    bulkMinQuantity: row.bulk_min_quantity,
    minQuantity: row.min_quantity ?? 1,
    inStock: row.in_stock ?? true,
    imageUrl: row.image_url,
    priceUpdatedAt: row.price_updated_at,
  };
}

export interface InquiryRow {
  id: string;
  supplier_id: string;
  buyer_id: string | null;
  buyer_name: string;
  buyer_business: string | null;
  buyer_type: string;
  phone: string;
  email: string | null;
  message: string;
  items: InquiryItem[] | null;
  status: string;
  created_at: string;
}

export function mapInquiryRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    supplierId: row.supplier_id,
    buyerId: row.buyer_id,
    buyerName: row.buyer_name,
    buyerBusiness: row.buyer_business,
    buyerType: row.buyer_type as Inquiry["buyerType"],
    phone: row.phone,
    email: row.email,
    message: row.message,
    items: row.items ?? [],
    status: row.status as InquiryStatus,
    createdAt: row.created_at,
  };
}
