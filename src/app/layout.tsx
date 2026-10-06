import type { Metadata } from "next";
import { connection } from "next/server";
import { mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/globals.scss";
import AppProviders from "./AppProviders.client";
import { getSiteRobotsMetadata } from "@/shared/config/site-indexing";

const siteMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const robots = getSiteRobotsMetadata();
  return robots ? { ...siteMetadata, robots } : siteMetadata;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" {...mantineHtmlProps}>
      <head />
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
