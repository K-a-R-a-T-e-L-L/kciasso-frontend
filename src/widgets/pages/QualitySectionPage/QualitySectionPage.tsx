import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import LinkTabsNav from "@/shared/ui/TabsNav/LinkTabsNav";
import {
  buildQualitySectionHref,
  getQualityTopTabs,
  type QualitySectionNode,
  type QualitySectionRoot,
} from "@/shared/content/qualitySections";
import cls from "./QualitySectionPage.module.scss";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import PublicDocumentsBlock from "@/shared/ui/PublicDocumentsBlock/PublicDocumentsBlock";

type Props = {
  root: QualitySectionRoot;
  current: QualitySectionNode;
  parents: QualitySectionNode[];
  publicDocuments: PublicDocumentsResult;
};

export default function QualitySectionPage({
  root,
  current,
  parents,
  publicDocuments,
}: Props) {
  const topTabs = getQualityTopTabs();
  const navigationParent =
    current.slug === root.slug ? root : (parents[parents.length - 1] ?? root);
  const navigationPrefix = [
    root.slug,
    ...parents.slice(1).map((item) => item.slug),
  ];
  const secondLevelTabs = (navigationParent.children ?? []).map((item) => ({
    key: buildQualitySectionHref([...navigationPrefix, item.slug]),
    title: item.title,
    href: buildQualitySectionHref([...navigationPrefix, item.slug]),
  }));
  const breadcrumbs = [
    { title: "Главная", href: "/" },
    {
      title: "Качество образования",
      href: "/kachestvo-obrazovaniya",
    },
    ...parents
      .filter((item) => item.slug !== root.slug)
      .map((item, index) => ({
        title: item.title,
        href: buildQualitySectionHref([
          root.slug,
          ...parents.slice(1, index + 2).map((entry) => entry.slug),
        ]),
      })),
    { title: current.title },
  ];
  const activeTopHref = buildQualitySectionHref([root.slug]);
  const activeSecondLevelHref =
    current.slug === root.slug
      ? ""
      : buildQualitySectionHref([
          root.slug,
          ...parents.slice(1).map((item) => item.slug),
          current.slug,
        ]);

  return (
    <>
      <PageHero
        eyebrow="Качество образования"
        title={current.title}
        description={current.description}
        breadcrumbs={breadcrumbs}
      />
      <Container>
        <section className={cls.navigationBlock}>
          <h2>Направления оценки качества</h2>
          <LinkTabsNav
            ariaLabel="Направления оценки качества"
            activeKey={activeTopHref}
            items={topTabs.map((item) => ({
              key: item.href,
              title: item.title,
              href: item.href,
            }))}
          />
        </section>
        {secondLevelTabs.length > 0 ? (
          <section className={`${cls.navigationBlock} ${cls.secondLevel}`}>
            <h2>Разделы направления «{root.title}»</h2>
            <LinkTabsNav
              ariaLabel={`Разделы направления «${root.title}»`}
              activeKey={activeSecondLevelHref}
              items={secondLevelTabs}
            />
          </section>
        ) : null}
      </Container>
      <Section
        className={cls.contentSection}
        muted={Boolean(current.children?.length)}
      >
        <Container>
          <section className={cls.aboutSection}>
            <h2 style={{fontWeight: 700}}>О разделе</h2>
            <article className="prose-content">
              {current.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </article>
          </section>
          <PublicDocumentsBlock
            result={publicDocuments}
            title="Документы и материалы"
            variant="fullWidth"
            searchable
          />
        </Container>
      </Section>
    </>
  );
}
