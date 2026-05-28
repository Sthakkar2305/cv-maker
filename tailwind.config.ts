import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f8fa",
          100: "#eceff3",
          200: "#d9dee7",
          300: "#b9c2cf",
          400: "#8895a7",
          500: "#637084",
          600: "#485465",
          700: "#303b4b",
          800: "#1e2734",
          900: "#111827",
          950: "#090d14"
        },
        brass: {
          50: "#fbf8ef",
          100: "#f2e8c9",
          300: "#d5bb6b",
          500: "#a9852a",
          700: "#705717"
        }
      },
      boxShadow: {
        panel: "0 18px 60px rgba(15, 23, 42, 0.08)",
        paper: "0 20px 80px rgba(15, 23, 42, 0.18)"
      },
      fontFamily: {
        sans: ["Inter", "Source Sans 3", "Arial", "sans-serif"],
        display: ["Poppins", "Inter", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
