/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        off_white: "#E7E6E5",
        ahb_primary: "#ff569c",
        ahb_secondary: "#F4E0E1",
        ahb_tone: "#ebbec1",
        bedingungsbaum_primary: "#e5bd5c",
        bedingungsbaum_secondary: "#F4E2B9",
        ebd_primary: "#8BA2D7",
        ebd_secondary: "#C2CEE9",
        fristenkalender_primary: "#abdcd3",
        fristenkalender_secondary: "#D4EDE8",
        fristenkalender_tone: "#73B2A5",
        weichesschwarz: "#25241D",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
