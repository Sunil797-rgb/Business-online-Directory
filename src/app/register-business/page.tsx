import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterBusinessForm } from "@/components/site/register-form";

export const metadata: Metadata = {
  title: "List your business",
  description:
    "Add your wholesale business to Thok Bazar for free. Publish your products, rates and terms so Nepali restaurants can find and call you directly.",
};

export default function RegisterBusinessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link
        href="/for-suppliers"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" />
        Why list with Thok Bazar
      </Link>

      <header className="mt-5">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">List your business</h1>
        <p className="text-muted-foreground mt-3 text-pretty">
          Four short sections, about five minutes. Your listing goes live immediately — you can add
          your full price list and written terms from the dashboard afterwards.
        </p>
      </header>

      <div className="mt-8">
        <RegisterBusinessForm />
      </div>
    </div>
  );
}
