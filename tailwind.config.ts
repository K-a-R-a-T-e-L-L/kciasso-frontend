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
        line: "var(--color-border)",
        white: "var(--color-white)"
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)"
      },
      borderRadius: {
        lgx: "var(--radius-lg)",
        xlx: "var(--radius-xl)",
        control: "var(--radius-control)",
        pill: "var(--radius-pill)"
      },
      spacing: {
        token1: "var(--space-1)",
        token2: "var(--space-2)",
        token3: "var(--space-3)",
        token4: "var(--space-4)",
        token5: "var(--space-5)",
        token6: "var(--space-6)",
        token8: "var(--space-8)",
        token12: "var(--space-12)",
        token24: "var(--space-24)"
      },
      maxWidth: {
        narrow: "var(--container-narrow)",
        content: "var(--container-default)",
        wide: "var(--container-wide)"
      },
      screens: {
        tablet: "var(--breakpoint-tablet)",
        desktop: "var(--breakpoint-desktop)"
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        standard: "var(--duration-standard)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
