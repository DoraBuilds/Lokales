-- ============================================================
-- Lokales — Full Database Schema
-- Run this once in the Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";


-- ============================================================
-- TABLES
-- ============================================================

-- User profiles (one per account, auto-created on signup)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  email       text not null,
  phone       text,
  avatar_url  text,
  company_name text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Shopping centers (the parent — a mall or retail strip)
create table public.shopping_centers (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  address     text not null,
  city        text not null,
  province    text not null,
  postal_code text not null,
  country     text not null default 'Spain',
  lat         double precision,
  lng         double precision,
  description text,
  website     text,
  images      text[] default '{}',
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Individual spaces listed inside a shopping center
create table public.listings (
  id                    uuid default uuid_generate_v4() primary key,
  shopping_center_id    uuid references public.shopping_centers(id) on delete cascade not null,
  lister_id             uuid references public.profiles(id) on delete cascade not null,
  title                 text not null,
  description           text not null,
  size_sqm              numeric not null,
  floor_level           text not null default 'ground',
  ceiling_height        numeric,
  frontage_width        numeric,
  windows_count         integer,
  rental_types          text[] not null default '{}',
  price_monthly         numeric,
  price_daily_popup     numeric,
  price_daily_marketing numeric,
  min_days              integer default 1,
  max_days              integer default 365,
  available_from        date not null default current_date,
  status                text not null default 'active'
                          check (status in ('active','paused','rented')),
  images                text[] default '{}',
  amenities             text[] default '{}',
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

-- Inquiries sent by interested renters
create table public.inquiries (
  id                  uuid default uuid_generate_v4() primary key,
  listing_id          uuid references public.listings(id) on delete cascade not null,
  sender_id           uuid references public.profiles(id) on delete set null,
  sender_name         text not null,
  sender_email        text not null,
  sender_phone        text,
  message             text not null,
  rental_type         text not null,
  desired_start_date  date,
  desired_end_date    date,
  status              text not null default 'new'
                        check (status in ('new','read','replied')),
  created_at          timestamptz default now() not null
);

-- Spaces saved/favourited by users
create table public.saved_listings (
  user_id    uuid references public.profiles(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (user_id, listing_id)
);


-- ============================================================
-- INDEXES (for fast search and filtering)
-- ============================================================

create index listings_shopping_center_id_idx on public.listings(shopping_center_id);
create index listings_lister_id_idx          on public.listings(lister_id);
create index listings_status_idx             on public.listings(status);
create index listings_available_from_idx     on public.listings(available_from);
create index shopping_centers_city_idx       on public.shopping_centers(city);
create index inquiries_listing_id_idx        on public.inquiries(listing_id);
create index saved_listings_user_id_idx      on public.saved_listings(user_id);


-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update the updated_at timestamp on any row change
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_shopping_centers
  before update on public.shopping_centers
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_listings
  before update on public.listings
  for each row execute procedure public.handle_updated_at();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Controls who can read/write each row
-- ============================================================

alter table public.profiles        enable row level security;
alter table public.shopping_centers enable row level security;
alter table public.listings        enable row level security;
alter table public.inquiries       enable row level security;
alter table public.saved_listings  enable row level security;

-- Profiles
create policy "Profiles are public"
  on public.profiles for select using (true);

create policy "Users can create their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Shopping centers
create policy "Shopping centers are public"
  on public.shopping_centers for select using (true);

create policy "Logged-in users can add shopping centers"
  on public.shopping_centers for insert with check (auth.uid() is not null);

create policy "Creators can edit their shopping centers"
  on public.shopping_centers for update using (auth.uid() = created_by);

-- Listings
create policy "Active listings are public"
  on public.listings for select
  using (status = 'active' or auth.uid() = lister_id);

create policy "Logged-in users can create listings"
  on public.listings for insert with check (auth.uid() = lister_id);

create policy "Listers can edit their own listings"
  on public.listings for update using (auth.uid() = lister_id);

create policy "Listers can delete their own listings"
  on public.listings for delete using (auth.uid() = lister_id);

-- Inquiries
create policy "Senders and listers can view inquiries"
  on public.inquiries for select
  using (
    auth.uid() = sender_id or
    auth.uid() in (select lister_id from public.listings where id = listing_id)
  );

create policy "Anyone can send an inquiry"
  on public.inquiries for insert with check (true);

create policy "Listers can update inquiry status"
  on public.inquiries for update
  using (auth.uid() in (select lister_id from public.listings where id = listing_id));

-- Saved listings
create policy "Users can view their own saved listings"
  on public.saved_listings for select using (auth.uid() = user_id);

create policy "Users can save a listing"
  on public.saved_listings for insert with check (auth.uid() = user_id);

create policy "Users can unsave a listing"
  on public.saved_listings for delete using (auth.uid() = user_id);


-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

-- Anyone can view listing images and avatars (they're public)
create policy "Listing images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-images');

create policy "Avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Only logged-in users can upload
create policy "Logged-in users can upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.uid() is not null);

create policy "Logged-in users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid() is not null);

-- Users can delete their own uploads
create policy "Users can delete their own listing images"
  on storage.objects for delete
  using (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
