import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "For buyers",
    links: [
      { href: "/suppliers", label: "Browse all suppliers" },
      { href: "/products", label: "Compare prices" },
      { href: "/categories", label: "Supply categories" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "For suppliers",
    links: [
      { href: "/for-suppliers", label: "Why list with us" },
      { href: "/register-business", label: "List your business" },
      { href: "/dashboard", label: "Supplier dashboard" },
      { href: "/login", label: "Log in" },
    ],
  },
  {
    title: "Directory",
    links: [
      { href: "/about", label: "About Thok Bazar" },
      { href: "/how-it-works", label: "Verification policy" },
      { href: "/suppliers?district=kathmandu", label: "Suppliers in Kathmandu" },
      { href: "/suppliers?district=kaski", label: "Suppliers in Pokhara" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-muted/40 mt-20 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="text-muted-foreground mt-4 max-w-xs text-sm text-pretty">
              The wholesale supplier directory for Nepali restaurants, cafés and small businesses.
              Find the farm, mill or depot that actually stocks what your kitchen needs.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold tracking-wide uppercase">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-8">
          <h3 className="text-xs font-semibold tracking-wide uppercase">Popular categories</h3>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-muted-foreground hover:text-foreground text-[0.8125rem] transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-muted-foreground mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Thok Bazar. Built for Nepal&rsquo;s small businesses.</p>
          <p>
            Thok Bazar lists suppliers; it is not a party to any trade. Always agree terms directly
            with the supplier.
          </p>
        </div>
      </div>
    </footer>
  );
}
