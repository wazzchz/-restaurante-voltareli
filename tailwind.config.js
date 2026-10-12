/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Brand: warm amber/ochre extracted from Voltareli logo ──────
        // Primary accent #C2410C (ochre ember). Text-safe deep #9A3412
        // hits 7.5:1 on porcelain (AAA). Muted #FB923C for text on obsidian.
        primary: {
          DEFAULT: '#C2410C',
          bright: '#D97706',
          deep: '#9A3412',
          soft: '#FEF3E8',
          muted: '#FB923C',
        },
        canvas: {
          porcelain: '#FAFAFA',
          card: '#FFFFFF',
          sand: '#F4F1EA',
          obsidian: '#09090B',
          coal: '#131316',
        },
        ink: {
          DEFAULT: '#18181B',
          soft: '#52525B',
          faint: '#A1A1AA',
          line: '#E7E2D6',
        },
        gold: '#C9A227',
        open: '#16A34A',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(9,9,11,.06), 0 16px 40px -20px rgba(9,9,11,.25)',
        pop: '0 16px 40px -12px rgba(194,65,12,.45)',
        float: '0 24px 60px -16px rgba(9,9,11,.35)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up .6s cubic-bezier(.22,1,.36,1) both',
      },
    },
  },
  plugins: [],
};
