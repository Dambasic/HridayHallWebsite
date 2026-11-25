/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FFFCF7',
          100: '#FFF9F0', // Warm Ivory
          200: '#FAF3E3',
          300: '#F2E7CD',
          400: '#E5D4B0',
          DEFAULT: '#FFF9F0',
        },
        gold: {
          50: '#FCF8EC',
          100: '#F8EFCF',
          200: '#F2DEA2',
          300: '#E8C96A', // Champagne Gold
          400: '#DFBA48',
          500: '#D4A72C', // Metallic Gold
          DEFAULT: '#D4A72C',
          600: '#B88B1E',
          700: '#946D14',
          800: '#735310',
          900: '#4D360B',
        },
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE4E8',
          200: '#F8CBD3',
          300: '#F1A4B3',
          400: '#E6738A',
          500: '#8B1538',
          600: '#650A25', // Deep Burgundy
          700: '#4A071D', // Rich Maroon
          800: '#390014', // Dark Wine
          900: '#26000D',
          950: '#180007',
          DEFAULT: '#650A25',
        },
        maroon: {
          50: '#FDF2F4',
          100: '#FCE4E8',
          200: '#F8CBD3',
          300: '#F1A4B3',
          400: '#C73855',
          500: '#8B1538',
          600: '#650A25', // Deep Burgundy
          700: '#4A071D', // Rich Maroon
          DEFAULT: '#650A25',
          800: '#390014', // Dark Wine
          900: '#26000D',
          950: '#180007',
        },
        charcoal: {
          50: '#F7F6F6',
          100: '#EBE9EA',
          200: '#D8D4D6',
          300: '#BBB5B8',
          400: '#9B9296',
          500: '#7E7479',
          600: '#645B60',
          700: '#4F474C',
          800: '#2A2227',
          900: '#1E161B',
          950: '#120B0F',
          DEFAULT: '#1E161B',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px rgba(212, 167, 44, 0.18)',
        'gold-md': '0 4px 20px rgba(212, 167, 44, 0.28)',
        'gold-lg': '0 10px 30px rgba(212, 167, 44, 0.35)',
        'burgundy-sm': '0 2px 10px rgba(101, 10, 37, 0.22)',
        'burgundy-md': '0 6px 24px rgba(101, 10, 37, 0.32)',
        'maroon-sm': '0 2px 10px rgba(74, 7, 29, 0.25)',
        'maroon-md': '0 6px 24px rgba(74, 7, 29, 0.35)',
        'luxury': '0 20px 40px -15px rgba(57, 0, 20, 0.12)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F8EFCF 0%, #D4A72C 50%, #B88B1E 100%)',
        'burgundy-gradient': 'linear-gradient(135deg, #8B1538 0%, #650A25 50%, #390014 100%)',
        'wine-gradient': 'linear-gradient(135deg, #4A071D 0%, #390014 60%, #180007 100%)',
        'luxury-dark': 'linear-gradient(180deg, rgba(57, 0, 20, 0.92) 0%, rgba(24, 0, 7, 0.98) 100%)',
      },
    },
  },
  plugins: [],
};
