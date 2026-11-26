import { Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { telHref, viberHref, whatsappHref } from "@/lib/format";
import type { Supplier } from "@/lib/types";

/**
 * Phone first, always. Most wholesale deals in Nepal still close on a call or
 * a Viber message, so the directory's job is to shorten the path to one.
 */
export function ContactButtons({
  supplier,
  layout = "stack",
}: {
  supplier: Pick<Supplier, "businessName" | "phone" | "phoneAlt" | "whatsapp" | "viber" | "email" | "website">;
  layout?: "stack" | "row";
}) {
  const greeting = `Namaste, I found ${supplier.businessName} on Thok Bazar and would like to ask about your wholesale rates.`;
  const wrapper = layout === "stack" ? "flex flex-col gap-2" : "flex flex-wrap gap-2";
  const full = layout === "stack" ? "w-full" : "";

  return (
    <div className={wrapper}>
      <Button asChild size="lg" className={full}>
        <a href={telHref(supplier.phone)}>
          <Phone className="size-4" />
          Call {supplier.phone}
        </a>
      </Button>

      {supplier.viber && (
        <Button asChild variant="outline" className={full}>
          <a href={viberHref(supplier.viber)}>
            <MessageCircle className="size-4" />
            Viber
          </a>
        </Button>
      )}

      {supplier.whatsapp && (
        <Button asChild variant="outline" className={full}>
          <a href={whatsappHref(supplier.whatsapp, greeting)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </Button>
      )}

      {supplier.email && (
        <Button asChild variant="outline" className={full}>
          <a href={`mailto:${supplier.email}?subject=${encodeURIComponent("Wholesale enquiry via Thok Bazar")}`}>
            <Mail className="size-4" />
            Email
          </a>
        </Button>
      )}

      {supplier.website && (
        <Button asChild variant="ghost" className={full}>
          <a href={supplier.website} target="_blank" rel="noopener noreferrer nofollow">
            <Globe className="size-4" />
            Website
          </a>
        </Button>
      )}

      {supplier.phoneAlt && (
        <p className="text-muted-foreground px-1 text-xs">
          Also on{" "}
          <a href={telHref(supplier.phoneAlt)} className="hover:text-foreground underline">
            {supplier.phoneAlt}
          </a>
        </p>
      )}
    </div>
  );
}
