/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07070b",
        panel: "rgba(20, 20, 30, 0.6)",
        border: "rgba(120, 100, 255, 0.15)",
        accent: {
          blue: "#3b82f6",
          purple: "#a855f7",
          DEFAULT: "#7c5cff",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Inter",
        ],
      },
      boxShadow: {
        glow: "0 0 24px rgba(124, 92, 255, 0.45)",
        "glow-blue": "0 0 24px rgba(59, 130, 246, 0.45)",
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(135deg, #3b82f6 0%, #7c5cff 50%, #a855f7 100%)",
        "accent-gradient-soft":
          "linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(168, 85, 247, 0.18) 100%)",
      },
    },
  },
  plugins: [],
};
