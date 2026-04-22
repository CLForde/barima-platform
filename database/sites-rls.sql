-- Run this in the Supabase SQL Editor for the Barima Platform project.
-- It creates secure row-level policies so each logged-in user can create,
-- read, update, and delete only their own sites.

alter table public.sites enable row level security;

drop policy if exists "sites_select_own" on public.sites;
create policy "sites_select_own"
on public.sites
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "sites_insert_own" on public.sites;
create policy "sites_insert_own"
on public.sites
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "sites_update_own" on public.sites;
create policy "sites_update_own"
on public.sites
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "sites_delete_own" on public.sites;
create policy "sites_delete_own"
on public.sites
for delete
to authenticated
using (auth.uid() = user_id);

-- Optional: if you want public visitors to view live sites without logging in,
-- keep this policy as well.
drop policy if exists "sites_public_read_by_slug" on public.sites;
create policy "sites_public_read_by_slug"
on public.sites
for select
to anon, authenticated
using (slug is not null);
