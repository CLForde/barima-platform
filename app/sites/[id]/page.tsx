import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function SitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const services = (data.services || []).filter(
    (s: { name?: string; description?: string }) =>
      s.name?.trim() || s.description?.trim(),
  );

  const whatsappNumber = (data.whatsapp || data.phone || '').replace(/\D/g, '');

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        margin: 0,
        padding: 0,
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(12px)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>
          {data.site_name}
        </span>
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target='_blank'
            rel='noopener noreferrer'
            style={{
              background: '#22c55e',
              color: 'white',
              padding: '8px 18px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            💬 WhatsApp
          </a>
        )}
      </nav>

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          minHeight: '520px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#0f172a',
        }}
      >
        {data.hero_image && (
          <img
            src={data.hero_image}
            alt='Hero'
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.85,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.4) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            padding: '48px 24px',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 900,
              color: 'white',
              margin: 0,
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            {data.site_name}
          </h1>
          <p
            style={{
              marginTop: '20px',
              color: 'rgba(255,255,255,0.88)',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              lineHeight: 1.7,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}
          >
            {data.about}
          </p>
          <div
            style={{
              marginTop: '36px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: '#22c55e',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
                }}
              >
                💬 WhatsApp Us
              </a>
            )}
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                📞 Call Us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section
          style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 24px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p
              style={{
                color: '#f97316',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.1em',
                margin: '0 0 8px',
              }}
            >
              WHAT WE OFFER
            </p>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Our Services
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                services.length === 1
                  ? '360px'
                  : services.length === 2
                    ? 'repeat(2, 1fr)'
                    : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              justifyContent: 'center',
            }}
          >
            {services.map(
              (
                service: {
                  name: string;
                  description: string;
                  price?: string;
                  image?: string;
                },
                i: number,
              ) => (
                <div
                  key={i}
                  style={{
                    background: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: '220px',
                        background: 'linear-gradient(135deg, #e2e8f0, #f1f5f9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        fontSize: '14px',
                      }}
                    >
                      🛠️ Service
                    </div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <h3
                      style={{
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: '#0f172a',
                        margin: 0,
                      }}
                    >
                      {service.name}
                    </h3>
                    {service.price && (
                      <p
                        style={{
                          color: '#f97316',
                          fontSize: '14px',
                          fontWeight: 700,
                          margin: '8px 0 0',
                        }}
                      >
                        {service.price}
                      </p>
                    )}
                    <p
                      style={{
                        marginTop: '10px',
                        color: '#475569',
                        fontSize: '14px',
                        lineHeight: 1.7,
                        margin: '10px 0 0',
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section style={{ background: 'white', padding: '72px 24px' }}>
        <div
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <p
            style={{
              color: '#f97316',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.1em',
              margin: '0 0 8px',
            }}
          >
            GET IN TOUCH
          </p>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 40px',
            }}
          >
            Contact Us
          </h2>
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              textAlign: 'left',
            }}
          >
            {data.phone && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <span style={{ fontSize: '20px' }}>📞</span>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Phone
                  </p>
                  <p style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>
                    {data.phone}
                  </p>
                </div>
              </div>
            )}
            {data.whatsapp && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <span style={{ fontSize: '20px' }}>💬</span>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    WhatsApp
                  </p>
                  <p style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>
                    {data.whatsapp}
                  </p>
                </div>
              </div>
            )}
            {data.location && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <span style={{ fontSize: '20px' }}>📍</span>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Location
                  </p>
                  <p style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>
                    {data.location}
                  </p>
                  {data.google_maps_url && (
                    <a
                      href={data.google_maps_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{
                        color: '#f97316',
                        fontSize: '13px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        marginTop: '4px',
                        display: 'inline-block',
                      }}
                    >
                      View on Google Maps →
                    </a>
                  )}
                </div>
              </div>
            )}
            {data.opening_hours && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '20px' }}>🕒</span>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Opening Hours
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: '#0f172a',
                      fontWeight: 600,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {data.opening_hours}
                  </p>
                </div>
              </div>
            )}
          </div>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                display: 'inline-block',
                marginTop: '32px',
                background: '#22c55e',
                color: 'white',
                padding: '14px 36px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '15px',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
              }}
            >
              💬 Message Us on WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: '#0f172a',
          color: '#64748b',
          textAlign: 'center',
          padding: '24px',
          fontSize: '13px',
        }}
      >
        © {new Date().getFullYear()} {data.site_name} · Powered by{' '}
        <span style={{ color: '#f97316', fontWeight: 600 }}>BarimaVenture</span>
      </footer>
    </main>
  );
}
