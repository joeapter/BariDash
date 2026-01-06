create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$ language sql stable;

alter table public.profiles enable row level security;
create policy "Profiles read own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "Profiles insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Profiles update own" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

alter table public.categories enable row level security;
create policy "Categories read" on public.categories for select using (true);
create policy "Categories admin" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.products enable row level security;
create policy "Products read" on public.products for select using (true);
create policy "Products admin" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.delivery_zones enable row level security;
create policy "Zones read" on public.delivery_zones for select using (true);
create policy "Zones admin" on public.delivery_zones
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.promos enable row level security;
create policy "Promos read" on public.promos for select using (true);
create policy "Promos admin" on public.promos
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.addresses enable row level security;
create policy "Addresses read own" on public.addresses
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Addresses insert own" on public.addresses
  for insert with check (auth.uid() = user_id);
create policy "Addresses update own" on public.addresses
  for update using (auth.uid() = user_id or public.is_admin());
create policy "Addresses delete own" on public.addresses
  for delete using (auth.uid() = user_id or public.is_admin());

alter table public.cart_items enable row level security;
create policy "Cart read own" on public.cart_items
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Cart insert own" on public.cart_items
  for insert with check (auth.uid() = user_id);
create policy "Cart update own" on public.cart_items
  for update using (auth.uid() = user_id or public.is_admin());
create policy "Cart delete own" on public.cart_items
  for delete using (auth.uid() = user_id or public.is_admin());

alter table public.orders enable row level security;
create policy "Orders read own" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Orders insert own" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "Orders admin update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

alter table public.order_items enable row level security;
create policy "Order items read own" on public.order_items
  for select using (
    public.is_admin() or
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );
create policy "Order items insert own" on public.order_items
  for insert with check (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );
