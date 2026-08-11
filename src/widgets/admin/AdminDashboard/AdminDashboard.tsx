import type { ReactNode } from "react";
import Link from "next/link";
import {
  Badge,
  Box,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconExternalLink,
  IconFileDescription,
  IconFileText,
  IconNews,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";
import AdminPageHeader from "@/shared/ui/admin/AdminPageHeader";

type RecentNews = {
  id: number;
  title: string;
  categoryTitle: string;
  status: "draft" | "scheduled" | "published";
  updatedAt: string;
};

type RecentDocument = {
  id: number;
  title: string;
  documentNumber?: string;
  status: string;
  fileType?: string;
  updatedAt: string;
};

export type DashboardNewsSummary = {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
  recent: RecentNews[];
};

export type DashboardDocumentsSummary = {
  total: number;
  published: number;
  hidden: number;
  recent: RecentDocument[];
};

export type DashboardUsersSummary = {
  total: number;
  active: number;
};

type Props = {
  displayName: string;
  email: string;
  roleLabel: string;
  generatedAt: string;
  news?: DashboardNewsSummary;
  documents?: DashboardDocumentsSummary;
  users?: DashboardUsersSummary;
  canManageSiteSettings: boolean;
  quickActions: ReactNode;
};

const newsStatus: Record<RecentNews["status"], { label: string; color: string }> = {
  draft: { label: "Черновик", color: "gray" },
  scheduled: { label: "Запланировано", color: "yellow" },
  published: { label: "Опубликовано", color: "teal" },
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Дата не указана";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatCard({
  testId,
  icon,
  label,
  value,
  helper,
  href,
}: {
  testId: string;
  icon: ReactNode;
  label: string;
  value: number;
  helper: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <Card data-testid={testId} withBorder shadow="sm" p="lg" style={{ cursor: "pointer" }}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={3}>
            <Text size="sm" c="dimmed" fw={700}>
              {label}
            </Text>
            <Text fz={34} lh={1.1} fw={900} c="kciassoBlue.8">
              {value}
            </Text>
            <Text size="xs" c="dimmed">
              {helper}
            </Text>
          </Stack>
          <ThemeIcon size={44} radius="md" variant="light">
            {icon}
          </ThemeIcon>
        </Group>
      </Card>
    </Link>
  );
}

function AttentionLink({ href, label, count }: { href: string; label: string; count: number }) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <Card withBorder p="md" style={{ cursor: "pointer" }}>
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon variant="light" color={count > 0 ? "orange" : "gray"}>
              <IconAlertCircle size={18} />
            </ThemeIcon>
            <Text fw={700}>{label}</Text>
          </Group>
          <Badge color={count > 0 ? "orange" : "gray"} variant="light" size="lg">
            {count}
          </Badge>
        </Group>
      </Card>
    </Link>
  );
}

function NavigationCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <Card withBorder p="lg" style={{ cursor: "pointer" }}>
        <Stack gap="sm">
          <ThemeIcon size={40} radius="md" variant="light">
            {icon}
          </ThemeIcon>
          <Box>
            <Text fw={800}>{title}</Text>
            <Text size="sm" c="dimmed" mt={3}>
              {description}
            </Text>
          </Box>
        </Stack>
      </Card>
    </Link>
  );
}

