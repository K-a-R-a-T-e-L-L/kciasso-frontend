import { createTheme } from "@mantine/core";

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
