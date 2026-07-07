import Link from "next/link";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import SectionHeader from "@/shared/ui/SectionHeader/SectionHeader";
import DirectionCard from "@/shared/ui/DirectionCard/DirectionCard";
import ResourceCard from "@/shared/ui/ResourceCard/ResourceCard";
import NewsCard from "@/shared/ui/NewsCard/NewsCard";
import { getHomePageData } from "@/shared/api/adapters/home.adapter";
import { topLinks } from "@/shared/config/navigation";
import cls from "./HomePage.module.scss";

export default async function HomePage() {
  const { homeDirections, latestNewsPreview, services, contacts, primaryContacts } = await getHomePageData();
  const quickDirections = [
    homeDirections[0],
    homeDirections[1],
    {
      title: "ГИА",
      href: "/gia",
      description: "Результаты, апелляции, итоговое сочинение, итоговое собеседование, ППЭ, сроки и образцы заявлений.",
      badge: "Справка",
    },
    ...homeDirections.slice(3),
  ];

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
                Информационно-аналитическое сопровождение государственной итоговой аттестации, оценочных процедур и
                мониторинга качества образования в Кузбассе.
              </p>
              <div className={cls.actions}>
                <Link href="#quick-access">Выбрать раздел</Link>
                <Link href="/o-centre/kontakty">Контакты</Link>
              </div>
              <div className={cls.officialLinks}>
                <span>Официальные ресурсы</span>
                <div>
                  {topLinks.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className={cls.heroVisual}>
              <div className={cls.orgCard}>
                <div className={cls.visualGlow} aria-hidden />
                <span>{contacts.legalForm}</span>
                <strong>{contacts.shortName}</strong>
                <p>Координация ГИА, оценочных процедур, аналитических материалов и информационных сервисов.</p>
                <div className={cls.visualPoints}>
                  <div>
                    <b>ГИА</b>
                    <small>документы, сроки, результаты</small>
                  </div>
                  <div>
                    <b>Качество образования</b>
                    <small>мониторинг, исследования, аналитика</small>
                  </div>
                  <div>
                    <b>Контакты</b>
                    <small>{contacts.phone}</small>
                  </div>
                </div>
                <div className={cls.visualFooter}>
                  <i>{contacts.email}</i>
                  <Link href="/o-centre/kontakty">Открыть контакты</Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

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

      <Section id="current-information">
        <Container>
          <div className={cls.newsLayout}>
            <div className={cls.newsIntro}>
              <SectionHeader
                eyebrow="Новости"
                title="Актуальная информация"
                text="Оперативные сообщения по государственной итоговой аттестации, апелляциям, срокам проведения и другим важным вопросам."
              />
              <Link className={cls.newsLink} href="/news">
                Все новости
              </Link>
            </div>
            <div className={cls.newsList}>
              {latestNewsPreview.map((item) => (
                <NewsCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="contacts">
        <Container>
          <div className={cls.contactCta}>
            <div>
              <p className={cls.badge}>Справочная информация</p>
              <h2>Контакты для обращений по вопросам ГИА и работы сайта</h2>
              <p>
                По вопросам государственной итоговой аттестации, размещенных материалов и работы сервисов можно
                воспользоваться телефонами справочной службы или перейти на страницу контактов.
              </p>
            </div>
            <div className={cls.contactBox}>
              <strong>{contacts.phone}</strong>
              <div className={cls.contactList}>
                {primaryContacts.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    {item.href ? <a href={item.href}>{item.value}</a> : <b>{item.value}</b>}
                  </div>
                ))}
              </div>
              <Link href="/o-centre/kontakty">Страница контактов</Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
