// app/opengraph-image.jsx
// Next.js will automatically generate an OG image from this component
// Served at /opengraph-image.png

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt     = 'S.S. Jewellers — Pure Gold Jewellery Since 1987';
export const size    = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:      '100%',
          height:     '100%',
          display:    'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1200 50%, #0A0A0A 100%)',
          padding:    '60px',
          position:   'relative',
        }}
      >
        {/* Gold border frame */}
        <div style={{
          position: 'absolute', inset: '20px',
          border: '1px solid rgba(201,168,76,0.4)',
          display: 'flex',
        }} />

        {/* Corner accents */}
        {[
          { top: 20, left: 20,   borderWidth: '2px 0 0 2px' },
          { top: 20, right: 20,  borderWidth: '2px 2px 0 0' },
          { bottom: 20, left: 20,  borderWidth: '0 0 2px 2px' },
          { bottom: 20, right: 20, borderWidth: '0 2px 2px 0' },
        ].map((corner, i) => (
          <div key={i} style={{
            position: 'absolute', width: 40, height: 40,
            borderColor: '#C9A84C', borderStyle: 'solid',
            ...corner,
          }} />
        ))}

        {/* Diamond ornament */}
        <div style={{
          width: 50, height: 50,
          background: 'linear-gradient(135deg, #8B6914, #C9A84C, #E8CC7A)',
          transform: 'rotate(45deg)',
          marginBottom: 32,
          boxShadow: '0 0 40px rgba(201,168,76,0.6)',
        }} />

        {/* Brand name */}
        <div style={{
          fontFamily: 'serif',
          fontSize:   72,
          fontWeight: 700,
          color:      '#E8CC7A',
          letterSpacing: 6,
          textAlign:  'center',
          lineHeight: 1.1,
          marginBottom: 12,
        }}>
          S.S. JEWELLERS
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'serif',
          fontSize:   24,
          fontStyle:  'italic',
          color:      'rgba(250,246,238,0.6)',
          letterSpacing: 2,
          textAlign:  'center',
          marginBottom: 32,
        }}>
          Est. 1987 · Hyderabad · Pure Gold · BIS Certified
        </div>

        {/* Gold divider */}
        <div style={{
          width: 200, height: 1,
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          marginBottom: 24,
        }} />

        {/* Bottom text */}
        <div style={{
          fontFamily: 'sans-serif',
          fontSize:   18,
          color:      '#888',
          letterSpacing: 4,
          textTransform: 'uppercase',
          textAlign:  'center',
        }}>
          22K &amp; 24K Gold · Bridal · Rings · Necklaces · Earrings
        </div>
      </div>
    ),
    { ...size }
  );
}
