/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF7EE',
          100: '#F6EED8',
          200: '#ECDDB0',
          300: '#DFC682',
          400: '#D2AC55',
          500: '#B88B2E',
          600: '#946B21',
          700: '#6E4D18',
          800: '#483111',
          900: '#2E1D08',
        },
        peanut: {
          light: '#F5E6CA',
          DEFAULT: '#D4A373',
          dark: '#A97142',
        },
        jaggery: {
          50: '#F7F3F0',
          100: '#ECE2DB',
          200: '#DAC5B7',
          300: '#C2A38F',
          400: '#9E7259',
          500: '#754B33',
          600: '#5C3823',
          700: '#4A2A17',
          800: '#381C0E',
          900: '#261108',
        },
        cream: {
          50: '#FCFBF9',
          100: '#FAF7F2',
          200: '#F4ECE1',
          300: '#ECE0CE',
          DEFAULT: '#FAF6EE',
        },
        warmOrange: {
          DEFAULT: '#EA580C',
          hover: '#C2410C',
          light: '#FFF7ED',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(74, 42, 23, 0.08)',
        warm: '0 10px 30px -4px rgba(74, 42, 23, 0.12)',
        glow: '0 0 25px rgba(217, 119, 6, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
