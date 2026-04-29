-- Kosmiczny Śmieciarz — initial cloud schema
-- Run this once in Supabase Dashboard → SQL Editor → "New query" → paste → Run.
-- Idempotent: bezpiecznie uruchomić ponownie.

------------------------------------------------------------
-- 1. saves: cloud sync postępu gracza
------------------------------------------------------------
create table if not exists public.saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.saves enable row level security;

drop policy if exists "saves: own select" on public.saves;
create policy "saves: own select" on public.saves
  for select using (auth.uid() = user_id);

drop policy if exists "saves: own insert" on public.saves;
create policy "saves: own insert" on public.saves
  for insert with check (auth.uid() = user_id);

drop policy if exists "saves: own update" on public.saves;
create policy "saves: own update" on public.saves
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "saves: own delete" on public.saves;
create policy "saves: own delete" on public.saves
  for delete using (auth.uid() = user_id);

------------------------------------------------------------
-- 2. runs: leaderboard finalistów
------------------------------------------------------------
create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null check (char_length(display_name) between 1 and 40),
  finished_at timestamptz not null default now(),
  correct int not null check (correct >= 0),
  errors int not null check (errors >= 0),
  time_seconds int not null check (time_seconds >= 0),
  ending_choice text not null check (ending_choice in ('collect','refuse')),
  helena_passed boolean not null default false,
  f17b_solved boolean not null default false,
  arbiter_clues int not null default 0 check (arbiter_clues between 0 and 7)
);

create index if not exists runs_time_idx on public.runs(time_seconds asc);
create index if not exists runs_finished_idx on public.runs(finished_at desc);

alter table public.runs enable row level security;

-- Public leaderboard read
drop policy if exists "runs: public select" on public.runs;
create policy "runs: public select" on public.runs
  for select using (true);

-- Insert: zalogowany owner OR anonimowy (user_id = null) — by każdy gracz mógł zapisać wynik
drop policy if exists "runs: own or anon insert" on public.runs;
create policy "runs: own or anon insert" on public.runs
  for insert with check (
    user_id is null or auth.uid() = user_id
  );

-- Update/delete tylko własne (anon nie ma jak)
drop policy if exists "runs: own update" on public.runs;
create policy "runs: own update" on public.runs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "runs: own delete" on public.runs;
create policy "runs: own delete" on public.runs
  for delete using (auth.uid() = user_id);

------------------------------------------------------------
-- 3. Aggregate view dla "Helena stats" na finale
------------------------------------------------------------
create or replace view public.helena_stats with (security_invoker = true) as
select
  count(*) filter (where helena_passed) as passed,
  count(*) filter (where not helena_passed) as failed,
  count(*) as total
from public.runs;

-- security_invoker = true: view runs with caller's privileges, respecting RLS on runs.

------------------------------------------------------------
-- 4. Indeks dla "auth.users.email" — Supabase już ma, brak akcji.
------------------------------------------------------------

------------------------------------------------------------
-- Helpers do testowania (DELETE wszystkie wiersze):
--   delete from public.saves;
--   delete from public.runs;
------------------------------------------------------------
