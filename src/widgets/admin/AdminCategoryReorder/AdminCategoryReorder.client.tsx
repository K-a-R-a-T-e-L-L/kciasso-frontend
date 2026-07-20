"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowDown, IconArrowUp, IconEdit, IconExternalLink } from "@tabler/icons-react";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";
import cls from "./AdminCategoryReorder.module.scss";

type Props = { initialCategories: AdminNewsCategoryDto[]; move: (id: number, direction: "up" | "down") => Promise<{ items: AdminNewsCategoryDto[] }>; deleteCategory: (id: number) => Promise<void> };

export default function AdminCategoryReorder({ initialCategories, move, deleteCategory }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function onMove(id: number, direction: "up" | "down") { if (busy !== null) return; setBusy(id); setError(null); try { setCategories((await move(id, direction)).items); } catch { setError("Не удалось изменить порядок рубрик."); } finally { setBusy(null); } }
  return <>
    {error ? <p className={cls.error} role="alert">{error}</p> : null}
    <table className={cls.table}><thead><tr><th>Рубрика</th><th>Slug</th><th>Новостей</th><th>Статус</th><th>Порядок</th><th>Действия</th></tr></thead><tbody>{categories.map((item, index) => <tr key={item.id}>
      <td><strong>{item.title}</strong><span>{item.description ?? "Без описания"}</span></td>
      <td><span>{item.slug}</span></td>
      <td><span className={cls.countBadge}>{item.newsCount}</span></td>
      <td><span className={`${cls.status} ${item.isActive ? cls.active : cls.inactive}`}>{item.isActive ? "Активна" : "Отключена"}</span></td>
      <td><div className={cls.actions}><button type="button" aria-label="Переместить рубрику вверх" title="Переместить вверх" disabled={index === 0 || busy !== null} onClick={() => onMove(item.id, "up")}><IconArrowUp size={17} /></button><strong>{index + 1}</strong><button type="button" aria-label="Переместить рубрику вниз" title="Переместить вниз" disabled={index === categories.length - 1 || busy !== null} onClick={() => onMove(item.id, "down")}><IconArrowDown size={17} /></button></div></td>
      <td><div className={cls.actions}><Link href={`/admin/news/categories/${item.id}/edit`} aria-label={`Редактировать ${item.title}`} title="Редактировать"><IconEdit size={17} /></Link>{item.newsCount === 0 ? <DeleteNewsButton action={() => deleteCategory(item.id)} /> : <Link href={`/admin/news?category=${item.slug}`} aria-label={`Открыть новости ${item.title}`} title="Открыть новости"><IconExternalLink size={17} /></Link>}{item.newsCount === 0 ? null : null}</div></td>
    </tr>)}</tbody></table>
  </>;
}
