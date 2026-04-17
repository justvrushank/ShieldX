/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22C55E',
          light: 'rgba(34,197,94,0.15)',
          dark: '#16A34A',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: 'rgba(245,158,11,0.12)',
        },
        success: {
          DEFAULT: '#22C55E',
          light: 'rgba(34,197,94,0.12)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: 'rgba(245,158,11,0.12)',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: 'rgba(239,68,68,0.12)',
        },
        grey: {
          50: '#1E293B',
          100: '#334155',
          200: '#475569',
          300: '#64748B',
          400: '#94A3B8',
          500: '#CBD5E1',
          900: '#F1F5F9',
        },
        slate: {
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.4)',
        md: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
        lg: '0 10px 24px rgba(0,0,0,0.45), 0 4px 8px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        pill: '999px',
        input: '12px',
      },
    },
  },
  plugins: [],
}

