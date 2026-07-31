import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGia9Page } from "@/shared/api/adapters/gia.adapter";
import {
  getGiaSectionBySlug,
  getGiaSections,
} from "@/shared/content/gia-sections";
import GiaSectionPage from "@/widgets/pages/ExamPage/GiaSectionPage";

type Props = { params: Promise<{ sectionSlug: string }> };

export function generateStaticParams() {
  return getGiaSections("gia-9").map(({ slug }) => ({ sectionSlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectionSlug } = await params;
  const section = getGiaSectionBySlug("gia-9", sectionSlug);
  if (!section) notFound();
  return {
    title: `${section.title} — ГИА-9`,
    description: section.description,
    alternates: { canonical: `/gia-9/${section.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { sectionSlug } = await params;
  const page = await getGia9Page();
  return (
    <GiaSectionPage exam="gia-9" page={page} sectionSlug={sectionSlug} />
  );
}
