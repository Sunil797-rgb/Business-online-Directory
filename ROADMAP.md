# Thok Bazar — production readiness roadmap

**Status date:** 26 November 2026
**Branch audited:** `claude/optimistic-hopper-53l6vx`
**Audit basis:** the code in this repository, not notes or memory. Every claim
below was checked against the source, the SQL migrations, the build output and
a scripted browser run.

---

## 1. Where the project actually stands

### Legend

| Mark | Meaning |
| --- | --- |
| ✅ **Done** | Built and verified working |
| 🟡 **Partial** | Works for some cases, has a named gap |
| ⚠️ **Untested** | Code is written; it has never run against a live system |
| ❌ **Missing** | Not built |

### 1.1 Public directory (buyer side)

| Capability | Status | Evidence / gap |
| --- | --- | --- |
| Home, categories, how-it-works, about | ✅ Done | 61 routes prerendered |
| Supplier browse with 7 filters | ✅ Done | Filters drive the URL; verified in-browser |
| Search across supplier + product fields | ✅ Done | `src/lib/filters.ts`, word-prefix matching, 16 unit tests |
| Supplier profile (price list, terms, reviews, contact) | ✅ Done | 26 profiles prerendered |
| Cross-supplier price comparison + lowest-price flag | ✅ Done | `/products` |
| Price freshness grading | ✅ Done | `priceFreshness()` + DB trigger `touch_product_price` ⚠️ |
| `tel:` / Viber / WhatsApp deep links | ✅ Done | `+977` handled for mobile and STD landline |
| Responsive, light + dark | ✅ Done | No horizontal scroll at 390px |
| WCAG AA contrast | ✅ Done | 0 failures across 12 page/theme combinations |
| Nepal geography, NPR, trade units | ✅ Done | 77 districts, 7 provinces, 14 units |
| Buyer accounts (favourites, reviews) | ❌ Missing | `favorites` table exists, zero UI; no review-writing UI |

### 1.2 Supplier side

| Capability | Status | Evidence / gap |
| --- | --- | --- |
| Listing registration form + validation | 🟡 Partial | Inserts a row; no image, no products, no role change on `profiles` |
| Dashboard overview, stale-price warnings | ✅ Done | Read-only |
| Price list view | ✅ Done | Read-only |
| **Product create / edit / delete** | ❌ Missing | "Add product" button has **no handler at all** (`dashboard/products/page.tsx:50`) |
| Enquiry inbox | 🟡 Partial | Lists enquiries; cannot change status, though the RLS policy for it exists |
| Enquiry notification (email/SMS) | ❌ Missing | A supplier only learns of an enquiry by opening the dashboard |
| Terms editing | ❌ Missing | `terms` jsonb is seed-only |

### 1.3 Data, auth and security

| Capability | Status | Evidence / gap |
| --- | --- | --- |
| Postgres schema (6 tables, 13 indexes) | ⚠️ Untested | `supabase/migrations/0001_schema.sql`, never applied to a live project |
| 16 RLS policies | ⚠️ Untested | `0002_rls.sql`, never exercised |
| Column-level `REVOKE` on `is_verified`, `rating_avg`, `rating_count` | ⚠️ Untested | Prevents self-verification — unproven |
| 4 triggers (new user, price stamp, rating refresh, updated_at) | ⚠️ Untested | — |
| Supabase read path | ⚠️ Untested | 7 query sites in `data.ts` / `actions.ts` |
| Signup / login / email callback | ⚠️ Untested | `auth-form.tsx`, `auth/callback/route.ts` |
| Session refresh | ⚠️ Untested | `src/proxy.ts` |
| **Logout** | ❌ Missing | `signOut` appears nowhere in the codebase |
| **Session-aware header** | ❌ Missing | Header always renders "Log in" |
| **Protected routes** | ❌ Missing | `/dashboard` is public and shows a sample listing to anyone |
| Role handling (`buyer` / `supplier` / `admin`) | ❌ Missing | Column exists, never read or written |
| Password reset | ❌ Missing | — |
| Rate limiting / CAPTCHA / honeypot | ❌ Missing | **Zero occurrences in the codebase** |
| Admin dashboard & verification workflow | ❌ Missing | `is_verified` is a manual service-role `UPDATE` |

