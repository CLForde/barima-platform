'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

type Site = {
  id: string;
  site_name: string;
  slug: string;
  created_at: string;
};

export default function DashboardClient({
  user,
  sites: initialSites,
}: {
  user: { email?: string };
  sites: Site[];
}) {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/sites/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setSites((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Could not delete the site. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* NAV */}
      <nav
        style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
          Barima<span style={{ color: '#f97316' }}>Venture</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            style={{
              background: '#f1f5f9',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div
        style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
            }}
          >
            My Sites
          </h1>
          <Link
            href='/dashboard/site-builder'
            style={{
              background: '#f97316',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            + Create New Site
          </Link>
        </div>

        {sites.length === 0 ? (
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
            }}
          >
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              You haven&apos;t created a site yet.
            </p>
            <Link
              href='/dashboard/site-builder'
              style={{
                background: '#f97316',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Create Your First Site
            </Link>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {sites.map((site) => (
              <div
                key={site.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                {/* Site info */}
                <div>
                  <h2
                    style={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#0f172a',
                      margin: '0 0 4px',
                    }}
                  >
                    {site.site_name}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Created{' '}
                    {new Date(site.created_at).toLocaleDateString('en-GY', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Action buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  {/* View live site */}
                  <a
                    href={`/sites/${site.slug}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    View Site ↗
                  </a>

                  {/* Edit site */}
                  <Link
                    href={`/dashboard/edit/${site.id}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    Edit
                  </Link>

                  {/* Delete site */}
                  <button
                    onClick={() => handleDelete(site.id, site.site_name)}
                    disabled={deletingId === site.id}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: '#fff1f2',
                      color: '#e11d48',
                      border: '1px solid #fecdd3',
                      cursor:
                        deletingId === site.id ? 'not-allowed' : 'pointer',
                      opacity: deletingId === site.id ? 0.6 : 1,
                    }}
                  >
                    {deletingId === site.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
