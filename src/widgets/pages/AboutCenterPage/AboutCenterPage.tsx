import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import DocumentPlaceholder from "@/shared/ui/DocumentPlaceholder/DocumentPlaceholder";
import LinkTabsNav from "@/shared/ui/TabsNav/LinkTabsNav";
import { aboutCenterTabs, type AboutCenterPage as AboutCenterPageData } from "@/shared/content/aboutCenter";
import cls from "./AboutCenterPage.module.scss";

export default function AboutCenterPage({ page }: { page: AboutCenterPageData }) {
  return (
    <>
      <PageHero
        eyebrow="О центре"
        title={page.title}
        description={page.description}
        breadcrumbs={[
          { title: "Главная", href: "/" },
          { title: "О центре", href: "/o-centre" },
          { title: page.title },
        ]}
      />
      <Container>
        <LinkTabsNav
          ariaLabel="Разделы о центре"
          activeKey={`/o-centre/${page.slug}`}
          items={aboutCenterTabs.map((item) => ({
            key: item.href,
            title: item.title,
            href: item.href,
          }))}
        />
      </Container>
      <Section>
        <Container>
          <div className={cls.layout}>
            <div className={cls.content}>
              <article className="prose-content">
                {page.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </article>

              {page.groups?.map((group) => (
                <section key={group.title} className={cls.group}>
                  <h2>{group.title}</h2>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className={cls.content}>
              {page.links?.length ? (
                <section className={cls.linksCard}>
                  <p>Материалы и ссылки</p>
                  <h2>Полезные переходы</h2>
                  {page.links.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                    >
                      {item.title}
                    </a>
                  ))}
                </section>
              ) : null}

              <DocumentPlaceholder title={page.title} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
