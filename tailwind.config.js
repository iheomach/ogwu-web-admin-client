/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#450050',
          light: '#F0EBF1',
          mid: '#DED1E0',
        },
        bg: '#FAF7FB',
        grey: {
          900: '#111111',
          700: '#374151',
          500: '#6B7280',
          300: '#D1D5DB',
          100: '#F5F5F5',
        },
        error: { DEFAULT: '#EF4444', light: 'rgba(239,68,68,0.07)' },
        warning: { DEFAULT: '#F59E0B', light: 'rgba(245,158,11,0.07)' },
        urgent: { DEFAULT: '#F97316', light: 'rgba(249,115,22,0.07)' },
        success: { DEFAULT: '#16A34A', light: 'rgba(22,163,74,0.07)' },
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
      },
      boxShadow: {
        glass: '0 4px 14px rgba(69,0,80,0.07)',
        purple: '0 6px 12px rgba(69,0,80,0.28)',
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
