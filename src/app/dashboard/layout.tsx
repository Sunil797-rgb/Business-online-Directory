import Link from "next/link";
import { Inbox, LayoutDashboard, Package } from "lucide-react";
import { DATA_MODE } from "@/lib/supabase/config";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Price list", icon: Package },
  { href: "/dashboard/inquiries", label: "Enquiries", icon: Inbox },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supplier dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {DATA_MODE === "demo"
              ? "Showing a sample listing — connect Supabase to manage your own."
              : "Manage your listing, prices and enquiries."}
          </p>
        </div>
      </div>

      <nav className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-b" aria-label="Dashboard">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted-foreground hover:text-foreground hover:border-border -mb-px inline-flex items-center gap-2 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
