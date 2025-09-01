/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./apps/**/index.html",
    "./apps/**/src/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{ts,tsx}",
    "./packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {}
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
}
