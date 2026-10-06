import type { Metadata } from "next";
import DocumentShareView from "@/widgets/public/DocumentShareView/DocumentShareView.client";
import { getSiteRobotsMetadata } from "@/shared/config/site-indexing";

export function generateMetadata(): Metadata {
  return {
    title: "Документ для согласования",
    robots: getSiteRobotsMetadata() ?? { index: false, follow: false, noarchive: true },
  };
}

export default function Page() {
  return <DocumentShareView />;
}
