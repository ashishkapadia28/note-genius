/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eeedff',
          100: '#e0deff',
          200: '#c2bfff',
          300: '#a39fff',
          400: '#8580ff',
          500: '#1b17ff',
          600: '#1512cc',
          700: '#0f0d99',
          800: '#0a0866',
          900: '#050433',
        }
      }
    },
  },
  plugins: [],
}
