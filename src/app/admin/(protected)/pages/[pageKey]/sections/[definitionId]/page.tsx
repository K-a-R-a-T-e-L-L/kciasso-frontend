import { redirect } from "next/navigation";

export default function AdminGlobalSectionAliasPage() {
  redirect("/admin/pages?tab=global");
}
