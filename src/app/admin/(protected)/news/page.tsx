import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories, getAdminNewsList } from "@/shared/api/adapters/admin-news.adapter";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";
import { deleteNewsAction } from "./actions";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

type Props = {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Не опубликовано";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Не опубликовано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildNewsHref(page: number, category?: string) {
  const search = new URLSearchParams();

  if (page > 1) {
    search.set("page", String(page));
  }

  if (category) {
    search.set("category", category);
  }

  const query = search.toString();
  return query ? `/admin/news?${query}` : "/admin/news";
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const category = typeof params.category === "string" && params.category.trim() ? params.category.trim() : undefined;
  const { token, user } = await requireAdminSectionToken("news");

  let archive;
  let categories;

  try {
    [archive, categories] = await Promise.all([
      getAdminNewsList(token, {
        page,
        limit: 10,
        category,
      }),
      getAdminNewsCategories(token),
    ]);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }

    if (isAdminApiErrorStatus(error, 403)) {
      redirect("/admin/forbidden");
    }

    throw error;
  }

  const activeCategory = category ? categories.find((item) => item.slug === category) ?? null : null;

  return (
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Новости</span>
          <h1>{activeCategory ? `Новости рубрики: ${activeCategory.title}` : "Новости и рубрики"}</h1>
          <p>
            Авторизован как {user.email}. Сначала выберите рубрику, затем работайте с новостями внутри неё. Если
            рубрика не выбрана, показываются все записи.
          </p>
        </div>
        <div className={cls.headerActions}>
          <Link href="/admin/news/categories" className={cls.secondaryAction}>
            Управление рубриками
          </Link>
          <Link href="/admin/news/new" className={cls.primaryAction}>
            Создать новость
          </Link>
        </div>
      </div>

      <div className={cls.tableCard}>
        <div className={cls.filtersBlock}>
          <div className={cls.filtersHeader}>
            <strong>Рубрики</strong>
            <span>Откройте рубрику, чтобы увидеть только её новости.</span>
          </div>

          <div className={cls.filtersList}>
            <Link
              href="/admin/news"
              className={!activeCategory ? cls.filterChipActive : cls.filterChip}
            >
              Все новости
            </Link>

            {categories.map((item) => (
              <Link
                key={item.id}
                href={buildNewsHref(1, item.slug)}
                className={activeCategory?.slug === item.slug ? cls.filterChipActive : cls.filterChip}
              >
                {item.title}
                <span>{item.newsCount}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={cls.tableWrap}>
          <table className={cls.table}>
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Slug</th>
                <th>Рубрика</th>
                <th>Статус</th>
                <th>Публикация</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {archive.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <span>{item.excerpt}</span>
                  </td>
                  <td>{item.slug}</td>
                  <td>{item.category?.title ?? "Без рубрики"}</td>
                  <td>
                    <span
                      className={
                        item.status === "published"
                          ? cls.statusPublished
                          : item.status === "scheduled"
                            ? cls.statusScheduled
                            : cls.statusDraft
                      }
                    >
                      {item.status === "published"
                        ? "Опубликовано"
                        : item.status === "scheduled"
                          ? "Запланировано"
                          : "Черновик"}
                    </span>
                  </td>
                  <td>{formatDate(item.publishedAt)}</td>
                  <td>
                    <div className={cls.tableActions}>
                      <Link href={`/admin/news/${item.id}/edit`}>Редактировать</Link>
                      <DeleteNewsButton action={deleteNewsAction.bind(null, item.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {archive.items.length === 0 ? (
          <p className={cls.emptyState}>
            {activeCategory
              ? `В рубрике "${activeCategory.title}" пока нет новостей.`
              : "Новости пока не найдены."}
          </p>
        ) : null}

        <div className={cls.pagination}>
          <Link
            href={page > 1 ? buildNewsHref(page - 1, category) : buildNewsHref(1, category)}
            aria-disabled={page <= 1}
            className={page <= 1 ? cls.paginationDisabled : undefined}
          >
            Назад
          </Link>
          <span>
            Страница {archive.meta.page} из {archive.meta.totalPages}
          </span>
          <Link
            href={buildNewsHref(page + 1, category)}
            aria-disabled={archive.meta.page >= archive.meta.totalPages}
            className={archive.meta.page >= archive.meta.totalPages ? cls.paginationDisabled : undefined}
          >
            Далее
          </Link>
        </div>
      </div>
    </section>
  );
}
