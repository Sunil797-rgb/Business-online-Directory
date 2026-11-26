"use server";

import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { slugify } from "./format";
import {
  fieldErrors,
  inquirySchema,
  registrationSchema,
  type ActionResult,
} from "./validation";

export type { ActionResult };

/* ------------------------------------------------------------------ */
/* Buyer enquiry                                                       */
/* ------------------------------------------------------------------ */

export async function submitInquiry(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: fieldErrors(parsed.error),
    };
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

export async function registerBusiness(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = registrationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: fieldErrors(parsed.error),
    };
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
