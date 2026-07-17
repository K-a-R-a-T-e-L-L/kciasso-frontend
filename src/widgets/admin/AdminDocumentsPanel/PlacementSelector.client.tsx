"use client";

import { useEffect, useMemo, useState } from "react";
import { IconChevronDown, IconSearch, IconSelectAll, IconTrash, IconX } from "@tabler/icons-react";
import { DOCUMENT_PLACEMENT_GROUPS } from "@/shared/documents/document-placement-registry";
import cls from "./PlacementSelector.module.scss";

export type PlacementSelectorProps = {
  value: string[];
  onApply: (keys: string[]) => void;
  onCancel: () => void;
};

export default function PlacementSelector({ value, onApply, onCancel }: PlacementSelectorProps) {
  const [draft, setDraft] = useState(value);
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
  const groups = useMemo(
    () => DOCUMENT_PLACEMENT_GROUPS.map((group) => ({
      ...group,
      allItems: group.items,
      items: group.items.filter((item) => !normalizedQuery || `${group.title} ${item.title}`.toLocaleLowerCase("ru-RU").includes(normalizedQuery)),
    })).filter((group) => group.items.length > 0),
    [normalizedQuery],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  const toggle = (key: string) => setDraft((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const handleSearchChange = (nextQuery: string) => {
    setQuery(nextQuery);
    const normalized = nextQuery.trim().toLocaleLowerCase("ru-RU");
    setOpenGroups(normalized ? DOCUMENT_PLACEMENT_GROUPS.filter((group) => group.items.some((item) => `${group.title} ${item.title}`.toLocaleLowerCase("ru-RU").includes(normalized))).map((group) => group.id) : []);
  };
  const toggleGroup = (id: string) => setOpenGroups((current) => current.includes(id) ? [] : [id]);

  return (
    <div className={cls.overlay} role="dialog" aria-modal="true" aria-labelledby="placement-selector-title">
      <div className={cls.placementModal}>
        <div className={cls.modalHeader}>
          <div>
            <h2 id="placement-selector-title">Выбор размещений</h2>
            <p className={cls.selectedSummary}>Выбрано разделов: {draft.length}</p>
          </div>
          <button type="button" className={cls.close} onClick={onCancel} aria-label="Закрыть"><IconX size={22} stroke={1.8} aria-hidden="true" /></button>
        </div>
        <label className={cls.placementSearchWrap}>
          <IconSearch size={20} stroke={1.8} aria-hidden="true" />
          <input className={cls.placementSearch} value={query} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Поиск по названию раздела" aria-label="Поиск по названию раздела" />
        </label>
        <div className={cls.placementGroups}>
          {groups.map((group) => {
            const selected = group.allItems.filter((item) => draft.includes(item.key)).length;
            const expanded = openGroups.includes(group.id);
            return (
              <section className={cls.placementGroup} key={group.id}>
                <button type="button" className={cls.groupHeader} onClick={() => toggleGroup(group.id)} aria-expanded={expanded}>
                  <span><strong>{group.title}</strong><small>выбрано {selected} из {group.allItems.length}</small></span>
                  <IconChevronDown className={cls.groupChevron} data-expanded={expanded ? "true" : "false"} size={20} stroke={1.8} aria-hidden="true" />
                </button>
                {expanded ? <>
                  <div className={cls.groupActions}>
                    <button type="button" onClick={() => setDraft((current) => [...new Set([...current, ...group.allItems.map((item) => item.key)])])}><IconSelectAll size={17} stroke={1.8} aria-hidden="true" />Выбрать все</button>
                    <button type="button" onClick={() => setDraft((current) => current.filter((key) => !group.allItems.some((item) => item.key === key)))}><IconTrash size={17} stroke={1.8} aria-hidden="true" />Очистить</button>
                  </div>
                  <div className={cls.placementRows}>{group.items.map((item) => <label className={cls.placementRow} key={item.key}><input type="checkbox" checked={draft.includes(item.key)} onChange={() => toggle(item.key)} /><span>{item.title}</span></label>)}</div>
                </> : null}
              </section>
            );
          })}
          {groups.length === 0 ? <p className={cls.noResults}>Ничего не найдено.</p> : null}
        </div>
        <div className={cls.modalActions}><button type="button" className={cls.primary} onClick={() => onApply(draft)}>Применить</button><button type="button" onClick={onCancel}>Отмена</button></div>
      </div>
    </div>
  );
}
