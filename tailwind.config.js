/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#ABDCD3",
        secondary: "#D4EDE8",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
