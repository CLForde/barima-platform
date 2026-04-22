import { createSupabaseServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Service = {
  name: string;
  description: string;
  price?: string;
  image?: string;
};

type Site = {
  id: string;
  site_name: string;
  slug: string;
  about: string;
  hero_image?: string;
  services: Service[];
  phone?: string;
  whatsapp?: string;
  location?: string;
  opening_hours?: string;
  google_maps_url?: string;
};

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!site) notFound();

  const s = site as Site;

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}>
      {/* HEADER */}
      <div style={{ background: '#0f172a', color: 'white', position: 'relative' }}>
        {s.hero_image ? (
          <>
            <img
              src={s.hero_image}
              alt={s.site_name}
              style={{
                width: '100%',
                height: '340px',
                objectFit: 'cover',
                display: 'block',
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '28px',
                left: '28px',
                right: '28px',
              }}
            >
              <h1
                style={{
                  fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                {s.site_name}
              </h1>
              {s.about && (
                <p
                  style={{
                    marginTop: '10px',
                    color: '#cbd5e1',
                    maxWidth: '600px',
                    lineHeight: 1.7,
                    fontSize: '15px',
                  }}
                >
                  {s.about}
                </p>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: '60px 28px' }}>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                fontWeight: 800,
                margin: 0,
              }}
            >
              {s.site_name}
            </h1>
            {s.about && (
              <p
                style={{
                  marginTop: '12px',
                  color: '#cbd5e1',
                  maxWidth: '600px',
                  lineHeight: 1.7,
                  fontSize: '15px',
                }}
              >
                {s.about}
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* SERVICES */}
        {s.services && s.services.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '24px',
              }}
            >
              Services
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {s.services.map((service, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'white',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  )}
                  <div style={{ padding: '20px 24px' }}>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: '#0f172a',
                        margin: '0 0 6px',
                      }}
                    >
                      {service.name}
                    </h3>
                    {service.price && (
                      <p
                        style={{
                          color: '#0369a1',
                          fontWeight: 600,
                          fontSize: '14px',
                          margin: '0 0 10px',
                        }}
                      >
                        {service.price}
                      </p>
                    )}
                    {service.description && (
                      <p
                        style={{
                          color: '#475569',
                          fontSize: '14px',
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        {(s.phone ||
          s.whatsapp ||
          s.location ||
          s.opening_hours ||
          s.google_maps_url) && (
          <section
            style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '20px',
              }}
            >
              Contact
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontSize: '15px',
                color: '#334155',
              }}
            >
              {s.phone && (
                <p style={{ margin: 0 }}>
                  <strong>Phone: </strong>
                  <a href={`tel:${s.phone}`} style={{ color: '#0f172a' }}>
                    {s.phone}
                  </a>
                </p>
              )}
              {s.whatsapp && (
                <p style={{ margin: 0 }}>
                  <strong>WhatsApp: </strong>
                  <a
                    href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#16a34a', fontWeight: 600 }}
                  >
                    {s.whatsapp}
                  </a>
                </p>
              )}
              {s.location && (
                <p style={{ margin: 0 }}>
                  <strong>Location: </strong>
                  {s.location}
                </p>
              )}
              {s.opening_hours && (
                <div>
                  <strong>Hours:</strong>
                  <p
                    style={{
                      margin: '6px 0 0',
                      whiteSpace: 'pre-line',
                      color: '#475569',
                    }}
                  >
                    {s.opening_hours}
                  </p>
                </div>
              )}
              {s.google_maps_url && (
                <p style={{ margin: 0 }}>
                  <a
                    href={s.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', fontWeight: 600 }}
                  >
                    View on Google Maps →
                  </a>
                </p>
              )}
            </div>
          </section>
        )}
      </div>

      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          padding: '24px',
          fontSize: '12px',
          color: '#94a3b8',
          marginTop: '40px',
        }}
      >
        Powered by{' '}
        <strong style={{ color: '#f97316' }}>BarimaVenture</strong>
      </footer>
    </main>
  );
}
