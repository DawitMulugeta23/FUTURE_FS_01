/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dbu-blue': '#1e40af', // Debre Berhan University concept color
      },
    },
  },
  plugins: [],
}