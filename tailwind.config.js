/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // if you have Next.js / app folder
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'mbp13': '1280px',   // MacBook Pro 13" 2015
      'mba13': '1440px',   // MacBook Air 13" 2013
    },
  },
  plugins: [],
}