### 1.4 Delivery

| Capability | Status |
| --- | --- |
| Local build, lint, typecheck, 16 unit tests | ✅ Done |
| Static preview export (`preview/build.mjs`) | ✅ Done |
| CI pipeline | ❌ Missing — no `.github/workflows` |
| Staging environment | ❌ Missing |
| Production environment | ❌ Missing |
| Error tracking / uptime / backups | ❌ Missing |
| Privacy policy, terms of use | ❌ Missing |

---

## 2. Four problems to fix before anything else

These came out of the audit and change the shape of the plan.

### 2.1 🔴 The demo fallback will serve fake businesses in production

`loadDataset()` in `src/lib/data.ts:74` catches **any** Supabase error and
silently falls back to the bundled seed data:

```ts
} catch (error) {
  console.error("[thokbazar] Supabase read failed, falling back to seed data:", error);
  return { suppliers: SEED_SUPPLIERS, products: SEED_PRODUCTS, reviews: SEED_REVIEWS };
}
```

In development that is a convenience. In production it means a database outage
turns the site into a directory of **invented businesses with invented phone
numbers**, with no banner, because `DATA_MODE` is `"live"`. A restaurant owner
could ring a number that belongs to a real stranger.

**Fix:** gate the fallback on `DATA_MODE === "demo"`. In live mode, let the
error propagate to an error boundary that says the directory is temporarily
unavailable. *This is a one-hour change and it blocks any deployment.*

### 2.2 🔴 The enquiry endpoint is an unauthenticated, unthrottled write

RLS policy `"Anyone can send an enquiry"` grants `INSERT` on `inquiries` to the
`anon` role. That is the right product decision — requiring signup would lose
most buyers — but today there is nothing between the open internet and an
unbounded `INSERT`. No rate limit, no CAPTCHA, no honeypot, no length cap
beyond Zod's 2,000 characters.

**Fix:** must ship with Phase 4 before any public launch.

### 2.3 🟠 Every page view reads the entire dataset

`loadDataset()` issues `select("*")` against `suppliers`, `products` and
`reviews` with no pagination, then filters in Node. At the seed size (26
suppliers, 256 products) that is invisible. At 1,000 suppliers averaging 50
products it is ~50,000 rows marshalled per page view.

**Fix:** Phase 9. The indexes in `0001_schema.sql` are already shaped for it.

### 2.4 🟠 The RFQ line-items feature is half-wired

`Inquiry.items` exists in the types, the schema stores it as `jsonb`, the
dashboard renders "Quantities requested", and the seed data populates it — but
`actions.ts:59` always inserts `items: []`, because the enquiry form has no
line-item UI. Today it is a feature that only works in the demo.

**Fix:** either build the line-item picker (Phase 3) or remove it from the UI
so the dashboard does not advertise data that never arrives.

---

## 3. The roadmap

Twelve phases. Each lists what it unblocks, so you can resequence by priority
rather than by number. Sizes are rough: **S** ≈ 1–2 days, **M** ≈ 3–5 days,
**L** ≈ 1–2 weeks, for one developer.

---

### Phase 0 — Fix what the audit found · **S** · blocks everything

- [ ] Gate the demo fallback on `DATA_MODE` (§2.1)
- [ ] Add `app/error.tsx` and `app/global-error.tsx` with a plain "temporarily unavailable" state
- [ ] Decide on `Inquiry.items`: build it or hide it (§2.4)
- [ ] Add `.github/workflows/ci.yml` — lint, typecheck, test, build on every push

**Done when:** CI is green on the branch and a forced Supabase failure shows an
error page rather than seed data.

---

### Phase 1 — Supabase staging and production · **M** · blocks 2–9

Two projects, never one. `thokbazar-staging` and `thokbazar-prod`, in the
Singapore or Mumbai region for latency to Nepal.

