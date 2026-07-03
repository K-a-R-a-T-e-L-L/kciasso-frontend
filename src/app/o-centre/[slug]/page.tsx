import { notFound } from "next/navigation";
import ContentPage from "@/widgets/pages/ContentPage/ContentPage";
import { aboutPages } from "@/shared/content/mock";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = aboutPages.find((item) => item.slug === slug);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
