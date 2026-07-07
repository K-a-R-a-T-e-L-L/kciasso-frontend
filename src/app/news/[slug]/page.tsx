import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/shared/api/adapters/news.adapter";
import NewsArticlePage from "@/widgets/pages/NewsArticlePage/NewsArticlePage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) notFound();

  return <NewsArticlePage item={item} />;
}
