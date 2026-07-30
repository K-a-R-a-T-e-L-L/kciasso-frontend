"use client";

import { Text, Box, Button } from "@mantine/core";

import { useState } from "react";
import Link from "next/link";
import { IconArrowDown, IconArrowUp, IconEdit, IconExternalLink } from "@tabler/icons-react";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";

type Props = { initialCategories: AdminNewsCategoryDto[]; move: (id: number, direction: "up" | "down") => Promise<{ items: AdminNewsCategoryDto[] }>; deleteCategory: (id: number) => Promise<void> };

export default function AdminCategoryReorder({ initialCategories, move, deleteCategory }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function onMove(id: number, direction: "up" | "down") { if (busy !== null) return; setBusy(id); setError(null); try { setCategories((await move(id, direction)).items); } catch { setError("Не удалось изменить порядок рубрик."); } finally { setBusy(null); } }
  return <>
    {error ? <Text className={""} role="alert">{error}</Text> : null}
    <Box component="table" className={""}><Box component="thead"><Box component="tr"><Box component="th">Рубрика</Box><Box component="th">Slug</Box><Box component="th">Новостей</Box><Box component="th">Статус</Box><Box component="th">Порядок</Box><Box component="th">Действия</Box></Box></Box><Box component="tbody">{categories.map((item, index) => <Box component="tr" key={item.id}>
      <Box component="td"><Text>{item.title}</Text><Text>{item.description ?? "Без описания"}</Text></Box>
      <Box component="td"><Text>{item.slug}</Text></Box>
      <Box component="td"><Text className={""}>{item.newsCount}</Text></Box>
      <Box component="td"><Text className={`${""} ${item.isActive ? "" : ""}`}>{item.isActive ? "Активна" : "Отключена"}</Text></Box>
      <Box component="td"><Box className={""}><Button type="button" aria-label="Переместить рубрику вверх" title="Переместить вверх" disabled={index === 0 || busy !== null} onClick={() => onMove(item.id, "up")}><IconArrowUp size={17} /></Button><Text>{index + 1}</Text><Button type="button" aria-label="Переместить рубрику вниз" title="Переместить вниз" disabled={index === categories.length - 1 || busy !== null} onClick={() => onMove(item.id, "down")}><IconArrowDown size={17} /></Button></Box></Box>
      <Box component="td"><Box className={""}><Link href={`/admin/news/categories/${item.id}/edit`} aria-label={`Редактировать ${item.title}`} title="Редактировать"><IconEdit size={17} /></Link>{item.newsCount === 0 ? <DeleteNewsButton action={() => deleteCategory(item.id)} /> : <Link href={`/admin/news?category=${item.slug}`} aria-label={`Открыть новости ${item.title}`} title="Открыть новости"><IconExternalLink size={17} /></Link>}{item.newsCount === 0 ? null : null}</Box></Box>
    </Box>)}</Box></Box>
  </>;
}
