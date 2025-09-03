/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: 'class', // Active le mode sombre avec la classe 'dark'
  theme: {
    extend: {},
  },
  plugins: [],
}

