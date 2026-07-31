import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGia11Page } from "@/shared/api/adapters/gia.adapter";
import {
  getGiaSectionBySlug,
  getGiaSections,
} from "@/shared/content/gia-sections";
import GiaSectionPage from "@/widgets/pages/ExamPage/GiaSectionPage";

type Props = { params: Promise<{ sectionSlug: string }> };

export function generateStaticParams() {
  return getGiaSections("gia-11").map(({ slug }) => ({ sectionSlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectionSlug } = await params;
  const section = getGiaSectionBySlug("gia-11", sectionSlug);
  if (!section) notFound();
  return {
    title: `${section.title} — ГИА-11`,
    description: section.description,
    alternates: { canonical: `/gia-11/${section.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { sectionSlug } = await params;
  const page = await getGia11Page();
  return (
    <GiaSectionPage exam="gia-11" page={page} sectionSlug={sectionSlug} />
  );
}
