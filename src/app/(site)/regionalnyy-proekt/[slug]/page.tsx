import { notFound } from "next/navigation";
import { getRegionalProjectHub } from "@/shared/api/adapters/regionalProject.adapter";
import { getPublicDocuments } from "@/shared/api/adapters/public-documents.adapter";
import RegionalProjectSectionPage, {
  type RegionalProjectSection,
} from "@/widgets/pages/RegionalProjectSectionPage/RegionalProjectSectionPage";

const sections: Record<string, RegionalProjectSection> = {
  materialy: {
    slug: "materialy",
    title: "Общие материалы проекта",
    description:
      "Документы и материалы, относящиеся ко всему региональному проекту.",
    documentKey: "regionalnyy-proekt",
  },
  ege: {
    slug: "ege",
    title: "ЕГЭ: от выбора до зачисления",
    description:
      "Материалы о выборе предметов ЕГЭ, подаче документов и поступлении в образовательные организации.",
    documentKey: "regionalnyy-proekt.ege",
  },
  vuz: {
    slug: "vuz",
    title: "Вузы Кузбасса",
    description:
      "Информация об образовательных организациях высшего образования Кемеровской области — Кузбасса.",
    documentKey: "regionalnyy-proekt.vuz",
  },
  video: {
    slug: "video",
    title: "Видеоматериалы вузов",
    description:
      "Подборка презентационных и информационных видеоматериалов образовательных организаций.",
    documentKey: "regionalnyy-proekt.video",
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = sections[slug];
  if (!section) notFound();
  const [page, publicDocuments] = await Promise.all([
    getRegionalProjectHub(),
    getPublicDocuments(section.documentKey),
  ]);
  return (
    <RegionalProjectSectionPage
      page={page}
      section={section}
      publicDocuments={publicDocuments}
    />
  );
}
