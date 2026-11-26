"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitInquiry, type ActionResult } from "@/lib/actions";
import { useFormValues } from "@/lib/use-form-values";
import { cn } from "@/lib/utils";

const BUYER_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "hotel", label: "Hotel / lodge" },
  { value: "bakery", label: "Bakery" },
  { value: "catering", label: "Catering / events" },
  { value: "retailer", label: "Shop / retailer" },
  { value: "other", label: "Other" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      <Send className="size-4" />
      {pending ? "Sending…" : "Send enquiry"}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-destructive flex items-center gap-1 text-xs" role="alert">
      <AlertCircle className="size-3 shrink-0" />
      {message}
    </p>
  );
}

/**
 * Request-for-quote form. Everything the supplier needs to call back is on
 * one screen — no account required, because most buyers will not make one.
 */
export function InquiryForm({
  supplierId,
  supplierSlug,
  supplierName,
}: {
  supplierId: string;
  supplierSlug: string;
  supplierName: string;
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(submitInquiry, null);
  const { bind, bindSelect } = useFormValues({
    buyerName: "",
    phone: "",
    buyerBusiness: "",
    buyerType: "restaurant",
    email: "",
    message: "",
  });

  if (state?.ok) {
    return (
      <div className="border-success/30 bg-success/8 flex flex-col items-center rounded-xl border px-5 py-10 text-center">
        <CheckCircle2 className="text-success size-10" />
        <p className="mt-3 font-semibold">Enquiry sent to {supplierName}</p>
        <p className="text-muted-foreground mt-1.5 max-w-sm text-sm text-pretty">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="supplierId" value={supplierId} />
      <input type="hidden" name="supplierSlug" value={supplierSlug} />

      {state && !state.ok && (
        <p
          className="border-destructive/30 bg-destructive/8 text-destructive flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="buyerName">Your name *</Label>
          <Input
            id="buyerName"
            {...bind("buyerName")}
            required
            autoComplete="name"
            placeholder="Sita Shrestha"
            aria-invalid={Boolean(state?.errors?.buyerName)}
          />
          <FieldError message={state?.errors?.buyerName} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            {...bind("phone")}
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="9801234567"
            aria-invalid={Boolean(state?.errors?.phone)}
          />
          <FieldError message={state?.errors?.phone} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="buyerBusiness">Your business</Label>
          <Input
            id="buyerBusiness"
            {...bind("buyerBusiness")}
            placeholder="Momo Ghar, Jhamsikhel"
            autoComplete="organization"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="buyerType">Business type</Label>
          <Select {...bindSelect("buyerType")}>
            <SelectTrigger id="buyerType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUYER_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email (optional)</Label>
        <Input
          id="email"
          {...bind("email")}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(state?.errors?.email)}
        />
        <FieldError message={state?.errors?.email} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">What do you need? *</Label>
        <Textarea
          id="message"
          {...bind("message")}
          required
          rows={5}
          placeholder="e.g. 60 kg dressed chicken twice a week, delivered to Jhamsikhel before 7 AM. Do you offer 15-day credit?"
          aria-invalid={Boolean(state?.errors?.message)}
          className={cn(state?.errors?.message && "border-destructive")}
        />
        <FieldError message={state?.errors?.message} />
        <p className="text-muted-foreground text-xs">
          Include quantity, how often, and where you need it delivered — suppliers quote much faster
          when they can see the whole picture.
        </p>
      </div>

      <SubmitButton />

      <p className="text-muted-foreground text-center text-xs text-pretty">
        Your name and phone number are shared with {supplierName} only. Thok Bazar is not a party to
        the trade.
      </p>
    </form>
  );
}