- [ ] Create both projects; record the connection details in a password manager, not the repo
- [ ] Adopt the Supabase CLI so migrations are applied by command, not by pasting SQL:
      `supabase link`, `supabase db push`, `supabase migration new`
- [ ] Apply `0001_schema.sql` and `0002_rls.sql` to staging. **This is the first time either has ever run** — expect to fix syntax and ordering problems
- [ ] Write `supabase/seed.sql` from `src/lib/seed/*` so staging has realistic data
- [ ] Turn on Point-in-Time Recovery on production (it is not on by default)
- [ ] Document the promotion path: migration merged → staging → smoke test → production
- [ ] `.env.staging` / `.env.production`, both git-ignored

**Done when:** `npm run dev` against staging serves real rows from Postgres and
the demo banner is gone.

**Risk:** this is where the ⚠️ rows in §1.3 become real. Budget for the schema
needing changes once it meets actual Postgres.

---

### Phase 2 — Authentication and business accounts · **L** · blocks 3, 5, 6

What exists is the happy path only. The gaps are the unglamorous parts.

- [ ] **Logout** — `signOut()` plus a header account menu
- [ ] **Session-aware header** — avatar and "Dashboard" when signed in
- [ ] **Protected routes** — `/dashboard/*` must redirect anonymous users to `/login?next=…`; today it is public
- [ ] Password reset (`resetPasswordForEmail` + an `/auth/reset` page)
- [ ] Email verification enforced before a listing can be published
- [ ] Wire the `profiles.role` column: set `supplier` on first listing; gate the dashboard on it
- [ ] Ownership transfer / multiple staff per listing — decide now whether a business is one login or many; retrofitting is painful
- [ ] Account deletion (and what happens to the listing)

**Phone OTP:** the right long-term login for Nepal, where email is secondary for
many small business owners. It needs a paid SMS provider (Supabase supports
Twilio, MessageBird, Vonage). Treat as a **separate M** once there is traffic to
justify the cost. Keep email as the fallback — SMS to Nepal is not cheap.

**Done when:** a new user can sign up, verify, create a listing, log out, log
back in, reset a forgotten password, and cannot reach another supplier's
dashboard.

---

### Phase 3 — Supplier product management · **M** · the biggest functional hole

A directory where suppliers cannot edit their own prices is not a directory.
This is the single most valuable phase.

- [ ] `POST`/`PATCH`/`DELETE` Server Actions for products, authorised by `owns_supplier()`
- [ ] Add-product form: name, Nepali name, category, unit, price, bulk price + threshold, min quantity, stock
- [ ] Inline edit in the dashboard price table — editing one price should not be a page navigation
- [ ] Soft delete (`deleted_at`), not hard delete, so an accidental removal is recoverable
- [ ] **Bulk price update** — the feature that actually gets used. A vegetable trader changes 14 prices every morning; one form with 14 number inputs and one save
- [ ] CSV import/export for suppliers with large catalogues
- [ ] "Confirm all prices unchanged" button — one click to refresh `price_updated_at` across the catalogue, keeping freshness dots green honestly
- [ ] Edit the listing itself: description, delivery areas, payment methods, terms, opening hours

**Done when:** a supplier can run their whole catalogue without a developer.

**Note:** the bulk-update and confirm-all items exist because of how the
freshness feature works. Without them, suppliers face a choice between stale
red dots and re-typing their catalogue — and will choose the red dots.

---

### Phase 4 — Spam prevention and rate limiting · **M** · blocks public launch

Nothing exists today (§2.2). Layered, cheapest first:

- [ ] **Honeypot field** on the enquiry and registration forms — catches most naive bots for ~10 lines
- [ ] **Timing check** — reject submissions faster than ~2 seconds
- [ ] **Per-IP rate limit** on enquiry inserts, e.g. 5/hour, 20/day. Upstash Redis, or a Postgres table plus a `check_rate_limit()` function called from an Edge Function
- [ ] **Cloudflare Turnstile** on enquiry and registration — free, no puzzle for real users, far better than reCAPTCHA for low-end Android phones on 3G
- [ ] Move the enquiry `INSERT` from a direct client-role write to an Edge Function that validates Turnstile server-side, then **revoke the `anon` INSERT policy** — otherwise the policy remains bypassable with the public anon key
- [ ] Phone-number validation against real Nepali prefixes (98/97/96 mobile, 01–099 STD)
- [ ] Duplicate suppression: same phone + same supplier within an hour
- [ ] Moderation queue for new listings: auto-publish, but flag listings with free email domains, no PAN, or spammy keywords
- [ ] Abuse reporting on listings and a `reports` table

