-- Guestbook schema. Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  company text not null default '' check (char_length(company) <= 60),
  message text not null check (char_length(message) between 1 and 300),
  linkedin text not null default '' check (char_length(linkedin) <= 300),
  photo_url text not null default '',
  -- Salted hash of the visitor's IP, only used for rate limiting.
  ip_hash text not null default '',
  -- Tick this in the Table Editor to take an entry off the wall.
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_wall_idx
  on public.guestbook_entries (created_at desc) where not hidden;
create index if not exists guestbook_entries_rate_idx
  on public.guestbook_entries (ip_hash, created_at desc);

-- No public access at all: the site talks to the table from the server with the
-- secret key, which bypasses RLS. With RLS on and no policies, the public
-- (anon/publishable) key can neither read nor write.
alter table public.guestbook_entries enable row level security;

-- Public bucket for the polaroid photos (readable by URL, writable only by the server).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guestbook', 'guestbook', true, 1048576, array['image/jpeg'])
on conflict (id) do nothing;
