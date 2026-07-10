import { notFound } from "next/navigation";
import { getQualitySectionByPath } from "@/shared/api/adapters/quality.adapter";
import QualitySectionPage from "@/widgets/pages/QualitySectionPage/QualitySectionPage";

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const resolved = await getQualitySectionByPath(slug);

  if (!resolved) notFound();

  return <QualitySectionPage root={resolved.root} current={resolved.current} parents={resolved.parents} />;
}