**Done when:** a scripted flood of 1,000 enquiries results in ≤5 rows.

---

### Phase 5 — Image uploads · **M**

`logo_url`, `cover_url` and `image_url` exist in the schema and the TypeScript
types, and are rendered **nowhere**. The UI currently uses category icons
instead. Decide whether images are worth it — they are, for a directory where
trust is the product, but this is real work.

- [ ] Supabase Storage buckets: `supplier-logos`, `supplier-covers`, `product-images`, with RLS keyed to `owns_supplier()`
- [ ] Client-side resize/compress before upload — Nepali mobile uploads are often 4MB+ on a slow connection; target ≤300KB
- [ ] Accept HEIC from iPhones (convert client-side)
- [ ] Strip EXIF, including GPS
- [ ] Enforce size and MIME type server-side, not only in the picker
- [ ] Render with `next/image`, with the category icon as the fallback
- [ ] Orphan cleanup for images whose row was deleted

**Done when:** a supplier uploads a logo from a phone and it appears on their
card within seconds.

---

### Phase 6 — Admin dashboard and verification · **M**

Today `is_verified` is a manual `UPDATE` with the service-role key. That does
not scale past about ten listings and has no audit trail.

- [ ] `/admin` behind a `profiles.role = 'admin'` check, enforced in RLS as well as the UI
- [ ] Verification queue: pending listings, PAN/VAT document, approve/reject with a reason
- [ ] `verification_requests` table with reviewer id and timestamp — who verified what, and when
- [ ] Document upload for the PAN/VAT certificate, in a **private** Storage bucket
- [ ] Listing moderation: unpublish, edit, merge duplicates
- [ ] Abuse report queue (feeds from Phase 4)
- [ ] Basic metrics: new listings, enquiries sent, top searches, searches with zero results — the last one tells you which categories to recruit into

**Done when:** a non-developer can verify a business end to end.

**Keep the verification bar honest.** `/how-it-works` currently promises only
an identity check — PAN/VAT matches the business name, the phone is answered,
the address is real. Do not let it drift into implying quality assurance.

---

### Phase 7 — Buyer enquiry management · **M**

- [ ] Supplier: change status (`new` → `responded` → `quoted` → `closed`); the RLS policy already exists
- [ ] Supplier: internal notes per enquiry
- [ ] **Email notification on new enquiry** (Resend or Supabase SMTP) — without this the inbox is checked weekly at best
- [ ] **SMS notification** — the one that will actually get read in Nepal; costs money, so make it opt-in per supplier
- [ ] Buyer: "my enquiries" for signed-in buyers; thread by supplier
- [ ] Quote reply: let the supplier respond with line-item prices, so a quote is a record rather than a phone call nobody wrote down
- [ ] Enquiry analytics per listing: received, response rate, median response time — and show median response time publicly on the profile. It is the strongest quality signal a directory can offer, and it is self-reinforcing
- [ ] Auto-close enquiries untouched for 30 days

---

### Phase 8 — Database security and RLS testing · **M** · blocks launch

All 16 policies are ⚠️ untested. Untested authorisation is indistinguishable
from no authorisation.

- [ ] A `pgTAP` suite, or integration tests using two real Supabase clients (supplier A, supplier B), covering at minimum:
  - [ ] Supplier A cannot read supplier B's enquiries
  - [ ] Supplier A cannot edit supplier B's products
  - [ ] An anonymous client cannot read any enquiry
  - [ ] **A supplier cannot set `is_verified = true` on their own listing** — proves the column `REVOKE`
  - [ ] A supplier cannot write `rating_avg` / `rating_count`
  - [ ] A supplier cannot review their own business
  - [ ] An anonymous client cannot insert an enquiry against an inactive listing
  - [ ] `buyer_id` cannot be forged to another user's id
