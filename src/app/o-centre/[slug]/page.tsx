import { notFound } from "next/navigation";
import { getAboutPageBySlug } from "@/shared/api/adapters/about.adapter";
import AboutCenterPage from "@/widgets/pages/AboutCenterPage/AboutCenterPage";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await getAboutPageBySlug(slug);
  if (!page) notFound();
  return <AboutCenterPage page={page} />;
}
