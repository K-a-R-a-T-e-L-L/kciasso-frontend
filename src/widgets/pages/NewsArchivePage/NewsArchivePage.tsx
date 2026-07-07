import Link from "next/link";
import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import NewsCard from "@/shared/ui/NewsCard/NewsCard";
import { getNewsArchive, getNewsCategory } from "@/shared/api/adapters/news.adapter";
import cls from "./NewsArchivePage.module.scss";

type Props = {
  page?: number;
  category?: string;
};

function buildArchiveHref(page: number, category?: string | null) {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();

  return query ? `/news?${query}` : "/news";
}

export default async function NewsArchivePage({ page = 1, category }: Props) {
  const archive = await getNewsArchive({ page, category });
  const selectedCategoryTitle = archive.selectedCategory
    ? (await getNewsCategory(archive.selectedCategory)).title
    : null;

  return (
    <>
      <PageHero
        eyebrow="Новости"
        title="Новости и объявления"
        description={
          selectedCategoryTitle
            ? `Публикации по направлению «${selectedCategoryTitle}».`
            : "Оперативные сообщения, объявления, результаты, материалы и новости учреждения."
        }
        breadcrumbs={[{ title: "Главная", href: "/" }, { title: "Новости" }]}
      />
      <Section>
        <Container>
          <div className={cls.layout}>
            <aside className={cls.sidebar}>
              <div className={cls.filterCard}>
                <p>Рубрики</p>
                <div className={cls.filterList}>
                  <Link
                    href="/news"
                    className={!archive.selectedCategory ? cls.filterActive : undefined}
                  >
                    Все новости
                  </Link>
                  {archive.categories.map((item) => (
                    <Link
                      key={item.id}
                      href={buildArchiveHref(1, item.id)}
                      className={archive.selectedCategory === item.id ? cls.filterActive : undefined}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            <div className={cls.content}>
              <div className={cls.archiveMeta}>
                <span>
                  {archive.selectedCategory ? `Рубрика: ${selectedCategoryTitle}` : "Все рубрики"}
                </span>
                <b>
                  Страница {archive.currentPage} из {archive.totalPages}
                </b>
              </div>

              <div className={cls.list}>
                {archive.items.map((item) => (
                  <NewsCard
                    key={item.slug}
                    title={item.title}
                    date={item.dateLabel}
                    href={`/news/${item.slug}`}
                    text={item.excerpt}
                  />
                ))}
              </div>

              <div className={cls.pagination}>
                <Link
                  href={buildArchiveHref(archive.currentPage - 1, archive.selectedCategory)}
                  aria-disabled={archive.currentPage <= 1}
                  className={archive.currentPage <= 1 ? cls.paginationDisabled : undefined}
                >
                  Назад
                </Link>

                <div className={cls.paginationPages}>
                  {Array.from({ length: archive.totalPages }, (_, index) => index + 1).map((value) => (
                    <Link
                      key={value}
                      href={buildArchiveHref(value, archive.selectedCategory)}
                      className={value === archive.currentPage ? cls.paginationActive : undefined}
                    >
                      {value}
                    </Link>
                  ))}
                </div>

                <Link
                  href={buildArchiveHref(archive.currentPage + 1, archive.selectedCategory)}
                  aria-disabled={archive.currentPage >= archive.totalPages}
                  className={archive.currentPage >= archive.totalPages ? cls.paginationDisabled : undefined}
                >
                  Далее
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
