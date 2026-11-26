import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * "Verified" means the directory has seen the business's PAN/VAT certificate
 * and confirmed the phone number. It is deliberately not a quality guarantee.
 */
export function VerifiedBadge({ className, label = "Verified" }: { className?: string; label?: string }) {
  return (
    <Badge variant="success" className={cn("gap-1 px-2", className)} title="PAN/VAT and phone number checked by Thok Bazar">
      <BadgeCheck className="size-3" />
      {label}
    </Badge>
  );
}
