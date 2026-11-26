"use client";

import {
  fieldErrors,
  inquirySchema,
  registrationSchema,
  type ActionResult,
} from "./validation";

export type { ActionResult };

/**
 * Client-side stand-ins for the app's Server Actions, for the static preview
 * build only. They run the *same* Zod schemas, so validation messages and
 * success states match the real thing exactly — they simply have nowhere to
 * write to.
 */

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  await pause(350);
  return {
    ok: true,
    message:
      "Enquiry validated. This is a static preview, so nothing was sent — on the real site the supplier would get your number.",
  };
}

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
  await pause(350);
  return {
    ok: true,
    message: `"${parsed.data.businessName}" passed validation. This is a static preview, so no listing was created.`,
  };
}
