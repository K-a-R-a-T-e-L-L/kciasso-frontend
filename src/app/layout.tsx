import type { Metadata } from "next";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: 'ГКУ "КЦИАССО"',
  description: "Кузбасский центр информационно-аналитического сопровождения системы образования",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
