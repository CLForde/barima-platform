import { createSupabaseServerClient } from '@/lib/supabase-server';
import { redirect, notFound } from 'next/navigation';
import EditClient from './EditClient';

export const dynamic = 'force-dynamic';

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!site) notFound();

  const emptyService = () => ({
    name: '',
    price: '',
    description: '',
    image: '',
  });

  const services =
    site.services && site.services.length > 0
      ? [
          ...site.services,
          ...Array(Math.max(0, 3 - site.services.length))
            .fill(null)
            .map(emptyService),
        ].slice(0, 3)
      : [emptyService(), emptyService(), emptyService()];

  return (
    <EditClient
      siteId={site.id}
      siteSlug={site.slug}
      initialData={{
        siteName: site.site_name || '',
        about: site.about || '',
        heroImage: site.hero_image || '',
        services,
        phone: site.phone || '',
        whatsapp: site.whatsapp || '',
        location: site.location || '',
        openingHours: site.opening_hours || '',
        googleMapsUrl: site.google_maps_url || '',
      }}
    />
  );
}
