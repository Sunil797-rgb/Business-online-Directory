import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Banknote,
  Building2,
  CalendarClock,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactButtons } from "@/components/site/contact-buttons";
import { InquiryForm } from "@/components/site/inquiry-form";
import { ProductTable } from "@/components/site/product-table";
import { RatingStars } from "@/components/site/rating-stars";
import { SupplierCard } from "@/components/site/supplier-card";
import { VerifiedBadge } from "@/components/site/verified-badge";
import { CategoryIcon } from "@/components/site/category-icon";
import { getCategory } from "@/lib/categories";
import { getDistrictName, getProvince } from "@/lib/nepal";
import { dayName, npr, paymentLabel, relativeTime, timeLabel } from "@/lib/format";
import { getRelatedSuppliers, getSupplierBySlug, listSupplierSlugs } from "@/lib/data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await listSupplierSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const supplier = await getSupplierBySlug(slug);
  if (!supplier) return { title: "Supplier not found" };

  return {
    title: `${supplier.businessName} — ${getDistrictName(supplier.districtSlug)}`,
    description: `${supplier.tagline} Wholesale rates, minimum order, delivery areas and terms for ${supplier.businessName} in ${supplier.city}, ${getDistrictName(supplier.districtSlug)}.`,
    openGraph: {
      title: supplier.businessName,
      description: supplier.tagline,
      type: "profile",
    },
  };
}

