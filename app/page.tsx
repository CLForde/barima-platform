import Link from 'next/link';

export default function Home() {
  return (
    <main
      style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>
          Barima<span style={{ color: '#f97316' }}>Venture</span>
        </div>
        <Link
          href='/login'
          style={{
            background: '#f97316',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Get Started Free
        </Link>
      </nav>

      {/* HERO */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            display: 'inline-block',
            background: 'rgba(249,115,22,0.15)',
            color: '#fb923c',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          🟢 NOW LIVE — Join the platform
        </p>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 auto',
            maxWidth: '700px',
          }}
        >
          Build Your <span style={{ color: '#f97316' }}>Presence,</span>
          <br />
          Grow Your <span style={{ color: '#22c55e' }}>Business.</span>
        </h1>
        <p
          style={{
            marginTop: '24px',
            color: '#94a3b8',
            fontSize: '1.1rem',
            maxWidth: '520px',
            margin: '24px auto 0',
            lineHeight: 1.7,
          }}
        >
          The simplest way to get your business online. No coding, no confusion
          — just your business, looking professional, live in minutes.
        </p>
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href='/login'
            style={{
              background: '#f97316',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            Create Your Website Free
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          flexWrap: 'wrap',
          padding: '40px 24px',
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {[
          { value: '5min', label: 'To go live' },
          { value: '100%', label: 'Free to start' },
          { value: 'GY', label: 'Built for Guyana' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#f97316',
                margin: 0,
              }}
            >
              {stat.value}
            </p>
            <p
              style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: '64px 24px',
          background: '#f8fafc',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: '#f97316',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.1em',
          }}
        >
          HOW IT WORKS
        </p>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '8px 0 48px',
          }}
        >
          3 Simple Steps
        </h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {[
            {
              step: '1',
              title: 'Fill in your details',
              desc: 'Enter your business name, services, and contact info.',
            },
            {
              step: '2',
              title: 'Preview your site',
              desc: 'See exactly how your site will look before going live.',
            },
            {
              step: '3',
              title: 'Publish instantly',
              desc: 'Hit publish and share your link with customers right away.',
            },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '32px 24px',
                width: '260px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#0f172a',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  margin: '0 auto 16px',
                }}
              >
                {item.step}
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#0f172a',
                  margin: '0 0 8px',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: '#0f172a',
          color: 'white',
          textAlign: 'center',
          padding: '64px 24px',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 16px' }}>
          Ready to go live?
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '1rem' }}>
          It takes less than 5 minutes. No credit card required.
        </p>
        <Link
          href='/login'
          style={{
            background: '#f97316',
            color: 'white',
            padding: '14px 36px',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '15px',
            textDecoration: 'none',
          }}
        >
          Build My Site Now
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: 'white',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          padding: '24px',
          fontSize: '13px',
          color: '#94a3b8',
        }}
      >
        © 2026 BarimaVenture. Built in Guyana. All rights reserved.
      </footer>
    </main>
  );
}
