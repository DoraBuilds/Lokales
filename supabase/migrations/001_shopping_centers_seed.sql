-- ============================================================
-- Migration 001 — Shopping centers: seed columns + province stats + search
-- Run once in the Supabase SQL Editor
-- ============================================================

-- 1. New columns on shopping_centers
alter table public.shopping_centers
  add column if not exists shops_count  integer,
  add column if not exists center_type  text,
  add column if not exists year_opened  integer,
  add column if not exists owner        text;

-- 2. Make postal_code and address nullable / default (seeded data may not have them)
alter table public.shopping_centers
  alter column postal_code drop not null;

alter table public.shopping_centers
  alter column address set default '';

-- 3. Unique constraint so upsert works cleanly
alter table public.shopping_centers
  drop constraint if exists shopping_centers_name_city_key;

alter table public.shopping_centers
  add constraint shopping_centers_name_city_key unique (name, city);

-- 4. Province / autonomous-community stats table
create table if not exists public.province_stats (
  id                   uuid default uuid_generate_v4() primary key,
  autonomous_community text not null unique,
  centers_count        integer,
  total_sba_sqm        numeric,
  total_shops_count    integer,
  created_at           timestamptz default now() not null,
  updated_at           timestamptz default now() not null
);

alter table public.province_stats enable row level security;

drop policy if exists "Province stats are public" on public.province_stats;
create policy "Province stats are public"
  on public.province_stats for select using (true);

create trigger set_updated_at_province_stats
  before update on public.province_stats
  for each row execute procedure public.handle_updated_at();

-- 5. Trigram indexes for fast partial-word search
create extension if not exists pg_trgm;

drop index if exists shopping_centers_name_trgm_idx;
drop index if exists shopping_centers_city_trgm_idx;

create index shopping_centers_name_trgm_idx
  on public.shopping_centers using gin (name gin_trgm_ops);

create index shopping_centers_city_trgm_idx
  on public.shopping_centers using gin (city gin_trgm_ops);

-- 6. Lock down direct user inserts (service role bypasses RLS automatically)
drop policy if exists "Logged-in users can add shopping centers" on public.shopping_centers;
