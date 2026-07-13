import { getPublicSiteSettings } from "@/shared/api/adapters/site-settings.adapter";
import Footer from "@/widgets/layout/Footer/Footer";
import Header from "@/widgets/layout/Header/Header";
import PublicContactsBoundary from "@/widgets/sections/UniversalContactsSection/PublicContactsBoundary.client";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const contacts = await getPublicSiteSettings();

  return (
    <>
      <Header hotline={contacts.giaHotline} />
      <main>{children}</main>
      <PublicContactsBoundary contacts={contacts} />
      <Footer contacts={contacts} />
    </>
  );
}
