/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#ffffff",
          text: "#000000",
          primary: "#1d4ed8",
        },
        dark: {
          background: "#1a202c",
          text: "#f7fafc",
          primary: "#3b82f6",
        },
      },
      backgroundImage: {
        "gradient-light":
          "linear-gradient(to bottom right, #e0f7fa, #f48fb1, #ffeb3b)",
        "gradient-dark":
          "linear-gradient(to bottom right, #0a0a0a, #1a1a1a, #3a3a3a)", // Increased contrast for dark mode gradient
      },
    },
  },
  darkMode: "class", // Enable dark mode using the 'class' strategy
  plugins: [],
};