export default async function SupplierPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supplier = await getSupplierBySlug(slug);
  if (!supplier) notFound();

  const related = await getRelatedSuppliers(supplier, 3);
  const primaryCategory = getCategory(supplier.categorySlugs[0]);
  const province = getProvince(supplier.provinceId);
  const inStockCount = supplier.products.filter((p) => p.inStock).length;

  // Structured data helps the listing surface in Google's local results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: supplier.businessName,
    description: supplier.description,
    telephone: `+977${supplier.phone.replace(/^0+/, "")}`,
    email: supplier.email ?? undefined,
    url: supplier.website ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: supplier.addressLine,
      addressLocality: supplier.city,
      addressRegion: getDistrictName(supplier.districtSlug),
      addressCountry: "NP",
    },
    aggregateRating:
      supplier.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: supplier.ratingAvg,
            reviewCount: supplier.ratingCount,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb + header */}
      <div className="bg-muted/30 border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
          <nav aria-label="Breadcrumb">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
              <li>
                <Link href="/suppliers" className="hover:text-foreground">
                  Suppliers
                </Link>
              </li>
              {primaryCategory && (
                <>
                  <ChevronRight className="size-3" />
                  <li>
                    <Link
                      href={`/categories/${primaryCategory.slug}`}
                      className="hover:text-foreground"
                    >
                      {primaryCategory.name}
                    </Link>
                  </li>
                </>
              )}
              <ChevronRight className="size-3" />
              <li className="text-foreground font-medium">{supplier.businessName}</li>
            </ol>
          </nav>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className="bg-primary/10 text-primary grid size-16 shrink-0 place-items-center rounded-2xl"
              aria-hidden="true"
            >
              <CategoryIcon name={primaryCategory?.icon ?? "Store"} className="size-8" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                  {supplier.businessName}
                </h1>
                {supplier.isVerified && <VerifiedBadge />}
              </div>

              {supplier.businessNameNe && (
                <p className="text-muted-foreground font-devanagari mt-1 text-sm">
                  {supplier.businessNameNe}
                </p>
              )}

              <p className="mt-2 max-w-2xl text-pretty">{supplier.tagline}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <RatingStars rating={supplier.ratingAvg} count={supplier.ratingCount} size="md" />
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {supplier.city}, {getDistrictName(supplier.districtSlug)}
                  {province && ` · ${province.name}`}
                </span>
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Package className="size-4" />
                  {supplier.products.length} products
                </span>
                {supplier.establishedYear && (
                  <span className="text-muted-foreground inline-flex items-center gap-1.5">
                    <Building2 className="size-4" />
                    Since {supplier.establishedYear}
                  </span>
                )}
              </div>

              <ul className="mt-4 flex flex-wrap gap-2">
                {supplier.categorySlugs.map((categorySlug) => {
                  const category = getCategory(categorySlug);
                  if (!category) return null;
                  return (
                    <li key={categorySlug}>
                      <Link href={`/categories/${categorySlug}`}>
                        <Badge variant="secondary" className="hover:bg-secondary/70 gap-1.5">
                          <CategoryIcon name={category.icon} className="size-3" />
                          {category.name}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_21rem]">
        {/* ------------------------------------------------------------ */}
        {/* Main column                                                   */}
        {/* ------------------------------------------------------------ */}
        <div className="min-w-0">
          <Tabs defaultValue="products">
            <TabsList className="max-w-full justify-start overflow-x-auto">
              <TabsTrigger value="products">
                Price list
                <Badge variant="muted" className="ml-1 px-1.5 text-[0.6875rem]">
                  {supplier.products.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="terms">
                Terms
                <Badge variant="muted" className="ml-1 px-1.5 text-[0.6875rem]">
                  {supplier.terms.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews
                <Badge variant="muted" className="ml-1 px-1.5 text-[0.6875rem]">
                  {supplier.reviews.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Price list ------------------------------------------------ */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Products and wholesale rates</h2>
                <p className="text-muted-foreground text-xs tabular">
                  {inStockCount} of {supplier.products.length} in stock
                </p>
              </div>
              <p className="text-muted-foreground text-sm text-pretty">
                Rates are quoted by the supplier and exclude VAT unless their terms say otherwise.
                Confirm the current rate when you call — prices on fresh goods move daily.
              </p>
              <ProductTable products={supplier.products} />
            </TabsContent>

            {/* About ---------------------------------------------------- */}
            <TabsContent value="about" className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold">About {supplier.businessName}</h2>
                <p className="text-muted-foreground mt-2 leading-relaxed text-pretty">
                  {supplier.description}
                </p>
              </section>

              <Separator />

              <section className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="text-primary size-4" />
                    Address
                  </h3>
                  <address className="text-muted-foreground mt-2 text-sm not-italic">
                    {supplier.addressLine}
                    <br />
                    {supplier.city}, {getDistrictName(supplier.districtSlug)}
                    {province && (
                      <>
                        <br />
                        {province.name} Province, Nepal
                      </>
                    )}
                    {supplier.landmark && (
                      <>
                        <br />
                        <span className="text-xs">Landmark: {supplier.landmark}</span>
                      </>
                    )}
                  </address>
                </div>

                <div>
                  <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                    <Clock className="text-primary size-4" />
                    Opening hours
                  </h3>
                  <dl className="mt-2 space-y-1 text-sm">
                    {supplier.openingHours.map((entry) => (
                      <div key={entry.day} className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">{dayName(entry.day)}</dt>
                        <dd className={entry.open ? "tabular" : "text-muted-foreground"}>
                          {entry.open
                            ? `${timeLabel(entry.open)} – ${timeLabel(entry.close)}`
                            : "Closed"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                    <Truck className="text-primary size-4" />
                    Delivery
                  </h3>
                  {supplier.deliveryAvailable ? (
                    <div className="mt-2 space-y-2 text-sm">
                      {supplier.deliveryNote && (
                        <p className="text-muted-foreground text-pretty">{supplier.deliveryNote}</p>
                      )}
                      <ul className="flex flex-wrap gap-1.5">
                        {supplier.deliveryAreas.map((area) => (
                          <li key={area}>
                            <Badge variant="outline" className="font-normal">
                              {area}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                      {supplier.leadTimeHours !== null && (
                        <p className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                          <CalendarClock className="size-3.5" />
                          Usual lead time: {supplier.leadTimeHours} hours
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-2 text-sm">
                      Pickup only — collect from the address above.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                    <CreditCard className="text-primary size-4" />
                    Payment
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {supplier.paymentMethods.map((method) => (
                      <li key={method}>
                        <Badge variant="outline" className="font-normal">
                          {paymentLabel(method)}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  {supplier.creditTerms && (
                    <p className="text-muted-foreground mt-2 text-sm text-pretty">
                      {supplier.creditTerms}
                    </p>
                  )}
                </div>
              </section>

              {(supplier.panVatNo || supplier.registrationNo) && (
                <>
                  <Separator />
                  <section>
                    <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                      <ShieldCheck className="text-primary size-4" />
                      Business registration
                    </h3>
                    <dl className="text-muted-foreground mt-2 grid gap-1 text-sm sm:grid-cols-2">
                      {supplier.panVatNo && (
                        <div className="flex gap-2">
                          <dt>PAN / VAT:</dt>
                          <dd className="tabular text-foreground">{supplier.panVatNo}</dd>
                        </div>
                      )}
                      {supplier.registrationNo && (
                        <div className="flex gap-2">
                          <dt>Registration:</dt>
                          <dd className="tabular text-foreground">{supplier.registrationNo}</dd>
                        </div>
                      )}
                    </dl>
                  </section>
                </>
              )}
            </TabsContent>

            {/* Terms ---------------------------------------------------- */}
            <TabsContent value="terms" className="space-y-4">
              <div>
                <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
                  <FileText className="text-primary size-5" />
                  Terms and conditions of sale
                </h2>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  Set by {supplier.businessName}, not by Thok Bazar. Read them before you place a
                  first order — minimum quantities and return rules are where most disputes start.
                </p>
              </div>

              {supplier.terms.length === 0 ? (
                <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-10 text-center text-sm">
                  This supplier has not published written terms. Agree them on the phone and ask for
                  it in writing on your first invoice.
                </p>
              ) : (
                <ol className="space-y-3">
                  {supplier.terms.map((term, index) => (
                    <li key={term.title}>
                      <Card className="p-5">
                        <div className="flex gap-3">
                          <span className="bg-muted text-muted-foreground grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold">{term.title}</h3>
                            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
                              {term.body}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ol>
              )}

              <div className="bg-muted/50 rounded-lg border p-4">
                <p className="text-muted-foreground text-xs text-pretty">
                  <strong className="text-foreground">Note:</strong> Thok Bazar does not verify,
                  endorse or enforce supplier terms. Any contract is strictly between you and the
                  supplier.
                </p>
              </div>
            </TabsContent>

            {/* Reviews -------------------------------------------------- */}
            <TabsContent value="reviews" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">What buyers say</h2>
                <RatingStars rating={supplier.ratingAvg} count={supplier.ratingCount} size="md" />
              </div>

              {supplier.reviews.length === 0 ? (
                <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-10 text-center text-sm">
                  No written reviews yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {supplier.reviews.map((review) => (
                    <li key={review.id}>
                      <Card className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{review.authorName}</p>
                            {review.authorBusiness && (
                              <p className="text-muted-foreground text-xs">
                                {review.authorBusiness}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <RatingStars rating={review.rating} />
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {relativeTime(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed text-pretty">
                          {review.comment}
                        </p>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Sidebar                                                       */}
        {/* ------------------------------------------------------------ */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Contact this supplier</h2>
            <div className="mt-4">
              <ContactButtons supplier={supplier} />
            </div>

            <Separator className="my-4" />

            <dl className="space-y-2.5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Banknote className="size-4" />
                  Minimum order
                </dt>
                <dd className="tabular text-right font-medium">
                  {supplier.minOrderAmount !== null ? npr(supplier.minOrderAmount) : "None"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Truck className="size-4" />
                  Delivery
                </dt>
                <dd className="text-right font-medium">
                  {supplier.deliveryAvailable ? `${supplier.deliveryAreas.length} districts` : "Pickup only"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Package className="size-4" />
                  Products listed
                </dt>
                <dd className="tabular text-right font-medium">{supplier.products.length}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold">Ask for a quote</h2>
            <p className="text-muted-foreground mt-1 text-xs text-pretty">
              Send your quantities and the supplier will call you back with a rate.
            </p>
            <div className="mt-4">
              <InquiryForm
                supplierId={supplier.id}
                supplierSlug={supplier.slug}
                supplierName={supplier.businessName}
              />
            </div>
          </Card>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <Separator className="mb-8" />
          <h2 className="text-xl font-bold tracking-tight">Other suppliers in this category</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <SupplierCard key={item.id} supplier={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