- [ ] Run the suite in CI against a throwaway Supabase branch
- [ ] Verify the service-role key is never bundled client-side — add a build-time grep for `SUPABASE_SERVICE_ROLE_KEY` in `.next/static`
- [ ] Review every `SECURITY DEFINER` function (`owns_supplier`, `handle_new_user`, `refresh_supplier_rating`) for `search_path` pinning — currently set, worth re-checking after any edit
- [ ] Decide the policy on scraping: supplier phone numbers are in the HTML of every profile and will be harvested. Options are to accept it (it is a directory), to require one click to reveal, or to rate-limit by IP. **Tell suppliers which you chose.**
- [ ] Database backups verified by actually restoring one

**Done when:** every row in the checklist above is a passing test, not an opinion.

---

### Phase 9 — Search performance and scalability · **M**

Current design (§2.3) is correct for a few hundred suppliers and wrong beyond that.

- [ ] Move filtering into Postgres: `.eq()`, `.contains()`, `.textSearch()`, `.range()`
- [ ] Keep `src/lib/filters.ts` as the contract — the same test suite should pass against both the in-memory and SQL paths, so behaviour cannot drift
- [ ] Pagination (cursor-based) on `/suppliers` and `/products`
- [ ] Postgres full-text search with a `tsvector` column, a GIN index and a trigger to maintain it. The simple-dictionary indexes in `0001_schema.sql` are a start, not the finish
- [ ] **Nepali-language search.** Postgres has no Devanagari dictionary. Options: `pg_trgm` trigram similarity (handles typos and transliteration poorly but cheaply), or a dedicated engine (Typesense/Meilisearch) if Nepali search becomes a priority
- [ ] Romanised-Nepali synonyms: `kukhura`→chicken, `chamal`→rice, `tarkari`→vegetables. Buyers will type both
- [ ] Spelling tolerance for business names
- [ ] Cache category and district counts (they change rarely, are computed on every home page render)
- [ ] `EXPLAIN ANALYZE` the five most common queries; add indexes from evidence, not guesswork
- [ ] Load test: 10,000 suppliers, 500,000 products, 100 concurrent searches

**Target:** p95 search under 300ms on a 3G connection in Kathmandu.

---

### Phase 10 — SEO · **M** · the main acquisition channel

A directory lives or dies on search. "poultry supplier Kathmandu" should land
on a Thok Bazar category page.

Already done: per-page metadata, `LocalBusiness` JSON-LD on profiles,
`sitemap.ts`, `robots.ts`, semantic HTML, fast static pages.

- [ ] Dynamic sitemap from the database, split into index + child sitemaps past 50k URLs
- [ ] **Programmatic landing pages** — `/suppliers/poultry-eggs/kathmandu` for each viable category × district pair. This is the highest-leverage SEO work for any directory, and the data model already supports it
- [ ] Guard against thin content: only generate a page when it has ≥3 listings
- [ ] `BreadcrumbList` and `ItemList` structured data on listing pages
- [ ] `FAQPage` structured data on `/how-it-works` and `/for-suppliers`
- [ ] Open Graph images per supplier (`opengraph-image.tsx`) — matters for Viber and Facebook sharing, which is how this will actually spread in Nepal
- [ ] Canonical URLs on every filtered view; `noindex` on filter combinations that produce near-duplicates
- [ ] Google Search Console + Bing Webmaster
- [ ] Nepali-language content: `hreflang`, `/ne` routes. Significant work — schedule only once English is ranking
- [ ] Core Web Vitals in the field, not just lab: the home page ships ~250KB of HTML; audit on a real mid-range Android

---

### Phase 11 — Production deployment · **M**

