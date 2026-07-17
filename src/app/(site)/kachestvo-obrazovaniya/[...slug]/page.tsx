import { notFound } from "next/navigation";
import { getQualitySectionByPath } from "@/shared/api/adapters/quality.adapter";
import QualitySectionPage from "@/widgets/pages/QualitySectionPage/QualitySectionPage";
import { getPublicDocuments } from "@/shared/api/adapters/public-documents.adapter";

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const resolved = await getQualitySectionByPath(slug);

  if (!resolved) notFound();

  return (
    <QualitySectionPage
      root={resolved.root}
      current={resolved.current}
      parents={resolved.parents}
      publicDocuments={await getPublicDocuments(`quality.${slug.join(".")}`)}
    />
  );
}
