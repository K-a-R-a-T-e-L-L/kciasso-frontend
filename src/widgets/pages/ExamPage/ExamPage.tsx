import PageHero from "@/shared/ui/PageHero/PageHero";
import type { ExamPageData } from "@/shared/content/mock";
import ExamPageTabs from "./ExamPageTabs.client";

export default function ExamPage({ page }: { page: ExamPageData }) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        breadcrumbs={[{ title: "Главная", href: "/" }, { title: page.title }]}
      />
      <ExamPageTabs page={page} />
    </>
  );
}
