import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/site/category-icon";
import { CATEGORIES } from "@/lib/categories";
import { getCategoryCounts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Supply categories",
  description:
    "Every category of wholesale supplier a Nepali restaurant needs — poultry, meat and fish, vegetables, rice mills, dairy, bakery, liquor, spices, packaging and more.",
};

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Supply categories</h1>
        <p className="text-muted-foreground mt-3 text-pretty">
          The whole restaurant supply chain, split the way a kitchen actually buys. Pick a category
          to see every supplier in it, with their price lists and terms.
        </p>
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const count = counts[category.slug] ?? 0;
          return (
            <li key={category.slug}>
              <Card className="group hover:border-primary/50 h-full p-6 transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <span className="bg-primary/8 text-primary grid size-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110">
                    <CategoryIcon name={category.icon} className="size-5.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">
                      <Link href={`/categories/${category.slug}`} className="hover:text-primary">
                        {category.name}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground font-devanagari text-xs">
                      {category.nameNe}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-4 text-sm text-pretty">
                  {category.description}
                </p>

                <Link
                  href={`/categories/${category.slug}`}
                  className="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                >
                  {count} {count === 1 ? "supplier" : "suppliers"}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
