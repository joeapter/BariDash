create extension if not exists "pgcrypto";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('customer', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM (
      'pending_payment',
      'paid',
      'preparing',
      'delivering',
      'delivered',
      'cancelled',
      'refunded'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_type') THEN
    CREATE TYPE public.discount_type AS ENUM ('percent', 'amount');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_type') THEN
    CREATE TYPE public.delivery_type AS ENUM ('fast_and_free', 'same_day', 'standard');
  END IF;
END $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_he text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_he text not null,
  brand text,
  description_en text,
  description_he text,
  ingredients_en text,
  ingredients_he text,
  price_ils numeric(10, 2) not null,
  sale_price_ils numeric(10, 2),
  stock_qty integer not null default 0,
  same_day_eligible boolean not null default true,
  primary_category_id uuid references public.categories(id),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  product_id uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  name_en text not null,
  name_he text not null,
  fee_ils numeric(10, 2) not null default 0,
  min_order_free_ils numeric(10, 2) not null default 0,
  fast_and_free boolean not null default false,
  estimated_hours integer not null default 5,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  postal_code text,
  notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  address_id uuid references public.addresses(id) on delete set null,
  status public.order_status not null default 'pending_payment',
  subtotal_ils numeric(10, 2) not null default 0,
  delivery_fee_ils numeric(10, 2) not null default 0,
  discount_ils numeric(10, 2) not null default 0,
  total_ils numeric(10, 2) not null default 0,
  delivery_zone_id uuid references public.delivery_zones(id),
  delivery_type public.delivery_type not null default 'fast_and_free',
  delivery_eta timestamptz,
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_en text not null,
  product_name_he text not null,
  unit_price_ils numeric(10, 2) not null,
  quantity integer not null,
  line_total_ils numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.promos (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description_en text,
  description_he text,
  discount_type public.discount_type not null default 'percent',
  discount_value numeric(10, 2) not null default 0,
  min_order_ils numeric(10, 2) not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
