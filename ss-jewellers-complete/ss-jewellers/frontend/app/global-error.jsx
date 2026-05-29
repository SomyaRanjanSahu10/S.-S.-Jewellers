'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log to error tracking service (e.g. Sentry)
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: '#0A0A0A', color: '#FAF6EE', fontFamily: 'Cormorant Garamond, serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚠️</div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '32px', marginBottom: '12px', color: '#C9A84C' }}>
            Something Went Wrong
          </h1>
          <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#888', marginBottom: '32px', lineHeight: 1.8 }}>
            We're sorry for the inconvenience. Our team has been notified and is looking into this.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #8B6914, #C9A84C, #E8CC7A)', color: '#0A0A0A', fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{ padding: '13px 27px', background: 'transparent', color: '#C9A84C', fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', border: '1px solid #C9A84C', textDecoration: 'none' }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
