"use server";

import { z } from "zod";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { slugify } from "./format";

export interface ActionResult {
  ok: boolean;
  message: string;
  /** Field-level errors keyed by input name. */
  errors?: Record<string, string>;
}

/* ------------------------------------------------------------------ */
/* Buyer enquiry                                                       */
/* ------------------------------------------------------------------ */

/** Nepali mobile numbers are 10 digits starting 97/98; landlines are 7–9 with an STD code. */
const nepaliPhone = z
  .string()
  .trim()
  .min(7, "Enter a phone number so the supplier can reach you")
  .regex(/^[\d\s+()-]{7,20}$/, "Use digits only, e.g. 9801234567");

const inquirySchema = z.object({
  supplierId: z.string().min(1),
  supplierSlug: z.string().min(1),
  buyerName: z.string().trim().min(2, "Enter your name"),
  buyerBusiness: z.string().trim().max(120).optional().or(z.literal("")),
  buyerType: z.enum(["restaurant", "cafe", "hotel", "bakery", "catering", "retailer", "other"]),
  phone: nepaliPhone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell the supplier what you need — quantities help them quote")
    .max(2000, "Please keep the message under 2000 characters"),
});

export async function submitInquiry(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  const input = parsed.data;

  if (!isSupabaseConfigured()) {
    // Demo mode: validate and acknowledge, but persist nothing.
    return {
      ok: true,
      message:
        "Enquiry validated. This demo does not store messages — connect Supabase to deliver it to the supplier.",
    };
  }

  try {
    const supabase = await createClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data: auth } = await supabase.auth.getUser();

    const { error } = await supabase.from("inquiries").insert({
      supplier_id: input.supplierId,
      buyer_id: auth.user?.id ?? null,
      buyer_name: input.buyerName,
      buyer_business: input.buyerBusiness || null,
      buyer_type: input.buyerType,
      phone: input.phone,
      email: input.email || null,
      message: input.message,
      items: [],
      status: "new",
    });

    if (error) throw error;

    return {
      ok: true,
      message: "Enquiry sent. The supplier can see your number and will usually call back same day.",
    };
  } catch (error) {
    console.error("[thokbazar] Failed to save inquiry:", error);
    return {
      ok: false,
      message: "Could not send the enquiry just now. Please call the supplier directly instead.",
    };
  }
}

/* ------------------------------------------------------------------ */
/* Supplier registration                                               */
/* ------------------------------------------------------------------ */

const registrationSchema = z.object({
  businessName: z.string().trim().min(3, "Enter your registered business name"),
  businessNameNe: z.string().trim().max(120).optional().or(z.literal("")),
  categorySlug: z.string().min(1, "Choose the category that fits your trade"),
  tagline: z
    .string()
    .trim()
    .min(10, "One line on what you supply")
    .max(140, "Keep the tagline under 140 characters"),
  description: z
    .string()
    .trim()
    .min(40, "Tell buyers a bit more — what you stock, how you deliver")
    .max(3000),
  contactName: z.string().trim().min(2, "Enter the contact person's name"),
  phone: nepaliPhone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  panVatNo: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "A Nepali PAN/VAT number is 9 digits")
    .optional()
    .or(z.literal("")),
  districtSlug: z.string().min(1, "Choose your district"),
  city: z.string().trim().min(2, "Enter your city or municipality"),
  addressLine: z.string().trim().min(4, "Enter your street or market address"),
  minOrderAmount: z.string().trim().optional().or(z.literal("")),
  deliveryAvailable: z.string().optional(),
});

export async function registerBusiness(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = registrationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  const input = parsed.data;

  if (!isSupabaseConfigured()) {
    return {
      ok: true,
      message: `Thanks — "${input.businessName}" passed validation. This demo does not save listings; connect Supabase to publish for real.`,
    };
  }

  try {
    const supabase = await createClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return {
        ok: false,
        message: "Please log in or create an account before listing your business.",
      };
    }

    const minOrder = input.minOrderAmount ? Number(input.minOrderAmount) : null;

    const { error } = await supabase.from("suppliers").insert({
      owner_id: auth.user.id,
      slug: `${slugify(input.businessName)}-${Date.now().toString(36)}`,
      business_name: input.businessName,
      business_name_ne: input.businessNameNe || null,
      category_slugs: [input.categorySlug],
      tagline: input.tagline,
      description: input.description,
      pan_vat_no: input.panVatNo || null,
      phone: input.phone,
      email: input.email || null,
      address_line: input.addressLine,
      city: input.city,
      district_slug: input.districtSlug,
      // Province is derived from the district by a trigger in the schema.
      min_order_amount: Number.isFinite(minOrder) ? minOrder : null,
      delivery_available: input.deliveryAvailable === "on",
      is_active: true,
      is_verified: false,
    });

    if (error) throw error;

    return {
      ok: true,
      message:
        "Listing created. It is live now; our team will review your PAN/VAT details for the verified badge within two working days.",
    };
  } catch (error) {
    console.error("[thokbazar] Failed to register business:", error);
    return { ok: false, message: "Could not save your listing. Please try again." };
  }
}
