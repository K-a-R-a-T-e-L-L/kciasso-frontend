import Link from "next/link";
import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import NewsCard from "@/shared/ui/NewsCard/NewsCard";
import { getNewsCategory, getRelatedNews } from "@/shared/api/adapters/news.adapter";
import type { NewsItem } from "@/shared/content/content.types";
import NewsCoverImage from "./NewsCoverImage.client";
import cls from "./NewsArticlePage.module.scss";

type Props = {
  item: NewsItem;
};

export default async function NewsArticlePage({ item }: Props) {
  const category = await getNewsCategory(item.category);
  const related = await getRelatedNews(item.slug);

  return (
    <>
      <PageHero
        eyebrow={category.title}
        title={item.title}
        description={item.excerpt}
        breadcrumbs={[
          { title: "Главная", href: "/" },
          { title: "Новости", href: "/news" },
          { title: item.title },
        ]}
      />
      <Section>
        <Container>
          <div className={cls.layout}>
            <article className={cls.article}>
              <div className={cls.meta}>
                <span>{category.title}</span>
                <time dateTime={item.publishedAt}>{item.dateLabel}</time>
              </div>

              {item.coverImageUrl ? <NewsCoverImage src={item.coverImageUrl} alt={item.title} /> : null}

              <div className="prose-content">
                {item.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className={cls.backRow}>
                <Link href="/news">Все новости</Link>
              </div>
            </article>

            <aside className={cls.sidebar}>
              <div className={cls.relatedCard}>
                <p>Еще по теме</p>
                <div className={cls.relatedList}>
                  {related.map((entry) => (
                    <NewsCard
                      key={entry.slug}
                      title={entry.title}
                      date={entry.dateLabel}
                      href={`/news/${entry.slug}`}
                      text={entry.excerpt}
                      category={entry.categoryTitle}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
