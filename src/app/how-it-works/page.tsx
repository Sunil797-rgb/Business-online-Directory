import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  PhoneCall,
  Search,
  ShieldQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Thok Bazar works for buyers and suppliers, what the verified badge means, and what the directory does and does not guarantee.",
};

const BUYER_STEPS = [
  {
    icon: Search,
    title: "Search for the item, not the business",
    body: "Type what your kitchen needs — 'momo wrapper', 'jeera masino', 'mozzarella' — and we search every supplier's product list, not just their business name. Filter by your district so you only see people who can actually reach you.",
  },
  {
    icon: ClipboardList,
    title: "Read the listing properly",
    body: "Each profile shows the price list with the date each rate was last confirmed, the minimum order, delivery areas and lead time, accepted payment methods, and the supplier's written terms. Check the minimum order first — it is the most common reason a deal falls apart.",
  },
  {
    icon: PhoneCall,
    title: "Call, or send your quantities",
    body: "Ring them directly, message on Viber or WhatsApp, or send an enquiry listing what you need and how often. Suppliers quote much faster when they can see the volume.",
  },
];

const CHECKS = [
  "The PAN or VAT number is nine digits and matches the business name on the certificate.",
  "The listed phone number connects to someone who can take an order.",
  "The business address is a real trading location, not a residential placeholder.",
];

const NOT_CHECKS = [
  "Product quality, hygiene standards or food safety practice.",
  "Whether the listed prices are competitive or honoured on the day.",
  "Whether the supplier will deliver on time, or at all.",
  "The supplier's creditworthiness or whether they will honour a credit term.",
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">How Thok Bazar works</h1>
        <p className="text-muted-foreground mt-3 text-pretty">
          Thok Bazar is a directory, not a marketplace. We help you find and judge a wholesale
          supplier. The order, the payment and the relationship are entirely between you and them.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight">If you are buying</h2>
        <ol className="mt-6 space-y-4">
          {BUYER_STEPS.map((step, index) => (
            <li key={step.title}>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <span className="bg-primary/8 text-primary grid size-10 shrink-0 place-items-center rounded-lg">
                    <step.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold">
                      <span className="text-muted-foreground tabular mr-2">{index + 1}.</span>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="inline-flex items-center gap-2 text-xl font-bold tracking-tight">
          <BadgeCheck className="text-success size-5" />
          What the verified badge means
        </h2>
        <p className="text-muted-foreground mt-3 text-pretty">
          A verified badge is a check on identity, nothing more. It tells you the business exists
          and can be reached. It is deliberately a low bar, honestly described, rather than a
          quality mark we cannot stand behind.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="border-success/30 p-5">
            <h3 className="text-success inline-flex items-center gap-2 text-sm font-semibold">
              <BadgeCheck className="size-4" />
              We check
            </h3>
            <ul className="mt-3 space-y-2">
              {CHECKS.map((item) => (
                <li key={item} className="text-muted-foreground flex gap-2 text-sm text-pretty">
                  <span className="bg-success mt-1.5 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-warning/40 p-5">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
              <ShieldQuestion className="text-warning size-4" />
              We do not check
            </h3>
            <ul className="mt-3 space-y-2">
              {NOT_CHECKS.map((item) => (
                <li key={item} className="text-muted-foreground flex gap-2 text-sm text-pretty">
                  <span className="bg-warning mt-1.5 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold tracking-tight">Reading a price with the right caution</h2>
        <p className="text-muted-foreground mt-3 text-pretty">
          Every rate on Thok Bazar carries the date the supplier last confirmed it, shown as a
          coloured dot next to the price.
        </p>
        <ul className="mt-5 space-y-3">
          {[
            {
              dot: "bg-success",
              label: "Confirmed in the last week",
              body: "Treat it as a working rate, but still confirm on the call — fresh produce and meat move daily.",
            },
            {
              dot: "bg-warning",
              label: "Confirmed in the last month",
              body: "Useful for comparing suppliers, but expect movement on anything perishable.",
            },
            {
              dot: "bg-destructive",
              label: "Over a month old",
              body: "Treat this as a lead, not a quote. The supplier may still be excellent — the number just has not been touched.",
            },
          ].map((item) => (
            <li key={item.label} className="flex gap-3">
              <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${item.dot}`} aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-muted-foreground text-sm text-pretty">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <Card className="border-warning/40 bg-warning/5 p-6">
          <h2 className="inline-flex items-center gap-2 font-semibold">
            <AlertTriangle className="text-warning size-5" />
            What Thok Bazar is not responsible for
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed text-pretty">
            We list businesses and the information they give us. We are not a party to any trade
            arranged through the directory, we do not handle payments, we do not hold stock, and we
            cannot recover money or goods if something goes wrong. Supplier terms and conditions are
            written by the supplier and enforced by the supplier. Before a first order with anyone,
            agree quantity, rate, delivery window and payment terms in writing — a Viber message is
            writing — and treat the first delivery as a trial.
          </p>
        </Card>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold tracking-tight">Questions buyers ask</h2>
        <Accordion type="single" collapsible className="mt-5">
          {[
            {
              q: "Do I need an account to contact a supplier?",
              a: "No. Phone numbers and the enquiry form are open to everyone. An account is only useful if you want to list your own business or keep track of enquiries you have sent.",
            },
            {
              q: "Does Thok Bazar charge buyers anything?",
              a: "No. The directory is free to search and free to use. We take no commission from either side of a trade.",
            },
            {
              q: "Why are some suppliers not verified?",
              a: "Either they have not sent their PAN/VAT certificate yet, or we have not finished checking it. An unverified listing is not a warning — it just means we have not confirmed the paperwork. Judge it on its reviews and on your own call with them.",
            },
            {
              q: "Can I negotiate the listed price?",
              a: "Usually, yes — especially on volume. Listed rates are generally the standard wholesale rate for a typical order. Tell the supplier your weekly or monthly volume and ask what it changes.",
            },
            {
              q: "A listing has wrong information. What do I do?",
              a: "Tell the supplier first; most errors are stale prices they will fix in a minute. If a listing looks fraudulent or the business no longer exists, report it and we will review the listing.",
            },
          ].map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed text-pretty">{faq.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/suppliers">Start searching</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/for-suppliers">I want to list my business</Link>
        </Button>
      </div>
    </div>
  );
}
