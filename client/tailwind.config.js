/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // University of Windsor Lancer Blue and Gold Color Scheme
        lancer: {
          blue: {
            50: '#E6EBF5',
            100: '#C2D0E8',
            200: '#9AB3DA',
            300: '#7296CC',
            400: '#4A79BE',
            500: '#0033A0', // Primary Lancer Blue
            600: '#002D8F',
            700: '#00267E',
            800: '#001F6D',
            900: '#001859',
          },
          gold: {
            50: '#FFF9E6',
            100: '#FFF0C2',
            200: '#FFE79A',
            300: '#FFDE72',
            400: '#FFD54A',
            500: '#FDBB30', // Primary UWindsor Gold
            600: '#E5A828',
            700: '#CC9520',
            800: '#B38218',
            900: '#996F10',
          },
        },
        // Keep primary and secondary as aliases for easier theming
        primary: {
          50: '#E6EBF5',
          100: '#C2D0E8',
          200: '#9AB3DA',
          300: '#7296CC',
          400: '#4A79BE',
          500: '#0033A0',
          600: '#002D8F',
          700: '#00267E',
          800: '#001F6D',
          900: '#001859',
        },
        secondary: {
          50: '#FFF9E6',
          100: '#FFF0C2',
          200: '#FFE79A',
          300: '#FFDE72',
          400: '#FFD54A',
          500: '#FDBB30',
          600: '#E5A828',
          700: '#CC9520',
          800: '#B38218',
          900: '#996F10',
        },
      },
    },
  },
  plugins: [],
}

