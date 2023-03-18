/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dubereats: {
          primary: '#1D3770',
          dark: '#1e185b',
          dark2: '#153e96',
          secondary: '#276282',
          light: '#9eb3c2',
          light2: '#3f89bf',
          accent: '#16ba34',
          accent2: '#098e22',
        },
      },
    },
  },
  plugins: [],
};
