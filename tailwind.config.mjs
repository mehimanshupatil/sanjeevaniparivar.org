/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // =============================================
      // BRAND COLOR SCHEME — change these to retheme
      // =============================================
      colors: {
        primary: {
          DEFAULT: '#C41E3A',   // Deep Red (logo red)
          light:   '#E8324D',
          dark:    '#9B1530',
        },
        secondary: {
          DEFAULT: '#1B7A1B',   // Forest Green (logo green)
          light:   '#2CA02C',
          dark:    '#145714',
        },
        accent: {
          DEFAULT: '#F5C518',   // Golden Yellow (logo shield)
          light:   '#FFFDE7',
          dark:    '#D4A017',
        },
        // Kshetra colors
        education:     '#1565C0',
        environment:   '#2E7D32',
        health:        '#C62828',
        enlightenment: '#6A1B9A',
      },
      fontFamily: {
        sans: [
          'Noto Sans Devanagari',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl2: '1.5rem',
        xl3: '2rem',
      },
      animation: {
        'scroll-dot': 'scrollDot 1.6s ease-in-out infinite',
        'fade-up':    'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        scrollDot: {
          '0%':   { top: '6px', opacity: '1' },
          '100%': { top: '20px', opacity: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
