/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs}"],
  theme: {
    extend: {
      colors: {
        airbnb: {
          DEFAULT: '#FF385C',
          dark: '#E31C5F',
          light: '#FF5A5F',
        },
      },
      fontFamily: {
        sans: ['Circular', 'Cereal', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      maxWidth: {
        'screen-2xl': '1760px',
      },
    },
  },
  plugins: [],
}

