import MainLayout from "@/widgets/layout/MainLayout/MainLayout";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
