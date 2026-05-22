/** @type {import('tailwindcss').Config} */
export default {
content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      colors: {
        primary: "#7c3aed",
        "primary-light": "#ede9fe",
        "primary-dark": "#5b21b6",
        background: "#f8f7ff",
        card: "#ffffff",
        border: "#e0ddf5",
        muted: "#f3f2fb",
        "muted-fg": "#7b7a99",
        foreground: "#18171f",
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
