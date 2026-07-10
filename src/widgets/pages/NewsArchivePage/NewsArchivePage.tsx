import Link from "next/link";
import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import NewsCard from "@/shared/ui/NewsCard/NewsCard";
import { getNewsArchive, getNewsCategory } from "@/shared/api/adapters/news.adapter";
import cls from "./NewsArchivePage.module.scss";

type Props = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
};

function buildArchiveHref(page: number, options?: { category?: string | null; limit?: number; search?: string }) {
  const params = new URLSearchParams();

  if (options?.category) params.set("category", options.category);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.search) params.set("search", options.search);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();

  return query ? `/news?${query}` : "/news";
}

export default async function NewsArchivePage({ page = 1, limit, category, search }: Props) {
  const archive = await getNewsArchive({ page, limit, category, search });
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
                      href={buildArchiveHref(1, { category: item.id, limit, search })}
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
                  href={buildArchiveHref(archive.currentPage - 1, {
                    category: archive.selectedCategory,
                    limit,
                    search,
                  })}
                  aria-disabled={archive.currentPage <= 1}
                  className={archive.currentPage <= 1 ? cls.paginationDisabled : undefined}
                >
                  Назад
                </Link>

                <div className={cls.paginationPages}>
                  {Array.from({ length: archive.totalPages }, (_, index) => index + 1).map((value) => (
                    <Link
                      key={value}
                      href={buildArchiveHref(value, {
                        category: archive.selectedCategory,
                        limit,
                        search,
                      })}
                      className={value === archive.currentPage ? cls.paginationActive : undefined}
                    >
                      {value}
                    </Link>
                  ))}
                </div>

                <Link
                  href={buildArchiveHref(archive.currentPage + 1, {
                    category: archive.selectedCategory,
                    limit,
                    search,
                  })}
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
