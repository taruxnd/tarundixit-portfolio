-- Note reactions. Run once in Supabase: SQL Editor → Create a new snippet → paste → Run.

-- One row per note + reaction, holding the running count.
create table if not exists public.note_reactions (
  slug text not null check (slug ~ '^[a-z0-9-]{1,120}$'),
  reaction text not null check (reaction in ('seed', 'felt', 'well-put', 'saving', 'smile')),
  count integer not null default 0 check (count >= 0),
  primary key (slug, reaction)
);

-- Recent reactions per visitor (salted IP hash), only used for rate limiting.
create table if not exists public.note_reaction_log (
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists note_reaction_log_idx on public.note_reaction_log (ip_hash, created_at desc);

-- Same lock-down as the guestbook: RLS on, no policies, so only the server's
-- secret key can touch these tables.
alter table public.note_reactions enable row level security;
alter table public.note_reaction_log enable row level security;

-- Atomic +1 / -1, so two visitors reacting at once never lose a count.
create or replace function public.bump_note_reaction(p_slug text, p_reaction text, p_delta integer)
returns integer
language sql
security invoker
set search_path = public
as $$
  insert into public.note_reactions (slug, reaction, count)
  values (p_slug, p_reaction, greatest(p_delta, 0))
  on conflict (slug, reaction)
  do update set count = greatest(public.note_reactions.count + p_delta, 0)
  returning count;
$$;

revoke all on function public.bump_note_reaction(text, text, integer) from public, anon, authenticated;
grant execute on function public.bump_note_reaction(text, text, integer) to service_role;
