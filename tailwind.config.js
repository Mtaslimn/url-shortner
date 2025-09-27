/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Panchang", "sans-serif"],
      },
    },
  },
  plugins: [],
};