import {heroui} from "@heroui/theme";
import plugin from "tailwindcss";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    plugin(({ addUtilities }) => {
    addUtilities({
      /* Chrome, Safari and Opera */
      ".scrollbar-hidden::-webkit-scrollbar": {
        display: "none",
      },

      ".scrollbar-hidden": {
        "scrollbar-width": "none" /* Firefox */,
        "-ms-overflow-style": "none" /* IE and Edge */,
      },
    })
  }),],
}

module.exports = config;