/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // semantic tokens (mapped to CSS vars below)
        bg: "rgb(var(--bg) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        subtext: "rgb(var(--subtext) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          50:  "#eaf7ff",
          100: "#d6efff",
          200: "#aee0ff",
          300: "#76caff",
          400: "#41b2ff",
          500: "#1898ff",    // link/accent
          600: "#0f7ae6",
          700: "#0e62bf",
          800: "#0f4f98",
          900: "#123f78",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)", // teal glow
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.15)",
        glass: "0 1px 0 rgba(255,255,255,.06) inset, 0 8px 30px rgba(0,0,0,.35)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      backgroundImage: {
        "glow-radial":
          "radial-gradient(60% 60% at 50% 0%, rgba(56,189,248,.25), transparent 60%)",
        "hero-gradient":
          "linear-gradient(180deg, rgba(8,19,39,1) 0%, rgba(9,12,22,1) 60%, rgba(7,10,18,1) 100%)",
        "text-gradient":
          "linear-gradient(90deg, #60a5fa 0%, #22d3ee 50%, #a78bfa 100%)",
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
}
