import type { Config } from "tailwindcss";

// ─── Sandry brand palette ────────────────────────────────────────────────────
// #504940  dark brown  (darkest)
// #818c6a  olive green (mid)
// #d5ccb2  warm tan    (light)
// #efe7dc  cream       (lightest / backgrounds)

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rose scale remapped to brand palette
        // (all rose-* classes in the codebase automatically pick up brand colors)
        rose: {
          50:  "#efe7dc", // cream — page backgrounds
          100: "#e4daca", // slightly darker cream — subtle fills
          200: "#d5ccb2", // tan — borders
          300: "#c2b798", // medium tan — focus rings
          400: "#a49d7e", // olive-tan — hover fills
          500: "#818c6a", // olive — primary buttons, accents
          600: "#504940", // dark brown — hover states, brand text
          700: "#3d3830", // very dark — deep shadows
          800: "#2d2922", // near-black
          900: "#1e1c17", // darkest
        },
        // Amber scale remapped to brand palette
        // (amber-* classes for tagline, badge highlights, etc.)
        amber: {
          50:  "#efe7dc",
          100: "#e5dcc9",
          200: "#d5ccb2",
          300: "#c4b99a",
          400: "#a9a086",
          500: "#818c6a",
          600: "#6e7659",
          700: "#504940",
          800: "#3d3830",
          900: "#2d2922",
        },
      },
      fontFamily: {
        sunroll: ["'Sunroll'", "Georgia", "serif"],
        inter:   ["var(--font-inter)", "system-ui", "sans-serif"],
        cairo:   ["var(--font-cairo)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
