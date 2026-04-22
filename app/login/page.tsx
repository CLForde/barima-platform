'use client';

import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px 40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: '1.5rem',
            color: '#0f172a',
            marginBottom: '8px',
          }}
        >
          Barima<span style={{ color: '#f97316' }}>Venture</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
          Sign in to create and manage your business site
        </p>
        <button
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '14px 24px',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '15px',
            color: '#0f172a',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <img
            src='https://www.google.com/favicon.ico'
            alt='Google'
            style={{ width: '20px', height: '20px' }}
          />
          Continue with Google
        </button>
      </div>
    </main>
  );
}
