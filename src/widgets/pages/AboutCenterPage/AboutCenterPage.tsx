import PageHero from "@/shared/ui/PageHero/PageHero";
import { IconFileDescription, IconInfoCircle } from "@tabler/icons-react";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import LinkTabsNav from "@/shared/ui/TabsNav/LinkTabsNav";
import { aboutCenterTabs, type AboutCenterPage as AboutCenterPageData } from "@/shared/content/aboutCenter";
import cls from "./AboutCenterPage.module.scss";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import PublicDocumentsBlock from "@/shared/ui/PublicDocumentsBlock/PublicDocumentsBlock";
import UsefulLinksCard from "@/shared/ui/UsefulLinksCard/UsefulLinksCard";

export default function AboutCenterPage({ page, publicDocuments }: { page: AboutCenterPageData; publicDocuments: PublicDocumentsResult }) {
  return (
    <>
      <PageHero eyebrow="О центре" title={page.title} description={page.description} breadcrumbs={[{ title: "Главная", href: "/" }, { title: "О центре", href: "/o-centre" }, { title: page.title }]} />
      <Container>
        <LinkTabsNav ariaLabel="Разделы о центре" activeKey={`/o-centre/${page.slug}`} items={aboutCenterTabs.map((item) => ({ key: item.href, title: item.title, href: item.href }))} />
      </Container>
      <Section className={cls.section}>
        <Container>
          <div className={cls.layout}>
            <UsefulLinksCard title="Полезные ссылки" items={(page.links ?? []).map((item, index) => ({ id: `${item.href}-${index}`, title: item.title, href: item.href, external: item.external }))} />
            <div className={cls.content}>
              <article className={`prose-content ${cls.aboutCard}`}>
                <span className={cls.cardIcon} aria-hidden="true"><IconInfoCircle size={28} stroke={1.8} /></span>
                <h2 style={{ fontWeight: 700 }}>О разделе</h2>
                {page.paragraphs.map((text) => <p key={text}>{text}</p>)}
              </article>
              {page.groups?.map((group) => (
                <section key={group.title} className={cls.group}>
                  <span className={cls.cardIcon} aria-hidden="true"><IconFileDescription size={27} stroke={1.8} /></span>
                  <h2>{group.title}</h2>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              ))}
            </div>
            <PublicDocumentsBlock result={publicDocuments} title="Документы и материалы" variant="fullWidth" />
          </div>
        </Container>
      </Section>
    </>
  );
}
