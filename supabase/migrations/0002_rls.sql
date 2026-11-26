-- =============================================================================
-- Thok Bazar — row level security
-- =============================================================================
-- The directory is public: anyone, signed in or not, can read active listings,
-- their products and their reviews. Everything that writes is locked to the
-- owner of the row.
--
-- The one asymmetry worth noting: inquiries are insert-by-anyone (a restaurant
-- owner should not need an account to ask for a quote) but read-only-by-the-
-- supplier-they-were-sent-to.
-- =============================================================================

alter table public.profiles  enable row level security;
alter table public.suppliers enable row level security;
alter table public.products  enable row level security;
alter table public.reviews   enable row level security;
alter table public.inquiries enable row level security;
alter table public.favorites enable row level security;

-- -----------------------------------------------------------------------------
-- Helper: does the current user own this supplier?
-- -----------------------------------------------------------------------------
create or replace function public.owns_supplier(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.suppliers
    where id = target and owner_id = auth.uid()
  );
$$;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
drop policy if exists "Profiles are readable by their owner" on public.profiles;
create policy "Profiles are readable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- suppliers
-- -----------------------------------------------------------------------------
drop policy if exists "Active listings are public" on public.suppliers;
create policy "Active listings are public"
  on public.suppliers for select
  using (is_active or owner_id = auth.uid());

drop policy if exists "Signed-in users can create a listing" on public.suppliers;
create policy "Signed-in users can create a listing"
  on public.suppliers for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Owners update their listing" on public.suppliers;
create policy "Owners update their listing"
  on public.suppliers for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Owners delete their listing" on public.suppliers;
create policy "Owners delete their listing"
  on public.suppliers for delete
  to authenticated
  using (owner_id = auth.uid());

-- NOTE: is_verified must never be settable by the owner. Revoke the column
-- from the public roles so only the service role (our admin tooling) can flip
-- it, regardless of what the update policy allows.
revoke update (is_verified) on public.suppliers from anon, authenticated;
revoke update (rating_avg, rating_count) on public.suppliers from anon, authenticated;

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
drop policy if exists "Products of active listings are public" on public.products;
create policy "Products of active listings are public"
  on public.products for select
  using (
    exists (
      select 1 from public.suppliers s
      where s.id = products.supplier_id
        and (s.is_active or s.owner_id = auth.uid())
    )
  );

drop policy if exists "Owners manage their products" on public.products;
create policy "Owners manage their products"
  on public.products for all
  to authenticated
  using (public.owns_supplier(supplier_id))
  with check (public.owns_supplier(supplier_id));

-- -----------------------------------------------------------------------------
-- reviews
-- -----------------------------------------------------------------------------
drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public"
  on public.reviews for select
  using (true);

drop policy if exists "Signed-in users write their own review" on public.reviews;
create policy "Signed-in users write their own review"
  on public.reviews for insert
  to authenticated
  with check (
    author_id = auth.uid()
    -- A supplier cannot review themselves.
    and not public.owns_supplier(supplier_id)
  );

drop policy if exists "Authors edit their own review" on public.reviews;
create policy "Authors edit their own review"
  on public.reviews for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "Authors delete their own review" on public.reviews;
create policy "Authors delete their own review"
  on public.reviews for delete
  to authenticated
  using (author_id = auth.uid());

-- -----------------------------------------------------------------------------
-- inquiries
-- -----------------------------------------------------------------------------
-- Anyone may send an enquiry — requiring an account here would lose most of
-- the buyers the directory exists to serve.
drop policy if exists "Anyone can send an enquiry" on public.inquiries;
create policy "Anyone can send an enquiry"
  on public.inquiries for insert
  to anon, authenticated
  with check (
    -- Only to a live listing, and you cannot forge someone else's buyer_id.
    exists (select 1 from public.suppliers s where s.id = supplier_id and s.is_active)
    and (buyer_id is null or buyer_id = auth.uid())
  );

drop policy if exists "Suppliers read their own enquiries" on public.inquiries;
create policy "Suppliers read their own enquiries"
  on public.inquiries for select
  to authenticated
  using (public.owns_supplier(supplier_id) or buyer_id = auth.uid());

drop policy if exists "Suppliers update enquiry status" on public.inquiries;
create policy "Suppliers update enquiry status"
  on public.inquiries for update
  to authenticated
  using (public.owns_supplier(supplier_id))
  with check (public.owns_supplier(supplier_id));

-- -----------------------------------------------------------------------------
-- favorites
-- -----------------------------------------------------------------------------
drop policy if exists "Users manage their own favorites" on public.favorites;
create policy "Users manage their own favorites"
  on public.favorites for all
  to authenticated
  using (buyer_id = auth.uid())
  with check (buyer_id = auth.uid());
