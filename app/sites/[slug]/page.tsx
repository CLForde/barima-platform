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

function formatWhatsAppLink(value: string) {
  return `https://wa.me/${value.replace(/\D/g, '')}`;
}

function getIntroText(site: Site) {
  if (site.about?.trim()) {
    return site.about;
  }

  return `${site.site_name} is live and ready to impress. Explore services, check availability, and reach out with confidence.`;
}

function getTopDescription(site: Site) {
  if (site.about?.trim()) {
    return site.about.trim();
  }

  return 'Professional services, presented with confidence.';
}

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
  const serviceCount = s.services?.length || 0;
  const hasContactInfo =
    !!s.phone ||
    !!s.whatsapp ||
    !!s.location ||
    !!s.opening_hours ||
    !!s.google_maps_url;

  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        background:
          'radial-gradient(circle at top left, rgba(251,146,60,0.18), transparent 30%), linear-gradient(180deg, #f7f4ee 0%, #ffffff 28%, #fffdf9 100%)',
        color: '#0f172a',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <style>{`
        .site-shell {
          min-height: 100vh;
          padding-top: 76px;
        }

        .hero-wrap {
          position: relative;
          min-height: 78vh;
          display: flex;
          align-items: flex-end;
          color: white;
          background:
            linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.70) 45%, rgba(234, 88, 12, 0.48) 100%);
        }

        .hero-media {
          position: absolute;
          inset: 0;
        }

        .hero-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: saturate(1.12) contrast(1.02);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.12) 0%, rgba(15, 23, 42, 0.28) 32%, rgba(15, 23, 42, 0.78) 100%),
            radial-gradient(circle at 15% 18%, rgba(251, 146, 60, 0.24), transparent 24%),
            radial-gradient(circle at 82% 18%, rgba(56, 189, 248, 0.16), transparent 22%);
        }

        .topbar-shell {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 20;
          width: 100%;
        }

        .topbar {
          width: 100%;
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr) auto;
          gap: 16px;
          align-items: center;
          padding: 14px 24px;
          background: rgba(15, 23, 42, 0.78);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 40px rgba(15,23,42,0.18);
        }

        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .logo-mark {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(251,146,60,0.94), rgba(249,115,22,0.94));
          color: white;
          font-size: 1rem;
          font-weight: 900;
          flex-shrink: 0;
        }

        .logo-copy {
          color: white;
          font-size: 0.96rem;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .topbar-copy {
          text-align: center;
          color: rgba(248,250,252,0.82);
          font-size: 0.93rem;
          line-height: 1.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .topbar-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 800;
          color: white;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 14px 28px rgba(34,197,94,0.24);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 48px 24px 56px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(16px);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #fde68a;
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.18);
        }

        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #f97316;
          box-shadow: 0 0 0 6px rgba(249,115,22,0.18);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(320px, 0.82fr);
          gap: 28px;
          align-items: end;
          margin-top: 24px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(2.8rem, 7vw, 5.7rem);
          line-height: 0.94;
          letter-spacing: -0.06em;
          font-weight: 900;
          text-wrap: balance;
          max-width: 11ch;
          text-shadow: 0 18px 36px rgba(15,23,42,0.28);
        }

        .hero-title-main {
          display: inline;
          color: #ffffff;
        }

        .hero-title span {
          color: #f97316;
        }

        .hero-copy {
          margin-top: 22px;
          max-width: 680px;
          font-size: clamp(1rem, 1.8vw, 1.16rem);
          line-height: 1.8;
          color: rgba(248, 250, 252, 0.88);
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }

        .hero-action,
        .hero-action-muted {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 22px;
          border-radius: 18px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .hero-action {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          box-shadow: 0 22px 48px rgba(249,115,22,0.34);
        }

        .hero-action-muted {
          background: rgba(255,255,255,0.12);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(14px);
        }

        .hero-action:hover,
        .hero-action-muted:hover {
          transform: translateY(-2px);
        }

        .hero-panel {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.20);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 24px 80px rgba(2, 6, 23, 0.28);
          animation: floatPanel 6.5s ease-in-out infinite;
        }

        .panel-label {
          display: inline-flex;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #fde68a;
        }

        .panel-title {
          margin: 14px 0 10px;
          font-size: 1.35rem;
          font-weight: 800;
          color: white;
        }

        .panel-text {
          margin: 0;
          font-size: 0.98rem;
          line-height: 1.75;
          color: rgba(248, 250, 252, 0.82);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .stat-card {
          padding: 16px 14px;
          border-radius: 20px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.12);
          text-align: left;
        }

        .stat-value {
          display: block;
          font-size: 1.4rem;
          font-weight: 900;
          color: white;
        }

        .stat-label {
          display: block;
          margin-top: 6px;
          font-size: 0.78rem;
          line-height: 1.4;
          color: rgba(226,232,240,0.82);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .content-shell {
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: -40px auto 0;
          padding: 0 24px 72px;
        }

        .section {
          margin-top: 28px;
        }

        .section-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 20px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ea580c;
        }

        .eyebrow::before {
          content: '';
          width: 28px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f97316, #fb7185);
        }

        .section-title {
          margin: 10px 0 0;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1;
          letter-spacing: -0.04em;
          font-weight: 900;
          color: #0f172a;
        }

        .section-subtitle {
          margin: 0;
          max-width: 520px;
          font-size: 0.98rem;
          line-height: 1.7;
          color: #475569;
        }

        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .service-card {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          background: linear-gradient(180deg, rgba(255,255,255,1), rgba(255,245,235,0.98));
          border: 1px solid rgba(251,146,60,0.26);
          box-shadow: 0 18px 48px rgba(249,115,22,0.10);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 58px rgba(15,23,42,0.14);
        }

        .service-media {
          position: relative;
          height: 230px;
          background:
            radial-gradient(circle at top left, rgba(251,146,60,0.32), transparent 26%),
            linear-gradient(135deg, #0f172a, #1d4ed8 42%, #38bdf8 100%);
        }

        .service-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .service-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.58));
        }

        .service-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.22);
          border: 1px solid rgba(255,255,255,0.26);
          color: white;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
        }

        .service-body {
          padding: 24px;
        }

        .service-name {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0f172a 0%, #ea580c 48%, #f97316 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .service-price {
          display: inline-flex;
          margin-top: 14px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(249,115,22,0.18);
          color: #ea580c;
          font-size: 0.9rem;
          font-weight: 900;
        }

        .service-description {
          margin: 16px 0 0;
          font-size: 1rem;
          line-height: 1.78;
          color: #1e293b;
          font-weight: 700;
        }

        .contact-card {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          padding: 34px;
          background:
            radial-gradient(circle at top right, rgba(56,189,248,0.14), transparent 28%),
            linear-gradient(135deg, #fff7ed, #ffffff 48%, #eff6ff 100%);
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 22px 60px rgba(15,23,42,0.10);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 22px;
        }

        .contact-tile {
          display: block;
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,0.84);
          border: 1px solid rgba(226,232,240,0.9);
          text-decoration: none;
          color: inherit;
          box-shadow: 0 12px 30px rgba(15,23,42,0.06);
        }

        .contact-tile-label {
          display: block;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #f97316;
        }

        .contact-tile-value {
          display: block;
          margin-top: 10px;
          font-size: 1.08rem;
          line-height: 1.6;
          font-weight: 700;
          color: #0f172a;
        }

        .contact-tile-note {
          display: block;
          margin-top: 10px;
          font-size: 0.92rem;
          line-height: 1.6;
          color: #475569;
        }

        .cta-strip {
          margin-top: 26px;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .cta-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 20px;
          border-radius: 18px;
          text-decoration: none;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          box-shadow: 0 18px 42px rgba(15,23,42,0.22);
        }

        .cta-link.alt {
          color: #0f172a;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(148,163,184,0.28);
          box-shadow: none;
        }

        .footer {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px 44px;
        }

        .footer-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 24px;
          border-radius: 24px;
          background: #0f172a;
          color: rgba(255,255,255,0.78);
          box-shadow: 0 20px 48px rgba(15,23,42,0.18);
        }

        .footer-brand {
          color: white;
          font-weight: 800;
        }

        .footer-brand span {
          color: #fb923c;
        }

        @keyframes floatPanel {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-0.4deg);
          }
        }

        @media (max-width: 900px) {
          .topbar {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .topbar-copy {
            text-align: left;
            white-space: normal;
          }

          .hero-grid,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .hero-panel {
            max-width: 560px;
          }

          .section-header,
          .footer-card {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .topbar-shell {
            width: 100%;
          }

          .topbar {
            padding: 14px 16px;
            gap: 12px;
          }

          .hero-wrap {
            min-height: 72vh;
          }

          .hero-content {
            padding: 32px 20px 44px;
          }

          .content-shell,
          .footer {
            padding-left: 20px;
            padding-right: 20px;
          }

          .contact-card {
            padding: 24px;
          }

          .service-body,
          .contact-tile {
            padding: 18px;
          }
        }
      `}</style>

      <div className='site-shell'>
        <div className='topbar-shell'>
          <div className='topbar'>
            <div className='topbar-logo'>
              <div className='logo-mark'>
                {s.site_name.trim().slice(0, 2).toUpperCase()}
              </div>
              <div className='logo-copy'>{s.site_name}</div>
            </div>

            <div className='topbar-copy'>{getTopDescription(s)}</div>

            {s.whatsapp ? (
              <a
                className='topbar-action'
                href={formatWhatsAppLink(s.whatsapp)}
                target='_blank'
                rel='noopener noreferrer'
              >
                WhatsApp
              </a>
            ) : (
              <div />
            )}
          </div>
        </div>

        <section className='hero-wrap'>
          <div className='hero-media'>
            {s.hero_image ? (
              <img src={s.hero_image} alt={s.site_name} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background:
                    'radial-gradient(circle at top left, rgba(251,146,60,0.32), transparent 26%), linear-gradient(135deg, #111827, #1e293b 42%, #334155 100%)',
                }}
              />
            )}
            <div className='hero-overlay' />
          </div>

          <div className='hero-content'>
            <div className='hero-badge'>
              <span className='hero-dot' />
              Live Business Profile
            </div>

            <div className='hero-grid'>
              <div>
                <h1 className='hero-title'>
                  <span className='hero-title-main'>{s.site_name}</span>{' '}
                  <span>Online</span>
                </h1>
                <p className='hero-copy'>{getIntroText(s)}</p>

                <div className='hero-actions'>
                  {s.phone && (
                    <a className='hero-action' href={`tel:${s.phone}`}>
                      Call Now
                    </a>
                  )}
                  {s.whatsapp && (
                    <a
                      className='hero-action-muted'
                      href={formatWhatsAppLink(s.whatsapp)}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      WhatsApp
                    </a>
                  )}
                  {s.google_maps_url && (
                    <a
                      className='hero-action-muted'
                      href={s.google_maps_url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Find Us
                    </a>
                  )}
                </div>
              </div>

              <div className='hero-panel'>
                <span className='panel-label'>Built to Stand Out</span>
                <h2 className='panel-title'>Professional, vibrant, and ready to win trust.</h2>
                <p className='panel-text'>
                  This page gives customers a strong first impression, clear
                  service visibility, and direct ways to contact the business.
                </p>

                <div className='hero-stats'>
                  <div className='stat-card'>
                    <span className='stat-value'>{serviceCount}</span>
                    <span className='stat-label'>Services listed</span>
                  </div>
                  <div className='stat-card'>
                    <span className='stat-value'>{hasContactInfo ? 'Ready' : 'Live'}</span>
                    <span className='stat-label'>Customer contact</span>
                  </div>
                  <div className='stat-card'>
                    <span className='stat-value'>24/7</span>
                    <span className='stat-label'>Online presence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className='content-shell'>
          {s.services && s.services.length > 0 && (
            <section className='section'>
              <div className='section-header'>
                <div>
                  <span className='eyebrow'>Featured Work</span>
                  <h2 className='section-title'>Services That Get Attention</h2>
                </div>
                <p className='section-subtitle'>
                  A sharper presentation helps visitors understand the offer
                  fast and gives the page a stronger premium feel.
                </p>
              </div>

              <div className='service-grid'>
                {s.services.map((service, i) => (
                  <article key={i} className='service-card'>
                    <div className='service-media'>
                      {service.image ? (
                        <img src={service.image} alt={service.name} />
                      ) : null}
                      <div className='service-overlay' />
                      <span className='service-badge'>Service {i + 1}</span>
                    </div>

                    <div className='service-body'>
                      <h3 className='service-name'>{service.name}</h3>
                      {service.price && (
                        <span className='service-price'>{service.price}</span>
                      )}
                      {service.description && (
                        <p className='service-description'>
                          {service.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {hasContactInfo && (
            <section className='section'>
              <div className='section-header'>
                <div>
                  <span className='eyebrow'>Direct Contact</span>
                  <h2 className='section-title'>Let Customers Reach You Fast</h2>
                </div>
                <p className='section-subtitle'>
                  Clear contact actions make the page feel polished, helpful,
                  and ready for real business.
                </p>
              </div>

              <div className='contact-card'>
                <div className='contact-grid'>
                  {s.phone && (
                    <a className='contact-tile' href={`tel:${s.phone}`}>
                      <span className='contact-tile-label'>Phone</span>
                      <span className='contact-tile-value'>{s.phone}</span>
                      <span className='contact-tile-note'>
                        Tap to call directly.
                      </span>
                    </a>
                  )}

                  {s.whatsapp && (
                    <a
                      className='contact-tile'
                      href={formatWhatsAppLink(s.whatsapp)}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <span className='contact-tile-label'>WhatsApp</span>
                      <span className='contact-tile-value'>{s.whatsapp}</span>
                      <span className='contact-tile-note'>
                        Start a conversation instantly.
                      </span>
                    </a>
                  )}

                  {s.location && (
                    <div className='contact-tile'>
                      <span className='contact-tile-label'>Location</span>
                      <span className='contact-tile-value'>{s.location}</span>
                      <span className='contact-tile-note'>
                        Make it easier for visitors to find you.
                      </span>
                    </div>
                  )}

                  {s.opening_hours && (
                    <div className='contact-tile'>
                      <span className='contact-tile-label'>Hours</span>
                      <span
                        className='contact-tile-value'
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {s.opening_hours}
                      </span>
                    </div>
                  )}
                </div>

                <div className='cta-strip'>
                  {s.google_maps_url && (
                    <a
                      className='cta-link'
                      href={s.google_maps_url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      View on Google Maps
                    </a>
                  )}
                  {s.whatsapp && (
                    <a
                      className='cta-link alt'
                      href={formatWhatsAppLink(s.whatsapp)}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Message on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        <footer className='footer'>
          <div className='footer-card'>
            <div>
              <div className='footer-brand'>
                {s.site_name} powered by <span>BarimaVenture</span>
              </div>
              <div style={{ marginTop: 6, fontSize: '0.94rem' }}>
                Built to make a stronger first impression online.
              </div>
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              Live page for <strong style={{ color: 'white' }}>{s.site_name}</strong>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
