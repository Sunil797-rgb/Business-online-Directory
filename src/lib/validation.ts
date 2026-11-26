import { z } from "zod";

/**
 * Form schemas, kept separate from the Server Actions that use them so the
 * same rules can be imported by a client bundle (the static preview build)
 * without dragging in `next/headers`.
 */

/** Nepali mobiles are 10 digits starting 97/98; landlines are 7–9 with an STD code. */
export const nepaliPhone = z
  .string()
  .trim()
  .min(7, "Enter a phone number so the supplier can reach you")
  .regex(/^[\d\s+()-]{7,20}$/, "Use digits only, e.g. 9801234567");

export const inquirySchema = z.object({
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

export const registrationSchema = z.object({
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

export interface ActionResult {
  ok: boolean;
  message: string;
  /** Field-level errors keyed by input name. */
  errors?: Record<string, string>;
}

/** Turn a Zod failure into the per-field map the forms render. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
