/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#ABDCD3",
        secondary: "#ADC9C4",
        tint: "#E2F3F0",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
