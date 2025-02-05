/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        off_white: "#E7E6E5",
        ahb_primary: "#EBBEC1",
        ahb_secondary: "#F4E0E1",
        bedingungsbaum_primary: "#E5BD5C",
        bedingungsbaum_secondary: "#F4E2B9",
        ebd_primary: "#8BA2D7",
        ebd_secondary: "#C2CEE9",
        fristenkalender_primary: "#ABDCD3",
        fristenkalender_secondary: "#D4EDE8",
        fristenkalender_tone: "#73B2A5",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
