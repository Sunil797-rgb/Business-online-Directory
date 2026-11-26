import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  FileText,
  LineChart,
  MessagesSquare,
  PhoneCall,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "List your wholesale business",
  description:
    "Free listing for Nepali wholesale suppliers. Publish your products and rates, show your terms, and let restaurants call you directly. No commission.",
};

const BENEFITS = [
  {
    icon: Wallet,
    title: "No commission, ever",
    body: "Buyers call you and pay you directly. Thok Bazar never touches the order or takes a cut, so your margin is your margin.",
  },
  {
    icon: ClipboardList,
    title: "Your price list, in the open",
    body: "Publishing rates filters out buyers who were never going to pay them. The enquiries you get are from people who already know your numbers.",
  },
  {
    icon: FileText,
    title: "Your terms, up front",
    body: "Minimum order, credit period, return policy, cold-chain rules. Setting expectations before the first call prevents most disputes.",
  },
  {
    icon: PhoneCall,
    title: "Straight to your phone",
    body: "Call, Viber and WhatsApp buttons on your listing. No app for the buyer to install, no inbox for you to monitor.",
  },
  {
    icon: BadgeCheck,
    title: "Verified badge",
    body: "Send your PAN/VAT certificate and we check it. Verified listings rank above unverified ones in every search.",
  },
  {
    icon: LineChart,
    title: "Keep prices current",
    body: "Each rate carries the date you last confirmed it. Buyers trust a fresh price — and a stale one is flagged to them.",
  },
];

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. Listing your business, publishing your products and rates, and receiving enquiries all cost nothing. We take no commission on any trade arranged through the directory.",
  },
  {
    q: "How do I get the verified badge?",
    a: "Add your PAN or VAT number when you register, then send us a copy of the certificate. We check the number against the business name and confirm your phone works. It usually takes two working days.",
  },
  {
    q: "My prices change every day. Is this still useful?",
    a: "Very. Fresh produce, poultry, fish and LPG all move with the market. List your indicative rate and update it when it shifts — every price shows the date you last confirmed it, so buyers know what they are looking at and call to confirm.",
  },
  {
    q: "Will my competitors see my rates?",
    a: "Yes, and you will see theirs. In practice wholesale rates in any mandi are already common knowledge within a day. What wins you the order is reliability, delivery and terms — which is exactly what the listing lets you show.",
  },
  {
    q: "Do I have to deliver?",
    a: "No. Pickup-only suppliers are listed too; your listing simply shows your address and hours instead of delivery areas. Buyers can filter either way.",
  },
  {
    q: "What if a buyer does not pay?",
    a: "Thok Bazar is a directory, not a marketplace or a payment processor. We are not a party to your trade and cannot recover payment. Publish your credit terms clearly and treat new buyers as you would any walk-in.",
  },
];

export default async function ForSuppliersPage() {
  const stats = await getStats();

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="from-primary/8 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="max-w-3xl">
            <Badge variant="outline" className="bg-background/80">
              For suppliers
            </Badge>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              Restaurants are already searching for what you sell
            </h1>
            <p className="text-muted-foreground mt-5 max-w-2xl text-base text-pretty sm:text-lg">
              Every day, kitchen owners across Nepal go looking for a poultry farm, a rice mill, a
              vegetable trader or a bakery they can rely on. Put your business where they are
              looking — with your products, your rates and your terms.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/register-business">
                  List your business free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/suppliers">See how listings look</Link>
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              {stats.supplierCount} businesses listed · {stats.productCount} products with live
              rates
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why list here</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title}>
              <Card className="h-full p-6">
                <span className="bg-primary/8 text-primary grid size-10 place-items-center rounded-lg">
                  <benefit.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">{benefit.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-muted/40 border-y">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What it takes</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Register in five minutes",
                body: "Business name, category, district, phone and a short description. That is enough to go live.",
              },
              {
                title: "Add your price list",
                body: "Item, unit, rate, minimum quantity. Add a bulk rate if you have one. Update whenever the market moves.",
              },
              {
                title: "Answer the phone",
                body: "Buyers call, Viber or send an enquiry with their quantities. You quote and close it the way you always have.",
              },
            ].map((step, index) => (
              <li key={step.title}>
                <Card className="h-full p-6">
                  <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm text-pretty">{step.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <MessagesSquare className="text-primary size-6" />
          Common questions
        </h2>
        <Accordion type="single" collapsible className="mt-6">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed text-pretty">{faq.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="mt-10 p-8 text-center">
          <h2 className="text-xl font-bold tracking-tight">Ready to be found?</h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm text-pretty">
            Listing is free and takes about five minutes. You can add your full price list
            afterwards.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/register-business">
              List your business
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </>
  );
}
