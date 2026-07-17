import type { HubPageData } from "@/shared/content/content.types";
import { IconInfoCircle } from "@tabler/icons-react";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import LinkTabsNav from "@/shared/ui/TabsNav/LinkTabsNav";
import PublicDocumentsBlock from "@/shared/ui/PublicDocumentsBlock/PublicDocumentsBlock";
import UsefulLinksCard from "@/shared/ui/UsefulLinksCard/UsefulLinksCard";
import cls from "./RegionalProjectSectionPage.module.scss";

export type RegionalProjectSection = { slug: "materialy" | "ege" | "vuz" | "video"; title: string; description: string; documentKey: string };

export default function RegionalProjectSectionPage({ page, section, publicDocuments }: { page: HubPageData; section: RegionalProjectSection; publicDocuments: PublicDocumentsResult }) {
  const navigationItems = [
    { key: "materialy", title: "Общие материалы", href: "/regionalnyy-proekt/materialy" },
    { key: "ege", title: "ЕГЭ", href: "/regionalnyy-proekt/ege" },
    { key: "vuz", title: "Вузы Кузбасса", href: "/regionalnyy-proekt/vuz" },
    { key: "video", title: "Видеоматериалы", href: "/regionalnyy-proekt/video" },
  ];

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={section.title} description={section.description} breadcrumbs={[{ title: "Главная", href: "/" }, { title: page.title, href: "/regionalnyy-proekt" }, { title: section.title }]} />
      <Container><LinkTabsNav ariaLabel="Разделы регионального проекта" activeKey={section.slug} items={navigationItems} /></Container>
      <Section className={cls.section}>
        <Container>
          <div className={cls.layout}>
            <article className={cls.aboutCard}>
              <span className={cls.cardIcon} aria-hidden="true"><IconInfoCircle size={28} stroke={1.8} /></span>
              <h2 style={{ fontWeight: 700 }}>О разделе</h2>
              <p>{section.description}</p>
            </article>
            <UsefulLinksCard title="Полезные материалы" variant="compact" items={page.cards.filter((card) => card.href !== `/regionalnyy-proekt/${section.slug}`).map((card) => ({ id: card.href, title: card.title, href: card.href }))} />
          </div>
          <PublicDocumentsBlock result={publicDocuments} title="Документы и материалы" variant="fullWidth" />
        </Container>
      </Section>
    </>
  );
}
