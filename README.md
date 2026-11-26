# Thok Bazar — थोक बजार

A wholesale supplier directory for Nepali restaurants, cafés, hotels and small
businesses. Suppliers publish what they stock, what they charge, their minimum
order and their terms; buyers search by item and district, compare, and call
the supplier directly.

It is deliberately a **directory, not a marketplace**. There is no checkout and
no commission. Wholesale trade in Nepal runs on phone calls, Viber and credit
arrangements that a cart flow does not capture — the job here is to get a
restaurant owner to the right phone number with their eyes open.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>. **No configuration is needed** — the app starts in
demo mode on bundled sample data (26 suppliers, 256 priced products, 16
categories across 11 districts).

> Everything in the demo data is fictional. Business names, phone numbers,
> PAN/VAT numbers and prices are invented examples. A banner says so on every
> page while demo mode is active.

---

## What is built

### For buyers

| Page | What it does |
| --- | --- |
| `/` | Hero search, category grid, top-rated suppliers, district shortcuts |
| `/suppliers` | Browse and filter: category, district, minimum order, payment method, verified, delivery |
| `/suppliers/[slug]` | Full profile — price list, about, terms & conditions, reviews, contact, enquiry form |
| `/products` | **Price comparison** across every supplier, sorted by rate, with the lowest price flagged |
| `/categories`, `/categories/[slug]` | The 16 supply categories, each with a lowest-rate snapshot |
| `/how-it-works` | What the verified badge does and does not mean; how to read a price |

Searching `/suppliers` matches supplier names **and every product they list**, so
"momo wrapper" finds the udyog that makes them. Searching `/products` matches
product fields only, so "rice" returns rice rather than everything sold by a
business with "Rice Mill" in its name.

All filter state lives in the URL, so a filtered view can be bookmarked or sent
to a colleague on Viber.

### For suppliers

| Page | What it does |
| --- | --- |
| `/for-suppliers` | Why list, what it costs (nothing), FAQs |
| `/register-business` | Four-section listing form with validation |
| `/dashboard` | Overview, stale-price and out-of-stock warnings, recent enquiries |
| `/dashboard/products` | The published price list with freshness breakdown |
| `/dashboard/inquiries` | Enquiries received, with quantities and a call button |

### Details worth knowing

- **Price freshness.** Every rate carries the date the supplier last confirmed
  it, shown as a green/amber/red dot. A price nobody has touched in two months
  is a lead, not a quote, and the UI says so. A Postgres trigger stamps
  `price_updated_at` only when the price actually changes, not on any row edit.
- **NPR formatting** uses South Asian digit grouping (`Rs 1,00,000`).
- **Nepali units** — kg, litre, dozen, crate, carton, bora, tin, packet.
- **Contact** — `tel:`, Viber and WhatsApp deep links with the `+977` country
  code handled correctly for mobiles and STD landlines.
- **Bilingual labels.** Business and product names carry an optional Devanagari
  name, set in Noto Sans Devanagari with looser leading so matras are not
  clipped.
- **SEO.** Per-supplier metadata, `LocalBusiness` JSON-LD, sitemap and robots.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Components | shadcn/ui patterns on Radix primitives, hand-written in `src/components/ui` |
| Backend | Supabase — Postgres, Auth, RLS |
| Icons | lucide-react |
| Validation | Zod, inside Server Actions |

A React Native + Expo app can reuse `src/lib/types.ts`, `src/lib/nepal.ts`,
`src/lib/categories.ts`, `src/lib/format.ts` and `src/lib/search.ts` unchanged —
they have no DOM or Next dependencies.

---

## Connecting Supabase

Demo mode exists so the app runs on a fresh clone. To run on real listings:

**1. Create a project** at [supabase.com](https://supabase.com).

**2. Run the migrations** — paste each file into the SQL editor in order, or use
the CLI:

```bash
supabase db push
```

- `supabase/migrations/0001_schema.sql` — tables, indexes, triggers
- `supabase/migrations/0002_rls.sql` — row level security policies

**3. Add your keys.** Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**4. Restart.** The demo banner disappears and reads/writes go to Postgres.

### How the two modes work

`src/lib/supabase/config.ts` decides the mode purely by whether those two
variables are present. `src/lib/data.ts` is the single read path: in live mode
it loads from Supabase and maps snake_case rows to the domain types in
`src/lib/supabase/mappers.ts`; in demo mode it reads `src/lib/seed`. Filtering
and sorting then run over the same in-memory code either way, so a search
behaves identically in both.

If a Supabase read fails, the app logs the error server-side and falls back to
the seed data rather than showing an empty directory.

> **Status:** the demo path is exercised by the build and by the screenshots in
> this repo's history. The Supabase path — queries, auth, Server Action inserts
> and the RLS policies — is written but has **not** been run against a live
> project, because this repo ships without credentials. Treat the first
> connection as a thing to test, not as proven.

### Security model

The schema is public-read, owner-write:

- Anyone, signed in or not, can read active listings, products and reviews.
- Only the owner of a listing can edit it or its products.
- `is_verified`, `rating_avg` and `rating_count` are **revoked at the column
  level** from `anon` and `authenticated`, so a supplier cannot mark themselves
  verified or inflate their own rating regardless of the update policy.
- Anyone can send an enquiry without an account — requiring a signup here would
  lose most of the buyers the directory exists for — but only the supplier it
  was sent to can read it.
- A supplier cannot review their own business.

---

## Commands

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm test
```

```bash
npm run lint
```

```bash
npm run typecheck
```

Tests cover the search matcher, NPR formatting, phone-number normalisation and
price-freshness grading — the pure logic where a quiet bug does real damage.
(The `rice` / `price` substring collision in the search matcher was caught this
way.)

---

## Project layout

```
src/
  app/                    Routes (App Router)
    suppliers/            Browse + profile
    categories/           Category index + per-category
    products/             Cross-supplier price comparison
    dashboard/            Supplier-side pages
    register-business/    Listing form
    auth/callback/        Supabase OAuth/email callback
  components/
    ui/                   shadcn/ui primitives (Radix + cva)
    site/                 Directory-specific components
  lib/
    types.ts              Domain types, mirroring the SQL schema
    data.ts               The single read path (Supabase or seed)
    nepal.ts              77 districts, 7 provinces
    categories.ts         The 16 supply categories
    format.ts             NPR, units, phone links, freshness
    search.ts             Word-prefix text matching
    actions.ts            Server Actions (enquiry, registration)
    supabase/             Client, server, mappers, mode detection
    seed/                 Demo data
  proxy.ts                Supabase session refresh
supabase/migrations/      Schema and RLS
```

---

## Known gaps

Honest list of what an MVP does not yet do:

- **No supplier product editing UI.** The dashboard price list is read-only; the
  schema and RLS support writes, but the add/edit forms are not built.
- **Email/password auth only.** Phone OTP would suit Nepali users better but
  needs a paid SMS provider.
- **No image uploads.** `logo_url` / `cover_url` / `image_url` exist in the
  schema; Supabase Storage is not wired up.
- **No admin tooling** for granting the verified badge — it is a service-role
  database update today.
- **No buyer accounts in use.** `favorites` exists in the schema but has no UI.
- **In-memory filtering.** `data.ts` loads active suppliers and products and
  filters in Node. That is fine into the low thousands of rows; past that, move
  the filters into the Postgres query (the indexes in `0001_schema.sql` are
  already shaped for it).
- **No i18n framework.** Devanagari names are stored per-record, but the
  interface chrome is English only.

---

## Licence

Not yet chosen.
