/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        cream: '#fff8f0',
        rose: '#e8a0a8',
        'rose-deep': '#c97b84',
        gold: '#d4a574',
        ink: '#2d2a2a',
        paper: '#fdf6ed',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, /* avoid conflicting with Mantine base styles */
  },
};
