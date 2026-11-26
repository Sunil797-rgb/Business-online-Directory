-- =============================================================================
-- Thok Bazar — core schema
-- =============================================================================
-- Run against a fresh Supabase project:
--   supabase db push
-- or paste into the SQL editor in the Supabase dashboard.
--
-- Design notes:
--  * Categories and districts are stored as slugs (text), not foreign keys to
--    lookup tables. They are a fixed, versioned list that ships with the app
--    (src/lib/categories.ts, src/lib/nepal.ts), so keeping them in code avoids
--    a join on every query and keeps the two in step.
--  * Money is numeric(12,2) in NPR. Never float.
--  * Supplier terms and opening hours are jsonb — they are read as a whole
--    document and never queried field by field.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- profiles — one row per auth user
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'buyer'
              check (role in ('buyer', 'supplier', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Application profile attached to each auth.users row.';

-- Create a profile automatically whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- suppliers
-- -----------------------------------------------------------------------------
create table if not exists public.suppliers (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  owner_id           uuid references public.profiles (id) on delete set null,

  business_name      text not null,
  business_name_ne   text,
  category_slugs     text[] not null default '{}',
  tagline            text not null default '',
  description        text not null default '',
  established_year   integer check (established_year between 1900 and 2100),

  -- Nepali business registration
  pan_vat_no         text check (pan_vat_no ~ '^[0-9]{9}$'),
  registration_no    text,

  logo_url           text,
  cover_url          text,

  phone              text not null,
  phone_alt          text,
  whatsapp           text,
  viber              text,
  email              text,
  website            text,

  address_line       text not null default '',
  landmark           text,
  city               text not null default '',
  district_slug      text not null,
  province_id        smallint not null check (province_id between 1 and 7),

  min_order_amount   numeric(12,2) check (min_order_amount >= 0),
  delivery_available boolean not null default false,
  delivery_areas     text[] not null default '{}',
  delivery_note      text,
  lead_time_hours    integer check (lead_time_hours >= 0),

  payment_methods    text[] not null default '{}',
  credit_terms       text,
  -- [{ "title": "...", "body": "..." }]
  terms              jsonb not null default '[]'::jsonb,
  -- [{ "day": 0, "open": "06:00", "close": "18:00" }]
  opening_hours      jsonb not null default '[]'::jsonb,

  is_verified        boolean not null default false,
  is_active          boolean not null default true,
  rating_avg         numeric(2,1) not null default 0 check (rating_avg between 0 and 5),
  rating_count       integer not null default 0 check (rating_count >= 0),

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on column public.suppliers.terms is
  'Supplier-authored terms of sale, as an ordered array of {title, body}.';
comment on column public.suppliers.is_verified is
  'PAN/VAT and phone checked by Thok Bazar. NOT a quality guarantee.';

create index if not exists suppliers_district_idx    on public.suppliers (district_slug) where is_active;
create index if not exists suppliers_province_idx    on public.suppliers (province_id)   where is_active;
create index if not exists suppliers_categories_idx  on public.suppliers using gin (category_slugs);
create index if not exists suppliers_owner_idx       on public.suppliers (owner_id);
create index if not exists suppliers_rating_idx      on public.suppliers (is_verified desc, rating_avg desc) where is_active;

-- Full-text search across the parts of a listing a buyer would type.
create index if not exists suppliers_search_idx on public.suppliers
  using gin (to_tsvector('simple',
    coalesce(business_name, '') || ' ' ||
    coalesce(tagline, '')       || ' ' ||
    coalesce(description, '')   || ' ' ||
    coalesce(city, '')
  ));

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  supplier_id       uuid not null references public.suppliers (id) on delete cascade,

  name              text not null,
  name_ne           text,
  description       text,
  category_slug     text not null,
  brand             text,

  unit              text not null
                    check (unit in ('kg','gram','litre','ml','piece','dozen','crate',
                                    'carton','sack','bora','packet','bottle','bundle','tin')),
  price             numeric(12,2) not null check (price >= 0),
  bulk_price        numeric(12,2) check (bulk_price >= 0),
  bulk_min_quantity integer check (bulk_min_quantity > 0),
  min_quantity      integer not null default 1 check (min_quantity > 0),

  in_stock          boolean not null default true,
  image_url         text,
  price_updated_at  timestamptz not null default now(),

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- A bulk price only makes sense with the quantity that unlocks it.
  constraint products_bulk_pair check (
    (bulk_price is null and bulk_min_quantity is null)
    or (bulk_price is not null and bulk_min_quantity is not null)
  )
);

create index if not exists products_supplier_idx on public.products (supplier_id);
create index if not exists products_category_idx on public.products (category_slug);
create index if not exists products_price_idx    on public.products (category_slug, price);
create index if not exists products_search_idx   on public.products
  using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(brand, '')));

