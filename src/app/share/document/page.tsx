import type { Metadata } from "next";
import DocumentShareView from "@/widgets/public/DocumentShareView/DocumentShareView.client";

export const metadata: Metadata = {
  title: "Документ для согласования",
  robots: { index: false, follow: false, noarchive: true },
};

export default function Page() {
  return <DocumentShareView />;
}
