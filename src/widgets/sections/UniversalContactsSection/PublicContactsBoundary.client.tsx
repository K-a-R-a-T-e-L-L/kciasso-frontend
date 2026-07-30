import type { SiteContacts } from "@/shared/content/content.types";
import UniversalContactsSection from "./UniversalContactsSection";

type Props = {
  contacts: SiteContacts;
};

export default function PublicContactsBoundary({ contacts }: Props) {
  return <UniversalContactsSection contacts={contacts} />;
}
