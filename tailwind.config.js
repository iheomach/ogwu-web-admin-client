/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#7b4dd9',
          glow: '#b8a0f5',
          light: 'rgba(123,77,217,0.12)',
          mid: 'rgba(123,77,217,0.25)',
        },
        bg: '#080412',
        bgMid: '#0f0620',
        grey: {
          900: 'rgba(255,255,255,0.93)',
          700: 'rgba(255,255,255,0.72)',
          500: 'rgba(255,255,255,0.48)',
          300: 'rgba(255,255,255,0.28)',
          100: 'rgba(255,255,255,0.07)',
        },
        error: { DEFAULT: '#FF6B6B', light: 'rgba(255,107,107,0.18)' },
        warning: { DEFAULT: '#FFB347', light: 'rgba(255,179,71,0.18)' },
        urgent: { DEFAULT: '#FF8C42', light: 'rgba(255,140,66,0.18)' },
        success: { DEFAULT: '#4ADE80', light: 'rgba(74,222,128,0.18)' },
        /* Landing-page specific tokens */
        lp: {
          heading: '#1A1A2E',
          body: '#5A5A72',
          accent: '#F3EAF4',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
      boxShadow: {
        glass: '0 8px 24px rgba(0,0,0,0.35)',
        purple: '0 6px 14px rgba(123,77,217,0.40)',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"San Francisco"',
          '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
