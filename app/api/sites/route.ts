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

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function slugifySiteName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
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

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof getSupabaseWithUser>>['supabase'],
  siteName: string,
) {
  const baseSlug = slugifySiteName(siteName) || `site-${crypto.randomUUID()}`;
  let slug = baseSlug;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: existing } = await supabase
      .from('sites')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function GET() {
  const { supabase, user } = await getSupabaseWithUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('sites')
    .select('id, site_name, slug, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: 'Failed to load sites' }, { status: 500 });
  }

  return Response.json(data ?? []);
}

export async function POST(req: Request) {
  const { supabase, user } = await getSupabaseWithUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as SitePayload;
  const siteName = normalizeText(body.siteName);
  const about = normalizeText(body.about);

  if (!siteName) {
    return Response.json({ error: 'Site name required' }, { status: 400 });
  }

  if (!about) {
    return Response.json({ error: 'About section required' }, { status: 400 });
  }

  const slug = await generateUniqueSlug(supabase, siteName);
  const services = normalizeServices(body.services);

  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: user.id,
      site_name: siteName,
      slug,
      about,
      hero_image: normalizeText(body.heroImage),
      services,
      phone: normalizeText(body.phone),
      whatsapp: normalizeText(body.whatsapp),
      location: normalizeText(body.location),
      opening_hours: normalizeText(body.openingHours),
      google_maps_url: normalizeText(body.googleMapsUrl),
    })
    .select('id, slug')
    .single();

  if (error || !data) {
    console.error(error);
    return Response.json({ error: 'Failed to create site' }, { status: 500 });
  }

  revalidatePath('/dashboard');
  revalidatePath(`/sites/${data.slug}`);

  return Response.json({ id: data.id, slug: data.slug }, { status: 201 });
}