export default function AdminDashboard({
  displayName,
  email,
  roleLabel,
  generatedAt,
  news,
  documents,
  users,
  canManageSiteSettings,
  quickActions,
}: Props) {
  return (
    <Stack gap="xl" data-testid="admin-dashboard">
      <AdminPageHeader
        eyebrow="Обзор"
        title={`Добро пожаловать, ${displayName}`}
        description="Основные показатели сайта, последние материалы и быстрый доступ к разделам управления."
        actions={
          <Stack gap={1} ta={{ base: "left", sm: "right" }}>
            <Text size="sm" fw={700}>{email}</Text>
            <Text size="xs" c="dimmed">{roleLabel}</Text>
            <Text size="xs" c="dimmed">Обновлено: {formatDate(generatedAt)}</Text>
          </Stack>
        }
      />

      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
        {news ? (
          <>
            <StatCard testId="dashboard-stat-news" icon={<IconNews size={23} />} label="Новости" value={news.total} helper={`${news.draft} черновика · ${news.scheduled} запланировано`} href="/admin/news" />
            <StatCard testId="dashboard-stat-published-news" icon={<IconFileDescription size={23} />} label="Опубликовано новостей" value={news.published} helper="Доступны на публичном сайте" href="/admin/news?status=published" />
          </>
        ) : null}
        {documents ? (
          <StatCard testId="dashboard-stat-documents" icon={<IconFileText size={23} />} label="Документы" value={documents.total} helper={`${documents.published} опубликовано`} href="/admin/documents" />
        ) : null}
        {users ? (
          <StatCard testId="dashboard-stat-users" icon={<IconUsers size={23} />} label="Активные администраторы" value={users.active} helper={`Всего учётных записей: ${users.total}`} href="/admin/users?status=active" />
        ) : null}
      </SimpleGrid>

      <Paper withBorder shadow="sm" p={{ base: "md", sm: "lg" }}>
        <Stack gap="md">
          <Box>
            <Title order={2} size="h3">Быстрые действия</Title>
            <Text size="sm" c="dimmed">Частые операции без поиска нужного раздела.</Text>
          </Box>
          <Group gap="sm">{quickActions}</Group>
        </Stack>
      </Paper>

      {(news || documents) ? (
        <Stack gap="md">
          <Box>
            <Title order={2} size="h3">Требуют внимания</Title>
            <Text size="sm" c="dimmed">Материалы в промежуточных состояниях.</Text>
          </Box>
          <SimpleGrid cols={{ base: 1, md: news && documents ? 3 : 2 }}>
            {news ? <AttentionLink href="/admin/news?status=draft" label="Черновики новостей" count={news.draft} /> : null}
            {news ? <AttentionLink href="/admin/news?status=scheduled" label="Запланированные новости" count={news.scheduled} /> : null}
            {documents ? <AttentionLink href="/admin/documents?scope=all&status=UNLISTED" label="Скрытые документы" count={documents.hidden} /> : null}
          </SimpleGrid>
        </Stack>
      ) : null}

      {(news || documents) ? (
        <SimpleGrid cols={{ base: 1, lg: news && documents ? 2 : 1 }}>
          {news ? (
            <Paper withBorder shadow="sm" p={{ base: "md", sm: "lg" }}>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={2} size="h3">Последние новости</Title>
                  <AdminLinkButton href="/admin/news" variant="subtle" size="xs">Все новости</AdminLinkButton>
                </Group>
                {news.recent.length ? news.recent.map((item) => {
                  const status = newsStatus[item.status];
                  return (
                    <Card key={item.id} withBorder p="sm">
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Stack gap={2} miw={0}>
                          <Text fw={700} lineClamp={1}>{item.title}</Text>
                          <Text size="xs" c="dimmed">{item.categoryTitle} · {formatDate(item.updatedAt)}</Text>
                        </Stack>
                        <Badge color={status.color} variant="light">{status.label}</Badge>
                      </Group>
                    </Card>
                  );
                }) : <Text c="dimmed">Новостей пока нет.</Text>}
              </Stack>
            </Paper>
          ) : null}

          {documents ? (
            <Paper withBorder shadow="sm" p={{ base: "md", sm: "lg" }}>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={2} size="h3">Последние документы</Title>
                  <AdminLinkButton href="/admin/documents" variant="subtle" size="xs">Все документы</AdminLinkButton>
                </Group>
                {documents.recent.length ? documents.recent.map((item) => (
                  <Card key={item.id} withBorder p="sm">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Stack gap={2} miw={0}>
                        <Text fw={700} lineClamp={1}>{item.title}</Text>
                        <Text size="xs" c="dimmed">
                          {item.fileType ?? "Файл"}{item.documentNumber ? ` · № ${item.documentNumber}` : ""} · {formatDate(item.updatedAt)}
                        </Text>
                      </Stack>
                      <Badge color={item.status === "PUBLISHED" ? "teal" : "gray"} variant="light">
                        {item.status === "PUBLISHED" ? "Опубликован" : "Не опубликован"}
                      </Badge>
                    </Group>
                  </Card>
                )) : <Text c="dimmed">Документов пока нет.</Text>}
              </Stack>
            </Paper>
          ) : null}
        </SimpleGrid>
      ) : null}

      <Stack gap="md">
        <Box>
          <Title order={2} size="h3">Разделы управления</Title>
          <Text size="sm" c="dimmed">Все доступные инструменты в одном месте.</Text>
        </Box>
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
          {news ? <NavigationCard href="/admin/news" title="Новости и рубрики" description="Создание, публикация и распределение новостей по рубрикам." icon={<IconNews size={22} />} /> : null}
          {documents ? <NavigationCard href="/admin/documents" title="Материалы и документы" description="Файлы, версии и размещение документов по разделам." icon={<IconFileText size={22} />} /> : null}
          {canManageSiteSettings ? <NavigationCard href="/admin/pages" title="Страницы и секции" description="Порядок, видимость и содержимое страниц сайта." icon={<IconFileDescription size={22} />} /> : null}
          {canManageSiteSettings ? <NavigationCard href="/admin/settings" title="Настройки сайта" description="Контактные данные и общие параметры сайта." icon={<IconSettings size={22} />} /> : null}
          {users ? <NavigationCard href="/admin/users" title="Пользователи и права" description="Администраторы, роли и доступ к разделам." icon={<IconUsers size={22} />} /> : null}
        </SimpleGrid>
      </Stack>

      <Link href="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <Paper withBorder p={{ base: "lg", sm: "xl" }} bg="kciassoBlue.9" c="white">
          <Group justify="space-between" wrap="nowrap">
            <Box>
              <Title order={2} size="h3" c="white">Публичная версия сайта</Title>
              <Text c="kciassoBlue.1" mt={4}>Посмотреть опубликованные материалы так, как их видят посетители.</Text>
            </Box>
            <IconExternalLink size={26} aria-hidden="true" />
          </Group>
        </Paper>
      </Link>
    </Stack>
  );
}