-- Stamp price_updated_at only when the price actually moves, so the freshness
-- indicator means "this rate was confirmed", not "this row was touched".
create or replace function public.touch_product_price()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if new.price is distinct from old.price
     or new.bulk_price is distinct from old.bulk_price then
    new.price_updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists products_touch_price on public.products;
create trigger products_touch_price
  before update on public.products
  for each row execute function public.touch_product_price();

-- -----------------------------------------------------------------------------
-- reviews
-- -----------------------------------------------------------------------------
create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  supplier_id     uuid not null references public.suppliers (id) on delete cascade,
  author_id       uuid references public.profiles (id) on delete set null,
  author_name     text not null,
  author_business text,
  rating          smallint not null check (rating between 1 and 5),
  comment         text not null default '',
  created_at      timestamptz not null default now(),

  -- One review per buyer per supplier.
  unique (supplier_id, author_id)
);

create index if not exists reviews_supplier_idx on public.reviews (supplier_id, created_at desc);

-- Keep the denormalised rating on suppliers in step with the reviews table.
create or replace function public.refresh_supplier_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.supplier_id, old.supplier_id);
begin
  update public.suppliers s
  set rating_avg = coalesce(round(agg.avg_rating::numeric, 1), 0),
      rating_count = coalesce(agg.n, 0)
  from (
    select avg(rating) as avg_rating, count(*) as n
    from public.reviews
    where supplier_id = target
  ) agg
  where s.id = target;
  return null;
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_supplier_rating();

-- -----------------------------------------------------------------------------
-- inquiries — a buyer asking a supplier to quote
-- -----------------------------------------------------------------------------
create table if not exists public.inquiries (
  id             uuid primary key default gen_random_uuid(),
  supplier_id    uuid not null references public.suppliers (id) on delete cascade,
  buyer_id       uuid references public.profiles (id) on delete set null,

  buyer_name     text not null,
  buyer_business text,
  buyer_type     text not null default 'restaurant'
                 check (buyer_type in ('restaurant','cafe','hotel','bakery',
                                       'catering','retailer','other')),
  phone          text not null,
  email          text,
  message        text not null,
  -- [{ "productId": "...", "name": "...", "quantity": 60, "unit": "kg" }]
  items          jsonb not null default '[]'::jsonb,

  status         text not null default 'new'
                 check (status in ('new','responded','quoted','closed')),
  created_at     timestamptz not null default now()
);

create index if not exists inquiries_supplier_idx on public.inquiries (supplier_id, created_at desc);
create index if not exists inquiries_buyer_idx    on public.inquiries (buyer_id);

-- -----------------------------------------------------------------------------
-- favorites — buyers bookmarking suppliers
-- -----------------------------------------------------------------------------
create table if not exists public.favorites (
  buyer_id    uuid not null references public.profiles (id) on delete cascade,
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (buyer_id, supplier_id)
);

-- -----------------------------------------------------------------------------
-- Shared updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch  on public.profiles;
create trigger profiles_touch  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists suppliers_touch on public.suppliers;
create trigger suppliers_touch before update on public.suppliers
  for each row execute function public.touch_updated_at();
