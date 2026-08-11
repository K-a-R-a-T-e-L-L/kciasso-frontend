import Link from "next/link";
import type { NewsPreviewItem } from "@/shared/content/content.types";
import { topLinks } from "@/shared/config/navigation";
import Container from "@/shared/ui/Container/Container";
import cls from "./HomePage.module.scss";

export default function HomeHeroSection({
  latestNewsPreview,
}: {
  latestNewsPreview: NewsPreviewItem[];
}) {
  const [leadNews, ...secondaryNews] = latestNewsPreview;

  return (
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
              Информационно-аналитическое сопровождение государственной итоговой
              аттестации, оценочных процедур и мониторинга качества образования
              в Кузбассе.
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
                        <span className={cls.heroNewsArrow} aria-hidden="true">
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
  );
}
