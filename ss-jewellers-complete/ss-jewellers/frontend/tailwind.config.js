/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8CC7A',
          pale:    '#F5E6B8',
          dark:    '#8B6914',
          muted:   'rgba(201,168,76,0.15)',
        },
        obsidian:  '#0A0A0A',
        charcoal:  '#141414',
        carbon:    '#1C1C1C',
        slate:     '#2A2A2A',
        ash:       '#3D3D3D',
        fog:       '#888888',
        cream:     '#FAF6EE',
        ivory:     '#F5EFE0',
        ruby:      '#8B1A1A',
        emerald:   '#1A4A2E',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        serif:   ['Cormorant Garamond', 'serif'],
        sans:    ['Raleway', 'sans-serif'],
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(90deg, #8B6914 0%, #E8CC7A 40%, #C9A84C 60%, #8B6914 100%)',
        'gold-gradient': 'linear-gradient(135deg, #8B6914, #C9A84C, #E8CC7A, #C9A84C)',
        'dark-radial': 'radial-gradient(ellipse at center, #1C1C1C 0%, #0A0A0A 100%)',
      },
      animation: {
        'shimmer':      'shimmer 4s linear infinite',
        'float':        'float 6s ease-in-out infinite',
        'spin-slow':    'spin 30s linear infinite',
        'fade-up':      'fadeUp 0.7s ease forwards',
        'ticker':       'ticker 30s linear infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer:    { '0%': { backgroundPosition: '200% center' }, '100%': { backgroundPosition: '-200% center' } },
        float:      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        fadeUp:     { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        ticker:     { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseGlow:  { '0%,100%': { boxShadow: '0 0 30px rgba(201,168,76,0.5)' }, '50%': { boxShadow: '0 0 60px rgba(201,168,76,0.8)' } },
      },
      boxShadow: {
        'gold':      '0 8px 30px rgba(201,168,76,0.3)',
        'gold-lg':   '0 20px 60px rgba(201,168,76,0.4)',
        'dark':      '0 20px 60px rgba(0,0,0,0.6)',
        'dark-lg':   '0 30px 80px rgba(0,0,0,0.8)',
      },
      borderColor: {
        'gold-subtle': 'rgba(201,168,76,0.15)',
        'gold-medium': 'rgba(201,168,76,0.3)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
};
