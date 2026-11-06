/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gym: {
          primary: "#BE3144",
          "primary-dark": "#8F1D2C",
          "primary-light": "#D84A5D",
          background: "#000000",
          card: "#0A0A0A",
          "card-secondary": "#121212",
          "border-dark": "#1F1F1F",
          "border-muted": "#27272A",
          muted: "#71717A",
        },
      },
    },
  },
  plugins: [],
};


