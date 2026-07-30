import Image from "next/image";
import Link from "next/link";
import { getHomePageData } from "@/shared/api/adapters/home.adapter";
import { getPublicPageLayout } from "@/shared/api/adapters/page-layout.adapter";
import { getPublicSiteSettings } from "@/shared/api/adapters/site-settings.adapter";
import Container from "@/shared/ui/Container/Container";
import DirectionCard from "@/shared/ui/DirectionCard/DirectionCard";
import ResourceCard from "@/shared/ui/ResourceCard/ResourceCard";
import Section from "@/shared/ui/Section/Section";
import SectionHeader from "@/shared/ui/SectionHeader/SectionHeader";
import HomeImageCarousel from "@/widgets/pages/HomeImageCarousel/HomeImageCarousel.client";
import PublicPageSections from "@/widgets/pages/PublicPageSections/PublicPageSections";
import { PublicSystemSectionsProvider } from "@/widgets/pages/PublicPageSections/public-system-renderers";
import PublicContactsBoundary from "@/widgets/sections/UniversalContactsSection/PublicContactsBoundary.client";
import HomeHeroSection from "./HomeHeroSection";
import cls from "./HomePage.module.scss";

export default async function HomePage() {
  const [data, layout, contacts] = await Promise.all([
    getHomePageData(),
    getPublicPageLayout("home"),
    getPublicSiteSettings(),
  ]);

  if (!layout) {
    throw new Error("PUBLIC_PAGE_LAYOUT_NOT_FOUND:home");
  }

  const {
    homeDirections,
    latestNewsPreview,
    giaReferenceHub,
    officialResourceCards,
    services,
  } = data;
  const quickDirections = [
    homeDirections[0],
    homeDirections[1],
    {
      title: "ГИА",
      href: "/gia",
      description:
        "Результаты, апелляции, итоговое сочинение, итоговое собеседование, ППЭ, сроки и образцы заявлений.",
      badge: "Справка",
    },
    ...homeDirections.slice(3),
  ];

  const systemSections = {
    "home.hero": (
      <HomeHeroSection latestNewsPreview={latestNewsPreview} />
    ),
    "home.carousel": <HomeImageCarousel />,
    "home.main-sections": (
      <Section id="quick-access">
        <Container>
          <SectionHeader
            eyebrow="Быстрый доступ"
            title="Основные разделы"
            text="Выберите нужный раздел, чтобы перейти к материалам по экзаменам, оценке качества образования, полезным ресурсам и информации о центре."
          />
          <div className={cls.directionsGrid}>
            {quickDirections.map((item, index) => (
              <DirectionCard key={item.href} {...item} index={index} />
            ))}
          </div>
        </Container>
      </Section>
    ),
    "home.important-resources": (
      <Section id="important-resources">
        <Container>
          <div className={cls.splitSection}>
            <div>
              <SectionHeader
                eyebrow="Полезные сервисы"
                title="Важные ресурсы"
                text="Здесь собраны государственные и профильные сервисы, которые могут понадобиться участникам экзаменов, педагогам и родителям."
              />
              <Link className={cls.textLink} href="/resources">
                Открыть каталог ресурсов
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.slice(0, 4).map((item) => (
                <ResourceCard key={item.href} {...item} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    ),
    "home.gia": (
      <Section id="gia-reference">
        <Container>
          <div className={cls.giaSection}>
            <SectionHeader
              eyebrow="ГИА"
              title="Государственная итоговая аттестация"
              text="Краткий доступ к основным справочным материалам, сервисам и разделам государственной итоговой аттестации."
            />
            <div className={cls.giaGrid}>
              {giaReferenceHub.cards.map((item, index) => (
                <DirectionCard
                  key={item.href}
                  {...item}
                  index={index}
                  variant="compact"
                />
              ))}
            </div>
            <Link className={cls.giaLink} href={giaReferenceHub.href}>
              Перейти в раздел ГИА
            </Link>
          </div>
        </Container>
      </Section>
    ),
    "home.official-resources": (
      <Section id="official-resources">
        <Container>
          <div className={cls.giaSection}>
            <SectionHeader
              eyebrow="Официальные ресурсы"
              title="Полезные государственные и образовательные ресурсы"
              text="Ссылки на официальные сайты федеральных и региональных органов управления образованием, а также организаций, отвечающих за проведение государственной итоговой аттестации, оценочные процедуры и образовательные материалы."
            />
            <div className={cls.officialGrid}>
              {officialResourceCards.map((item, index) => (
                <a
                  key={item.href ?? index}
                  className={cls.cardLink}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.title}
                >
                  <div className={cls.card_res}>
                    <Image
                      src={item.logoSrc}
                      alt={item.title}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={cls.officialLogo}
                    />
                  </div>
                </a>
              ))}
            </div>
            <Link className={cls.giaLink} href="/resources">
              Открыть каталог ресурсов
            </Link>
          </div>
        </Container>
      </Section>
    ),
    "global.contacts": <PublicContactsBoundary contacts={contacts} />,
  } as const;

  return (
    <PublicSystemSectionsProvider sections={systemSections}>
      <PublicPageSections pageKey={layout.pageKey} sections={layout.sections} />
    </PublicSystemSectionsProvider>
  );
}