- [ ] **Vercel** is the obvious host for Next.js 16 (Cloudflare Pages and self-hosted Docker both work; Vercel is least friction)
- [ ] Preview deployment per pull request — this replaces the static preview build in `preview/`
- [ ] Staging on `staging.thokbazar.com` → staging Supabase; production on the apex domain → production Supabase
- [ ] `.com.np` domain (requires a Nepali business registration) or a `.com`; register both if the budget allows
- [ ] Environment variables set per environment in the host, never in the repo
- [ ] **Error tracking** — Sentry, with sourcemaps
- [ ] Uptime monitoring that alerts to a phone, plus a status page
- [ ] Analytics: privacy-respecting (Plausible/Umami) over Google Analytics
- [ ] Security headers: CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`
- [ ] A documented rollback: one command, tested at least once
- [ ] **Privacy policy and terms of use** — you are publishing business contact details and collecting buyer phone numbers. Non-optional, and worth a lawyer's hour
- [ ] A takedown process for a business that wants its listing removed

**Launch gate:** Phases 0, 1, 2, 3, 4, 8 complete. Everything else can follow a
live site.

---

### Phase 12 — iOS and Android · **L** · after web traction

The web app is already a usable mobile site. Do not build apps until the web
version has retained users — a directory with no listings is not improved by
being in an app store.

Staged, in order of cost:

1. **PWA first · S.** Manifest, service worker, offline shell, "add to home
   screen". Gets ~80% of the app benefit for ~5% of the cost, and works on the
   low-end Android that dominates the Nepali market.
2. **React Native + Expo · L.** Per your original stack choice, when justified.

What is already portable, with no DOM or Next dependency:

| Module | Contents |
| --- | --- |
| `src/lib/types.ts` | Domain model |
| `src/lib/nepal.ts` | 77 districts, 7 provinces |
| `src/lib/categories.ts` | 16 categories |
| `src/lib/format.ts` | NPR, units, phone links, freshness |
| `src/lib/search.ts` | Text matching |
| `src/lib/filters.ts` | Filtering and sorting |
| `src/lib/validation.ts` | Zod schemas |

To make that reuse real:

- [ ] Extract the seven modules into a `packages/core` workspace consumed by both apps
- [ ] Keep `supabase-js` as the shared data layer — it works unchanged in React Native
- [ ] Native-only concerns: push notifications for enquiries (the strongest reason to build an app at all), contact-book integration, offline price lists, camera upload
- [ ] Deep links so a Viber-shared profile URL opens the app

---

## 4. Suggested sequence

```
Phase 0  Audit fixes + CI          ← start here, 1–2 days
Phase 1  Supabase environments     ← unblocks everything real
Phase 2  Auth and accounts
Phase 3  Product management        ← the biggest functional hole
Phase 8  RLS testing               ← run alongside 2 and 3, not after
Phase 4  Spam and rate limiting    ← must precede any public URL
─────────────────────────── LAUNCH GATE ───────────────────────────
Phase 11 Production deployment
Phase 7  Enquiry management        ← notifications first
Phase 10 SEO                       ← compounding; start early, never stops
Phase 5  Image uploads
Phase 6  Admin and verification    ← manual until ~50 listings
Phase 9  Search scalability        ← when the dataset demands it
Phase 12 PWA, then native
```

Rough total to the launch gate: **6–9 weeks** for one developer, assuming
Phase 1 surfaces the usual crop of first-run schema problems.

---

## 5. Things worth deciding before building

Not code questions — product ones. Each changes what gets built.

1. **Who seeds the first 100 listings?** A directory with no suppliers helps no
   one. Someone has to walk Kalimati and Ason with a phone. The software is the
   easy half.
2. **One login per business, or several staff?** Retrofitting multi-user
   ownership is expensive. Decide in Phase 2.
3. **Does Thok Bazar ever touch money?** Everything above assumes not. Payments,
   escrow or order management would be a different product with a different
   regulatory surface.
4. **What is the verification promise?** Keep it an identity check. The moment
   it reads as a quality guarantee, you own every bad delivery.
5. **Scraped phone numbers:** accept, gate, or throttle. Pick one and tell
   suppliers.
6. **Nepali language:** interface, content, search — three separate projects.
   Which matters first?

---

## Appendix — verification commands

```bash
npm test
```

```bash
npm run lint && npm run typecheck && npm run build
```

```bash
node preview/build.mjs
```
