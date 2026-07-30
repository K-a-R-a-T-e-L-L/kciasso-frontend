import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/shared/api/adapters/news.adapter";
import NewsArticlePage from "@/widgets/pages/NewsArticlePage/NewsArticlePage";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) notFound();

  return (
    <OrderedPublicPage
      pageKey="news.article"
      systemSections={{ "news.article": <NewsArticlePage item={item} /> }}
    />
  );
}
