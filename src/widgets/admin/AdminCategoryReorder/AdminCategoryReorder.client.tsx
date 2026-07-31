"use client";

import {
  ActionIcon,
  Alert,
  Badge,
  Group,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import Link from "next/link";
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconExternalLink,
  IconTrash,
} from "@tabler/icons-react";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";

type Props = {
  initialCategories: AdminNewsCategoryDto[];
  move: (id: number, direction: "up" | "down") => Promise<{ items: AdminNewsCategoryDto[] }>;
  deleteCategory: (id: number) => Promise<void>;
};

export default function AdminCategoryReorder({ initialCategories, move, deleteCategory }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onMove(id: number, direction: "up" | "down") {
    if (busy !== null) return;
    setBusy(id);
    setError(null);
    try {
      setCategories((await move(id, direction)).items);
    } catch {
      setError("Не удалось изменить порядок рубрик.");
    } finally {
      setBusy(null);
    }
  }

  function remove(item: AdminNewsCategoryDto) {
    modals.openConfirmModal({
      title: `Удалить рубрику «${item.title}»?`,
      children: "Удалить можно только пустую рубрику. Действие нельзя отменить.",
      labels: { confirm: "Удалить", cancel: "Отмена" },
      confirmProps: { color: "red" },
      onConfirm: () => void deleteCategory(item.id),
    });
  }

  if (!categories.length) return <Text c="dimmed">Рубрики пока не созданы.</Text>;
  return (
    <>
      {error ? <Alert color="red" role="alert" mb="md">{error}</Alert> : null}
      <TableScrollContainer minWidth={760}>
        <Table striped highlightOnHover verticalSpacing="sm">
          <TableThead>
            <TableTr>
              <TableTh>Рубрика</TableTh>
              <TableTh>Адрес</TableTh>
              <TableTh>Новостей</TableTh>
              <TableTh>Статус</TableTh>
              <TableTh>Порядок</TableTh>
              <TableTh ta="right">Действия</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {categories.map((item, index) => (
              <TableTr key={item.id}>
                <TableTd>
                  <Text fw={700}>{item.title}</Text>
                  <Text size="sm" c="dimmed">{item.description ?? "Без описания"}</Text>
                </TableTd>
                <TableTd><Text size="sm">/{item.slug}</Text></TableTd>
                <TableTd><Badge variant="light">{item.newsCount}</Badge></TableTd>
                <TableTd><Badge color={item.isActive ? "teal" : "gray"}>{item.isActive ? "Активна" : "Отключена"}</Badge></TableTd>
                <TableTd>
                  <Group gap={4} wrap="nowrap">
                    <Tooltip label="Переместить вверх">
                      <ActionIcon
                        size={44}
                        variant="subtle"
                        aria-label={`Переместить рубрику ${item.title} вверх`}
                        disabled={index === 0 || busy !== null}
                        onClick={() => void onMove(item.id, "up")}
                      >
                        <IconArrowUp size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Text w={24} ta="center">{index + 1}</Text>
                    <Tooltip label="Переместить вниз">
                      <ActionIcon
                        size={44}
                        variant="subtle"
                        aria-label={`Переместить рубрику ${item.title} вниз`}
                        disabled={index === categories.length - 1 || busy !== null}
                        onClick={() => void onMove(item.id, "down")}
                      >
                        <IconArrowDown size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </TableTd>
                <TableTd>
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <Tooltip label="Редактировать">
                      <ActionIcon size={44} component={Link} href={`/admin/news/categories/${item.id}/edit`} variant="subtle" aria-label={`Редактировать ${item.title}`}>
                        <IconEdit size={18} />
                      </ActionIcon>
                    </Tooltip>
                    {item.newsCount === 0 ? (
                      <Tooltip label="Удалить">
                        <ActionIcon size={44} color="red" variant="subtle" aria-label={`Удалить ${item.title}`} onClick={() => remove(item)}>
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Tooltip>
                    ) : (
                      <Tooltip label="Открыть новости">
                        <ActionIcon size={44} component={Link} href={`/admin/news?category=${encodeURIComponent(item.slug)}`} variant="subtle" aria-label={`Открыть новости ${item.title}`}>
                          <IconExternalLink size={18} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </TableTd>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      </TableScrollContainer>
    </>
  );
}
