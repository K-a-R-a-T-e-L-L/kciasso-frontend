import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import DirectionCard from "@/shared/ui/DirectionCard/DirectionCard";
import DocumentPlaceholder from "@/shared/ui/DocumentPlaceholder/DocumentPlaceholder";
import LinkTabsNav from "@/shared/ui/TabsNav/LinkTabsNav";
import {
  buildQualitySectionHref,
  getQualitySiblingTabs,
  getQualityTopTabs,
  type QualitySectionNode,
  type QualitySectionRoot,
} from "@/shared/content/qualitySections";
import cls from "./QualitySectionPage.module.scss";

type Props = {
  root: QualitySectionRoot;
  current: QualitySectionNode;
  parents: QualitySectionNode[];
};

export default function QualitySectionPage({ root, current, parents }: Props) {
  const topTabs = getQualityTopTabs();
  const siblingTabs = getQualitySiblingTabs({
    root,
    current,
    parents,
    href: buildQualitySectionHref([root.slug]),
  });

  const breadcrumbs = [
    { title: "Главная", href: "/" },
    { title: "Качество образования", href: "/kachestvo-obrazovaniya" },
    ...parents
      .filter((item) => item.slug !== root.slug)
      .map((item, index) => ({
        title: item.title,
        href: buildQualitySectionHref([root.slug, ...parents.slice(1, index + 2).map((entry) => entry.slug)]),
      })),
    { title: current.title },
  ];

  const activeTopHref = buildQualitySectionHref([root.slug]);
  const activeSiblingHref =
    current.slug === root.slug
      ? ""
      : buildQualitySectionHref([root.slug, ...parents.slice(1).map((item) => item.slug), current.slug]);

  return (
    <>
      <PageHero
        eyebrow="Качество образования"
        title={current.title}
        description={current.description}
        breadcrumbs={breadcrumbs}
      />
      <Container>
        <LinkTabsNav
          ariaLabel="Основные направления качества образования"
          activeKey={activeTopHref}
          items={topTabs.map((item) => ({
            key: item.href,
            title: item.title,
            href: item.href,
          }))}
        />
      </Container>

      {current.slug !== root.slug && siblingTabs.length > 1 ? (
        <Container>
          <div className={cls.subnav}>
            <LinkTabsNav
              ariaLabel="Подразделы направления"
              activeKey={activeSiblingHref}
              items={siblingTabs.map((item) => ({
                key: item.href,
                title: item.title,
                href: item.href,
              }))}
            />
          </div>
        </Container>
      ) : null}

      {current.children?.length ? (
        <Section>
          <Container>
            <div className={cls.subsectionIntro}>
              <h2>Подразделы</h2>
              <p>Внутри направления сохранены отдельные страницы, которые пользователи привыкли находить на прежнем сайте.</p>
            </div>
            <div className={cls.subsectionGrid}>
              {current.children.map((item, index) => (
                <DirectionCard
                  key={item.slug}
                  index={index}
                  title={item.title}
                  href={buildQualitySectionHref([
                    root.slug,
                    ...parents.slice(1).map((entry) => entry.slug),
                    ...(current.slug === root.slug ? [] : [current.slug]),
                    item.slug,
                  ])}
                  description={item.description}
                  badge="Подраздел"
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section muted={Boolean(current.children?.length)}>
        <Container>
          <div className={cls.layout}>
            <article className="prose-content">
              {current.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </article>
            <DocumentPlaceholder
              oldUrl={current.oldUrl}
              title={current.title}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
