import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { getHomePageData } from "@/shared/api/adapters/home.adapter";
import { topLinks } from "@/shared/config/navigation";
import Container from "@/shared/ui/Container/Container";
import DirectionCard from "@/shared/ui/DirectionCard/DirectionCard";
import ResourceCard from "@/shared/ui/ResourceCard/ResourceCard";
import Section from "@/shared/ui/Section/Section";
import SectionHeader from "@/shared/ui/SectionHeader/SectionHeader";
import cls from "./HomePage.module.scss";

export default async function HomePage() {
  const {
    homeDirections,
    latestNewsPreview,
    giaReferenceHub,
    officialResourceCards,
    services,
    homeSectionsOrder,
  } = await getHomePageData();
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
  const [leadNews, ...secondaryNews] = latestNewsPreview;

  const sectionRegistry = {
    "home.quick-access": (
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
    "home.resources": (
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
    "home.gia-reference": (
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
  } as const;

  return (
    <>
      <section className={cls.hero}>
        <Container>
          <div className={cls.heroGrid}>
            <div className={cls.heroCopy}>
              <p className={cls.badge}>Кемеровская область — Кузбасс</p>
              <h1>
                <span>«Кузбасский центр</span>
                <span>информационно-аналитического</span>
                <span>сопровождения системы образования»</span>
              </h1>
              <p>
                Информационно-аналитическое сопровождение государственной
                итоговой аттестации, оценочных процедур и мониторинга качества
                образования в Кузбассе.
              </p>
              <div className={cls.actions}>
                <Link href="#quick-access">Выбрать раздел</Link>
                <Link href="/o-centre/kontakty">Контакты</Link>
              </div>
              <div className={cls.officialLinks}>
                <span>Официальные ресурсы</span>
                <div>
                  {topLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div id="current-information" className={cls.heroVisual}>
              <div className={cls.heroNewsPanel}>
                <div className={cls.heroNewsHeader}>
                  <span className={cls.heroNewsLabel}>Последние новости</span>
                  <Link className={cls.heroNewsAll} href="/news">
                    Все новости
                  </Link>
                </div>
                {leadNews ? (
                  <Link className={cls.heroLeadNews} href={leadNews.href}>
                    <span
                      className={cls.heroLeadMedia}
                      aria-hidden={leadNews.coverImageUrl ? undefined : true}
                    >
                      {leadNews.coverImageUrl ? (
                        <>
                          <span className="sr-only">Изображение новости</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={leadNews.coverImageUrl}
                            alt={leadNews.title}
                            className={cls.heroLeadImage}
                          />
                        </>
                      ) : (
                        <span className={cls.heroLeadPlaceholder}>
                          <span>Новости</span>
                        </span>
                      )}
                    </span>
                    <span className={cls.heroLeadBody}>
                      <span className={cls.heroNewsMeta}>
                        <span>{leadNews.categoryTitle}</span>
                        <time>{leadNews.date}</time>
                      </span>
                      <strong>{leadNews.title}</strong>
                      <span>{leadNews.text}</span>
                    </span>
                  </Link>
                ) : null}
                {secondaryNews.length > 0 ? (
                  <div className={cls.heroSecondaryNews}>
                    {secondaryNews.map((item) => (
                      <Link
                        key={item.href}
                        className={cls.heroNewsItem}
                        href={item.href}
                      >
                        <span className={cls.heroNewsMeta}>
                          <span>{item.categoryTitle}</span>
                          <time>{item.date}</time>
                        </span>
                        <span className={cls.heroNewsItemTitleRow}>
                          <strong>{item.title}</strong>
                          <span
                            className={cls.heroNewsArrow}
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </span>
                        <span className={cls.heroNewsExcerpt}>{item.text}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>
      {homeSectionsOrder.map((key) => (
        <Fragment key={key}>{sectionRegistry[key]}</Fragment>
      ))}
    </>
  );
}
