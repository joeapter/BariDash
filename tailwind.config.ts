import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f8f4',
          100: '#deefe4',
          200: '#b9ddc7',
          300: '#8ec6a5',
          400: '#5dad81',
          500: '#2f8f5f',
          600: '#23744d',
          700: '#1b5b3d',
          800: '#154733',
          900: '#103629'
        },
        leaf: '#6fb07c',
        moss: '#2f6b4f',
        sun: '#f4c95d',
        clay: '#cbe3d4'
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)', 'var(--font-body)']
      },
      boxShadow: {
        soft: '0 12px 30px rgba(16, 54, 41, 0.12)',
        card: '0 10px 40px rgba(16, 54, 41, 0.15)'
      },
      backgroundImage: {
        'leaf-gradient': 'radial-gradient(120% 140% at 10% 10%, #f1f8f4 0%, #d8efe2 45%, #ffffff 100%)',
        'herb-pattern': 'radial-gradient(circle at 1px 1px, rgba(16, 54, 41, 0.08) 1px, transparent 0)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config;
