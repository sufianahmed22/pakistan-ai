/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
    './layouts/**/*.{js,jsx}',
    './routes/**/*.{js,jsx}',
    './context/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
    './constants/**/*.{js,jsx}',
    './utils/**/*.{js,jsx}',
    './services/**/*.{js,jsx}',
    './config/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#eafbf3',
          100: '#c9f3dd',
          200: '#96e6bd',
          300: '#5fd39c',
          400: '#2fbb7e',
          500: '#0f9f66',
          600: '#0a7f53', // Pakistan flag green
          700: '#08653F', // primary brand green
          800: '#0a5033',
          900: '#0a4128',
          950: '#04241682',
        },
        charcoal: {
          50: '#f4f5f6',
          100: '#e4e6e8',
          200: '#c6cbd0',
          300: '#a1a8b0',
          400: '#7a828c',
          500: '#5c636d',
          600: '#454b53',
          700: '#333840',
          800: '#20242b',
          900: '#14171c',
          950: '#0a0c0f',
        },
        gold: {
          50: '#fbf7ec',
          100: '#f5ecc9',
          200: '#ecd894',
          300: '#e0bf5e',
          400: '#d6ab3e',
          500: '#c4922c',
          600: '#a37423',
          700: '#7f5a1f',
          800: '#68491f',
          900: '#573d1d',
        },
        offwhite: '#faf9f6',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(10, 20, 15, 0.15)',
        glass: '0 8px 32px 0 rgba(10, 20, 15, 0.2)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
