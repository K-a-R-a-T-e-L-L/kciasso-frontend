import MainLayout from "@/widgets/layout/MainLayout/MainLayout";
import { connection } from "next/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  return <MainLayout>{children}</MainLayout>;
}