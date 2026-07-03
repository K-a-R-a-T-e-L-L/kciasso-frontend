import Link from "next/link";
import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import DocumentPlaceholder from "@/shared/ui/DocumentPlaceholder/DocumentPlaceholder";
import type { ContentPageData } from "@/shared/content/mock";
import cls from "./ContentPage.module.scss";

export default function ContentPage({ page }: { page: ContentPageData }) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        breadcrumbs={[
          { title: "Главная", href: "/" },
          { title: page.sectionTitle, href: page.sectionHref },
          { title: page.title },
        ]}
      />
      <Container>
        <nav className={cls.tabNav} aria-label="Навигация по разделу">
          {page.tabs.map((item) => (
            <Link key={item.href} href={item.href} className={item.href === page.href ? cls.activeTab : undefined}>
              {item.title}
            </Link>
          ))}
        </nav>
      </Container>
      <Section>
        <Container>
          <div className={cls.layout}>
            <article className="prose-content">
              {page.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </article>
            <DocumentPlaceholder />
          </div>
        </Container>
      </Section>
    </>
  );
}
