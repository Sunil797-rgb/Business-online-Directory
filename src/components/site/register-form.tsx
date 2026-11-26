"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CATEGORIES } from "@/lib/categories";
import { DISTRICTS_BY_PROMINENCE } from "@/lib/nepal";
import { registerBusiness, type ActionResult } from "@/lib/actions";
import { useFormValues } from "@/lib/use-form-values";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-destructive flex items-center gap-1 text-xs" role="alert">
      <AlertCircle className="size-3 shrink-0" />
      {message}
    </p>
  );
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <span className="bg-primary text-primary-foreground grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold">
          {step}
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-0.5 text-sm text-pretty">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      <Store className="size-4" />
      {pending ? "Publishing…" : "Publish my listing"}
    </Button>
  );
}

export function RegisterBusinessForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    registerBusiness,
    null,
  );
  // Controlled so a validation error does not wipe a four-section form.
  const { bind, bindSelect } = useFormValues({
    businessName: "",
    businessNameNe: "",
    categorySlug: "",
    tagline: "",
    description: "",
    contactName: "",
    phone: "",
    email: "",
    panVatNo: "",
    districtSlug: "",
    city: "",
    addressLine: "",
    minOrderAmount: "",
  });

  if (state?.ok) {
    return (
      <Card className="border-success/30 bg-success/5 flex flex-col items-center px-6 py-14 text-center">
        <CheckCircle2 className="text-success size-12" />
        <h2 className="mt-4 text-xl font-bold">Listing submitted</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-pretty">{state.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/suppliers">Browse the directory</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state && !state.ok && (
        <p
          className="border-destructive/30 bg-destructive/8 text-destructive flex items-start gap-2 rounded-lg border px-4 py-3 text-sm"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      )}

      <Section
        step={1}
        title="Your business"
        description="How buyers will see you in search results."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="businessName">Business name *</Label>
            <Input
              id="businessName"
              {...bind("businessName")}
              required
              placeholder="Sunrise Poultry Farm"
              aria-invalid={Boolean(state?.errors?.businessName)}
            />
            <FieldError message={state?.errors?.businessName} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="businessNameNe">Name in Nepali</Label>
            <Input
              id="businessNameNe"
              {...bind("businessNameNe")}
              placeholder="सनराइज कुखुरा फार्म"
              className="font-devanagari"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="categorySlug">What do you supply? *</Label>
          <Select {...bindSelect("categorySlug")}>
            <SelectTrigger id="categorySlug" className="w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {CATEGORIES.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={state?.errors?.categorySlug} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tagline">One-line summary *</Label>
          <Input
            id="tagline"
            {...bind("tagline")}
            required
            maxLength={140}
            placeholder="Broiler, layer and eggs — farm to kitchen, cold chain maintained"
            aria-invalid={Boolean(state?.errors?.tagline)}
          />
          <FieldError message={state?.errors?.tagline} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">About your business *</Label>
          <Textarea
            id="description"
            {...bind("description")}
            required
            rows={5}
            placeholder="What you stock, how you source it, how you deliver, and who you usually supply. Buyers read this before they call."
            aria-invalid={Boolean(state?.errors?.description)}
          />
          <FieldError message={state?.errors?.description} />
        </div>
      </Section>

      <Section
        step={2}
        title="How buyers reach you"
        description="A phone number is the one thing every buyer will use."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contactName">Contact person *</Label>
            <Input
              id="contactName"
              {...bind("contactName")}
              required
              autoComplete="name"
              placeholder="Ram Bahadur Thapa"
              aria-invalid={Boolean(state?.errors?.contactName)}
            />
            <FieldError message={state?.errors?.contactName} />
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...bind("email")} type="email" autoComplete="email" placeholder="orders@yourbusiness.com" />
            <FieldError message={state?.errors?.email} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="panVatNo">PAN / VAT number</Label>
            <Input
              id="panVatNo"
              {...bind("panVatNo")}
              inputMode="numeric"
              maxLength={9}
              placeholder="301847562"
              aria-invalid={Boolean(state?.errors?.panVatNo)}
            />
            <FieldError message={state?.errors?.panVatNo} />
            <p className="text-muted-foreground text-xs">
              Needed for the verified badge. Nine digits, from your PAN certificate.
            </p>
          </div>
        </div>
      </Section>

      <Section
        step={3}
        title="Where you are"
        description="Buyers filter by district first, so this decides who finds you."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="districtSlug">District *</Label>
            <Select {...bindSelect("districtSlug")}>
              <SelectTrigger id="districtSlug" className="w-full">
                <SelectValue placeholder="Choose your district" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {DISTRICTS_BY_PROMINENCE.map((district) => (
                  <SelectItem key={district.slug} value={district.slug}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={state?.errors?.districtSlug} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City / municipality *</Label>
            <Input
              id="city"
              {...bind("city")}
              required
              placeholder="Bharatpur"
              aria-invalid={Boolean(state?.errors?.city)}
            />
            <FieldError message={state?.errors?.city} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="addressLine">Street address *</Label>
          <Input
            id="addressLine"
            {...bind("addressLine")}
            required
            placeholder="Ward 11, near the Narayangadh bypass"
            aria-invalid={Boolean(state?.errors?.addressLine)}
          />
          <FieldError message={state?.errors?.addressLine} />
        </div>
      </Section>

      <Section
        step={4}
        title="Trading terms"
        description="You can add your full price list and written terms from the dashboard afterwards."
      >
        <div className="space-y-1.5">
          <Label htmlFor="minOrderAmount">Minimum order (NPR)</Label>
          <Input
            id="minOrderAmount"
            {...bind("minOrderAmount")}
            type="number"
            min={0}
            step={500}
            placeholder="10000"
            className="sm:max-w-xs"
          />
          <p className="text-muted-foreground text-xs">Leave blank if you have no minimum.</p>
        </div>

        <div className="flex items-start gap-2.5">
          <Checkbox id="deliveryAvailable" name="deliveryAvailable" defaultChecked />
          <div>
            <Label htmlFor="deliveryAvailable" className="font-normal">
              I deliver to buyers
            </Label>
            <p className="text-muted-foreground text-xs">
              Delivery is the single biggest filter buyers use.
            </p>
          </div>
        </div>
      </Section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton />
        <p className="text-muted-foreground text-xs text-pretty">
          Free to list. By publishing you confirm the details are accurate and that you are
          authorised to represent this business.
        </p>
      </div>
    </form>
  );
}
