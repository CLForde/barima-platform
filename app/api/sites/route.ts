import { supabase } from '@/lib/supabase';

type Service = {
  name: string;
  description: string;
  price?: string;
  image?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cleanedServices: Service[] = (body.services || []).filter(
      (s: Service) =>
        s.name?.trim() || s.description?.trim() || s.price?.trim() || s.image,
    );

    const { data, error } = await supabase
      .from('sites')
      .insert([
        {
          site_name: body.siteName,
          about: body.about,
          hero_image: body.heroImage,
          services: cleanedServices,
          phone: body.phone,
          whatsapp: body.whatsapp,
          location: body.location,
          opening_hours: body.openingHours,
          google_maps_url: body.googleMapsUrl,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return Response.json({ error: 'Database error' }, { status: 500 });
    }
    const inserted = data?.[0];

    if (!inserted) {
      return Response.json({ error: 'Insert failed' }, { status: 500 });
    }

    return Response.json({ id: inserted.id });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
