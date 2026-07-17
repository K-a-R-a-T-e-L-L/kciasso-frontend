import { notFound } from "next/navigation";
import { getGiaReferencePageBySlug } from "@/shared/api/adapters/gia.adapter";
import ContentPage from "@/widgets/pages/ContentPage/ContentPage";
import { getPublicDocuments } from "@/shared/api/adapters/public-documents.adapter";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await getGiaReferencePageBySlug(slug);

  if (!page) notFound();

  return (
    <ContentPage
      page={page}
      publicDocuments={await getPublicDocuments(`gia.${slug}`)}
    />
  );
}
