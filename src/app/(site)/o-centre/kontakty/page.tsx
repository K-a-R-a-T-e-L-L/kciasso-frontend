import ContactsPage from "@/widgets/pages/ContactsPage/ContactsPage";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

export default async function Page() {
  return (
    <OrderedPublicPage
      pageKey="about.contacts"
      systemSections={{ "about.contacts": <ContactsPage /> }}
    />
  );
}
