import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

type Service = {
  name?: string;
  description?: string;
  price?: string;
  image?: string;
};

type SitePayload = {
  siteName?: string;
  about?: string;
  heroImage?: string;
  services?: Service[];
  phone?: string;
  whatsapp?: string;
  location?: string;
  openingHours?: string;
  googleMapsUrl?: string;
};

type SiteUpdateData = {
  site_name: string;
  about: string;
  hero_image: string;
  services: Array<{
    name?: string;
    description?: string;
    price?: string;
    image?: string;
  }>;
  phone: string;
  whatsapp: string;
  location: string;
  opening_hours: string;
  google_maps_url: string;
};

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeServices(services: SitePayload['services']) {
  if (!Array.isArray(services)) {
    return [];
  }

  return services
    .map((service) => ({
      name: normalizeText(service?.name),
      description: normalizeText(service?.description),
      price: normalizeText(service?.price),
      image: normalizeText(service?.image),
    }))
    .filter(
      (service) =>
        service.name ||
        service.description ||
        service.price ||
        service.image,
    );
}

async function getSupabaseWithUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

function buildUpdateData(body: SitePayload): SiteUpdateData {
  return {
    site_name: normalizeText(body.siteName),
    about: normalizeText(body.about),
    hero_image: normalizeText(body.heroImage),
    services: normalizeServices(body.services),
    phone: normalizeText(body.phone),
    whatsapp: normalizeText(body.whatsapp),
    location: normalizeText(body.location),
    opening_hours: normalizeText(body.openingHours),
    google_maps_url: normalizeText(body.googleMapsUrl),
  };
}

function snapshotForCompare(site: Record<string, unknown> | null) {
  if (!site) {
    return null;
  }

  return {
    site_name: normalizeText(site.site_name),
    about: normalizeText(site.about),
    hero_image: normalizeText(site.hero_image),
    services: normalizeServices(
      Array.isArray(site.services) ? (site.services as Service[]) : [],
    ),
    phone: normalizeText(site.phone),
    whatsapp: normalizeText(site.whatsapp),
    location: normalizeText(site.location),
    opening_hours: normalizeText(site.opening_hours),
    google_maps_url: normalizeText(site.google_maps_url),
  };
}

function sameSnapshot(
  current: ReturnType<typeof snapshotForCompare>,
  next: SiteUpdateData,
) {
  if (!current) {
    return false;
  }

  return (
    current.site_name === next.site_name &&
    current.about === next.about &&
    current.hero_image === next.hero_image &&
    current.phone === next.phone &&
    current.whatsapp === next.whatsapp &&
    current.location === next.location &&
    current.opening_hours === next.opening_hours &&
    current.google_maps_url === next.google_maps_url &&
    JSON.stringify(current.services) === JSON.stringify(next.services)
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { supabase, user } = await getSupabaseWithUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { supabase, user } = await getSupabaseWithUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as SitePayload;
  const siteName = normalizeText(body.siteName);

  if (!siteName) {
    return Response.json({ error: 'Site name required' }, { status: 400 });
  }

  const { data: existing, error: existingError } = await supabase
    .from('sites')
    .select(
      'id, slug, site_name, about, hero_image, services, phone, whatsapp, location, opening_hours, google_maps_url',
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (existingError || !existing) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const updateData = buildUpdateData(body);

  if (sameSnapshot(snapshotForCompare(existing), updateData)) {
    return Response.json({
      slug: existing.slug,
      saved: true,
      changed: false,
    });
  }

  const { data: updatedRow, error } = await supabase
    .from('sites')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select(
      'id, slug, site_name, about, hero_image, services, phone, whatsapp, location, opening_hours, google_maps_url',
    )
    .maybeSingle();

  if (error) {
    console.error(error);
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }

  const updated = updatedRow
    ? updatedRow
    : (
        await supabase
          .from('sites')
          .select(
            'id, slug, site_name, about, hero_image, services, phone, whatsapp, location, opening_hours, google_maps_url',
          )
          .eq('id', id)
          .eq('user_id', user.id)
          .single()
      ).data;

  if (!updated) {
    return Response.json({ error: 'Updated site could not be reloaded' }, { status: 500 });
  }

  if (!sameSnapshot(snapshotForCompare(updated), updateData)) {
    console.error('Site update did not persist', {
      siteId: id,
      userId: user.id,
      expected: updateData,
      actual: snapshotForCompare(updated),
    });

    return Response.json(
      {
        error:
          'Update did not persist. This is usually a Supabase row-permission issue.',
      },
      { status: 409 },
    );
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/edit/${id}`);
  revalidatePath(`/sites/${updated.slug || existing.slug}`);

  return Response.json({
    slug: updated.slug || existing.slug,
    saved: true,
    changed: true,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { supabase, user } = await getSupabaseWithUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }

  return Response.json({ success: true });
}
