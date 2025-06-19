/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#011627",      // blackish
        positive: "#23F0C7",        // greenish
        yellowish: "#f7b32b",       // yellowish (headings)
        negative: "#f72c25",        // red (negative)
        blue: "#78c3fb",            // blue (secondary headings/text)
      },
    },
  },
  plugins: [],
};
