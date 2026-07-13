"use client";

import { usePathname } from "next/navigation";
import type { SiteContacts } from "@/shared/content/content.types";
import UniversalContactsSection from "./UniversalContactsSection";

type Props = {
  contacts: SiteContacts;
};

export default function PublicContactsBoundary({ contacts }: Props) {
  const pathname = usePathname();

  if (pathname === "/o-centre/kontakty") {
    return null;
  }

  return <UniversalContactsSection contacts={contacts} />;
}
