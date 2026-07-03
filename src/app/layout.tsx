import type { Metadata } from "next";
import "@/styles/globals.scss";
import MainLayout from "@/widgets/layout/MainLayout/MainLayout";

export const metadata: Metadata = {
  title: "ГКУ КЦМКО",
  description: "Кузбасский центр мониторинга качества образования",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
