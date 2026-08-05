/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#e5e7eb',
        muted: '#6b7280',
        brand: '#1d4ed8',
      },
    },
  },
  plugins: [],
}
