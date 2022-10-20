/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('images/hero.svg')",
      },
    },
  },
  plugins: [],
};
