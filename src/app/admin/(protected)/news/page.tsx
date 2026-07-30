import { redirect } from "next/navigation";
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  GridCol,
  Group,
  Image,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  TextInput,
} from "@mantine/core";
import { IconFolders, IconPlus, IconSearch } from "@tabler/icons-react";

import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories, getAdminNewsList } from "@/shared/api/adapters/admin-news.adapter";
import AdminPageHeader from "@/shared/ui/admin/AdminPageHeader";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";
import AdminNewsListActions from "@/widgets/admin/AdminNewsListActions/AdminNewsListActions.client";
import { isOwnedNewsMediaUrl } from "@/shared/news/news-cover";
import { deleteNewsAction } from "./actions";

type SearchParams = {
  page?: string;
  category?: string;
  search?: string;
  status?: string;
  sort?: string;
};

function formatDate(value?: string | null) {
  if (!value) return "Не опубликовано";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Не опубликовано";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function hrefFor(page: number, params: SearchParams) {
  const search = new URLSearchParams();
  if (page > 1) search.set("page", String(page));
  for (const key of ["category", "search", "status", "sort"] as const) {
    const value = params[key]?.trim();
    if (value) search.set(key, value);
  }
  return search.size ? `/admin/news?${search}` : "/admin/news";
}

function publicationStatus(item: { publishedAt?: string | null; status?: string }) {
  if (item.status === "scheduled") return { label: "Запланировано", color: "yellow" };
  if (item.publishedAt || item.status === "published") return { label: "Опубликовано", color: "teal" };
  return { label: "Черновик", color: "gray" };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const category = params.category?.trim() || undefined;
  const { token } = await requireAdminSectionToken("news");

  let archive;
  let categories;
  try {
    [archive, categories] = await Promise.all([
      getAdminNewsList(token, { page, limit: 20, category }),
      getAdminNewsCategories(token),
    ]);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }
    if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
    throw error;
  }

  const needle = params.search?.trim().toLocaleLowerCase("ru-RU") ?? "";
  const requestedStatus = params.status?.trim() ?? "";
  const sort = params.sort === "title" || params.sort === "oldest" ? params.sort : "newest";
  const items = archive.items
    .filter((item) => !needle || `${item.title} ${item.slug} ${item.excerpt}`.toLocaleLowerCase("ru-RU").includes(needle))
    .filter((item) => !requestedStatus || publicationStatus(item).label === requestedStatus)
    .sort((left, right) => {
      if (sort === "title") return left.title.localeCompare(right.title, "ru-RU");
      const delta = new Date(left.publishedAt ?? 0).getTime() - new Date(right.publishedAt ?? 0).getTime();
      return sort === "oldest" ? delta : -delta;
    });

  return (
    <Stack gap="lg">
      <AdminPageHeader
        eyebrow="Контент"
        title="Новости и рубрики"
        description="Управление новостями, публикациями и обложками."
        actions={(
          <Group gap="sm">
            <AdminLinkButton href="/admin/news/categories" variant="light" leftSection={<IconFolders size={18} />}>
              Управление рубриками
            </AdminLinkButton>
            <AdminLinkButton href="/admin/news/new" leftSection={<IconPlus size={18} />}>Создать новость</AdminLinkButton>
          </Group>
        )}
      />

      <Paper p={{ base: "md", sm: "lg" }} shadow="sm" withBorder>
        <Box component="form" action="/admin/news" method="get">
          <Grid align="flex-end">
            <GridCol span={{ base: 12, md: 4 }}>
              <TextInput name="search" label="Поиск" placeholder="Заголовок, slug или текст" defaultValue={params.search ?? ""} leftSection={<IconSearch size={16} />} />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}>
              <Select name="category" label="Рубрика" clearable defaultValue={category ?? null} data={categories.map((item) => ({ value: item.slug, label: `${item.title} (${item.newsCount})` }))} />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}>
              <Select name="status" label="Статус" clearable defaultValue={requestedStatus || null} data={["Черновик", "Запланировано", "Опубликовано"]} />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}>
              <Select name="sort" label="Сортировка" defaultValue={sort} data={[{ value: "newest", label: "Сначала новые" }, { value: "oldest", label: "Сначала старые" }, { value: "title", label: "По названию" }]} />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}>
              <Group gap="xs" wrap="nowrap">
                <Button type="submit" flex={1}>Применить</Button>
                <Anchor href="/admin/news" size="sm">Сбросить</Anchor>
              </Group>
            </GridCol>
          </Grid>
        </Box>
      </Paper>

      {items.length === 0 ? (
        <Paper p="xl" ta="center" withBorder><Text c="dimmed">Новости по выбранным фильтрам не найдены.</Text></Paper>
      ) : (
        <>
          <Paper visibleFrom="sm" shadow="sm" withBorder>
            <TableScrollContainer minWidth={940}>
              <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="md">
                <TableThead>
                  <TableTr><TableTh>Новость</TableTh><TableTh>Рубрика</TableTh><TableTh>Статус</TableTh><TableTh>Публикация</TableTh><TableTh ta="right">Действия</TableTh></TableTr>
                </TableThead>
                <TableTbody>
                  {items.map((item) => {
                    const state = publicationStatus(item);
                    return (
                      <TableTr key={item.id}>
                        <TableTd>
                          <Group gap="sm" wrap="nowrap">
                            <Image src={item.coverImageUrl && isOwnedNewsMediaUrl(item.coverImageUrl) ? item.coverImageUrl : "/images/news-placeholder.svg"} alt="" w={92} h={58} radius="sm" fit="cover" fallbackSrc="/images/news-placeholder.svg" />
                            <Stack gap={2} miw={0}><Text fw={700} lineClamp={1}>{item.title}</Text><Text size="xs" c="dimmed" lineClamp={1}>/{item.slug}</Text></Stack>
                          </Group>
                        </TableTd>
                        <TableTd><Text size="sm">{item.category?.title ?? "Без рубрики"}</Text></TableTd>
                        <TableTd><Badge color={state.color} variant="light">{state.label}</Badge></TableTd>
                        <TableTd><Text size="sm">{formatDate(item.publishedAt)}</Text></TableTd>
                        <TableTd><AdminNewsListActions id={item.id} deleteAction={deleteNewsAction.bind(null, item.id)} /></TableTd>
                      </TableTr>
                    );
                  })}
                </TableTbody>
              </Table>
            </TableScrollContainer>
          </Paper>

          <SimpleGrid cols={1} hiddenFrom="sm">
            {items.map((item) => {
              const state = publicationStatus(item);
              return (
                <Card key={item.id} padding="md" withBorder shadow="sm">
                  <Stack gap="sm">
                    <Image src={item.coverImageUrl && isOwnedNewsMediaUrl(item.coverImageUrl) ? item.coverImageUrl : "/images/news-placeholder.svg"} alt="" h={150} radius="sm" fit="cover" fallbackSrc="/images/news-placeholder.svg" />
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Stack gap={2} miw={0}><Text fw={800} lineClamp={2}>{item.title}</Text><Text size="xs" c="dimmed">/{item.slug}</Text></Stack>
                      <Badge color={state.color} variant="light">{state.label}</Badge>
                    </Group>
                    <Text size="sm">{item.category?.title ?? "Без рубрики"} · {formatDate(item.publishedAt)}</Text>
                    <AdminNewsListActions id={item.id} deleteAction={deleteNewsAction.bind(null, item.id)} />
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </>
      )}

      <Group justify="space-between">
        <AdminLinkButton href={hrefFor(Math.max(1, page - 1), params)} variant="light" disabled={page <= 1}>Назад</AdminLinkButton>
        <Text size="sm" c="dimmed">Страница {archive.meta.page} из {archive.meta.totalPages}</Text>
        <AdminLinkButton href={hrefFor(page + 1, params)} variant="light" disabled={archive.meta.page >= archive.meta.totalPages}>Далее</AdminLinkButton>
      </Group>
    </Stack>
  );
}
