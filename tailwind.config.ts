import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/widgets/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--color-bg)",
        surface: "var(--color-surface)",
        mutedSurface: "var(--color-surface-muted)",
        primary: "var(--color-primary)",
        primaryDark: "var(--color-primary-dark)",
        accent: "var(--color-accent)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        line: "var(--color-border)"
      },
      boxShadow: {
        soft: "var(--shadow-soft)"
      },
      borderRadius: {
        lgx: "var(--radius-lg)",
        xlx: "var(--radius-xl)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
