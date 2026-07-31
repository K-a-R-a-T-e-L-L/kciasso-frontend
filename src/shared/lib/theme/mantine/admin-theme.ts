import { createTheme } from "@mantine/core";

export const ADMIN_NAV_COLORS = {
  foreground: "#ffffff",
  defaultBackground: "#031d43",
  hoverBackground: "#17456e",
  activeBackground: "#07549b",
  activeHoverBackground: "#06457f",
} as const;

export const ADMIN_NAV_FOCUS = {
  outlineWidth: 2,
  outlineOffset: 2,
  outlineColor: "#ffffff",
} as const;

function luminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)?.map((value) => Number.parseInt(value, 16) / 255) ?? [];
  return channels.reduce(
    (sum, channel, index) =>
      sum
      + (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
      * [0.2126, 0.7152, 0.0722][index],
    0,
  );
}

export function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

export const kciassoTheme = createTheme({
  primaryColor: "kciassoBlue",
  primaryShade: { light: 6, dark: 5 },
  defaultRadius: "md",
  focusRing: "auto",
  fontFamily: "Inter, Arial, system-ui, sans-serif",
  headings: {
    fontFamily: "Inter, Arial, system-ui, sans-serif",
    fontWeight: "700",
  },
  colors: {
    kciassoBlue: [
      "#eef6ff", "#d9e5f2", "#b8cde4", "#8eafd0", "#5f8fbc",
      "#2b6ba8", "#07549b", "#06457f", "#052d64", "#031d43",
    ],
    kciassoTeal: [
      "#e8fbff", "#c8f1f7", "#9de2ec", "#68ccda", "#36b8cb",
      "#13a8c7", "#0e8fa8", "#087487", "#055563", "#033943",
    ],
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  shadows: {
    sm: "0 6px 18px rgba(5, 45, 100, 0.06)",
    md: "0 12px 32px rgba(5, 45, 100, 0.08)",
  },
  components: {
    Button: { defaultProps: { radius: "md" } },
    TextInput: { defaultProps: { radius: "md" } },
    Select: { defaultProps: { radius: "md" } },
    Textarea: { defaultProps: { radius: "md" } },
    Card: { defaultProps: { radius: "lg", withBorder: true } },
    Paper: { defaultProps: { radius: "lg" } },
    Modal: { defaultProps: { centered: true, radius: "lg" } },
  },
});

export const adminTheme = kciassoTheme;
