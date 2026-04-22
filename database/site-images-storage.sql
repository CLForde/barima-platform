-- Run this in the Supabase SQL Editor.
-- It creates a public bucket for site images and allows authenticated users
-- to upload/update/delete files while keeping public reads enabled.

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update
set public = true;

drop policy if exists "site_images_public_read" on storage.objects;
create policy "site_images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'site-images');

drop policy if exists "site_images_auth_insert" on storage.objects;
create policy "site_images_auth_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-images');

drop policy if exists "site_images_auth_update" on storage.objects;
create policy "site_images_auth_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-images')
with check (bucket_id = 'site-images');

drop policy if exists "site_images_auth_delete" on storage.objects;
create policy "site_images_auth_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-images');
