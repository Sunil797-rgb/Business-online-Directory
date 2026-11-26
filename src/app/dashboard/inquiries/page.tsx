import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/site/empty-state";
import { getDashboardSupplier, listInquiries } from "@/lib/data";
import { relativeTime, telHref, unitLabel } from "@/lib/format";
import type { InquiryStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

const STATUS_VARIANT: Record<InquiryStatus, "default" | "secondary" | "success" | "muted"> = {
  new: "default",
  responded: "secondary",
  quoted: "success",
  closed: "muted",
};

const BUYER_TYPE_LABEL: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "Café",
  hotel: "Hotel / lodge",
  bakery: "Bakery",
  catering: "Catering",
  retailer: "Retailer",
  other: "Other",
};

export default async function DashboardInquiriesPage() {
  const supplier = await getDashboardSupplier();

  if (!supplier) {
    return (
      <EmptyState
        title="No listing yet"
        description="Create your listing to start receiving enquiries."
        action={
          <Button asChild>
            <Link href="/register-business">List your business</Link>
          </Button>
        }
      />
    );
  }

  const inquiries = await listInquiries(supplier.id);

  if (inquiries.length === 0) {
    return (
      <EmptyState
        icon={<Mail className="size-6" />}
        title="No enquiries yet"
        description="Buyers who send an enquiry will appear here with their quantities and phone number."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm tabular">
        {inquiries.length} {inquiries.length === 1 ? "enquiry" : "enquiries"} ·{" "}
        {inquiries.filter((i) => i.status === "new").length} unanswered
      </p>

      <ul className="space-y-4">
        {inquiries.map((inquiry) => (
          <li key={inquiry.id}>
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{inquiry.buyerName}</h2>
                  <p className="text-muted-foreground text-sm">
                    {inquiry.buyerBusiness ?? "No business name given"} ·{" "}
                    {BUYER_TYPE_LABEL[inquiry.buyerType] ?? inquiry.buyerType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[inquiry.status]}>{inquiry.status}</Badge>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {relativeTime(inquiry.createdAt)}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-pretty">{inquiry.message}</p>

              {inquiry.items.length > 0 && (
                <div className="bg-muted/50 mt-4 rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs font-medium">Quantities requested</p>
                  <ul className="mt-2 space-y-1">
                    {inquiry.items.map((item, index) => (
                      <li
                        key={`${inquiry.id}-${index}`}
                        className="flex items-baseline justify-between gap-3 text-sm"
                      >
                        <span>{item.name}</span>
                        <span className="tabular font-medium">
                          {item.quantity} {unitLabel(item.unit)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <a href={telHref(inquiry.phone)}>
                    <Phone className="size-3.5" />
                    Call {inquiry.phone}
                  </a>
                </Button>
                {inquiry.email && (
                  <Button asChild size="sm" variant="outline">
                    <a href={`mailto:${inquiry.email}`}>
                      <Mail className="size-3.5" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
