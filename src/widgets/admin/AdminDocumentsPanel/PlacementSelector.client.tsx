"use client";

import { Box, Title, Text, Button } from "@mantine/core";

import { useEffect, useMemo, useState } from "react";
import { IconChevronDown, IconSearch, IconSelectAll, IconTrash, IconX } from "@tabler/icons-react";
import { DOCUMENT_PLACEMENT_GROUPS } from "@/shared/documents/document-placement-registry";

export type PlacementSelectorProps = {
  value: string[];
  onApply: (keys: string[]) => void;
  onCancel: () => void;
  allowedGroupIds?: string[];
};

export default function PlacementSelector({ value, onApply, onCancel, allowedGroupIds }: PlacementSelectorProps) {
  const [draft, setDraft] = useState(value);
  const [query, setQuery] = useState("");
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
  const groups = useMemo(
    () => DOCUMENT_PLACEMENT_GROUPS.filter((group) => !allowedGroupIds || allowedGroupIds.includes(group.id)).map((group) => ({
      ...group,
      allItems: group.items,
      items: group.items.filter((item) => !normalizedQuery || `${group.title} ${item.title}`.toLocaleLowerCase("ru-RU").includes(normalizedQuery)),
    })).filter((group) => group.items.length > 0),
    [allowedGroupIds, normalizedQuery],
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
    setOpenGroupId(normalized ? DOCUMENT_PLACEMENT_GROUPS.filter((group) => !allowedGroupIds || allowedGroupIds.includes(group.id)).find((group) => group.items.some((item) => `${group.title} ${item.title}`.toLocaleLowerCase("ru-RU").includes(normalized)))?.id ?? null : null);
  };
  const toggleGroup = (id: string) => setOpenGroupId((current) => current === id ? null : id);

  return (
    <Box className={""} role="dialog" aria-modal="true" aria-labelledby="placement-selector-title">
      <Box className={""}>
        <Box className={""}>
          <Box>
            <Title id="placement-selector-title">Выбор размещений</Title>
            <Text className={""}>Выбрано разделов: {draft.length}</Text>
          </Box>
          <Button type="button" className={""} onClick={onCancel} aria-label="Закрыть"><IconX size={22} stroke={1.8} aria-hidden="true" /></Button>
        </Box>
        <Box component="label" className={""}>
          <IconSearch size={20} stroke={1.8} aria-hidden="true" />
          <Box component="input" className={""} value={query} onChange={(event: any) => handleSearchChange(event.target.value)} placeholder="Поиск по названию раздела" aria-label="Поиск по названию раздела" />
        </Box>
        <Box className={""}>
          {groups.map((group) => {
            const selected = group.allItems.filter((item) => draft.includes(item.key)).length;
            const expanded = openGroupId === group.id;
            return (
              <Box component="section" className={""} key={group.id}>
                <Button type="button" className={""} onClick={() => toggleGroup(group.id)} aria-expanded={expanded}>
                  <Text><Text>{group.title}</Text><Text>выбрано {selected} из {group.allItems.length}</Text></Text>
                  <IconChevronDown className={""} data-expanded={expanded ? "true" : "false"} size={20} stroke={1.8} aria-hidden="true" />
                </Button>
                {expanded ? <>
                  <Box className={""}>
                    <Button type="button" onClick={() => setDraft((current) => [...new Set([...current, ...group.allItems.map((item) => item.key)])])}><IconSelectAll size={17} stroke={1.8} aria-hidden="true" />Выбрать все</Button>
                    <Button type="button" onClick={() => setDraft((current) => current.filter((key) => !group.allItems.some((item) => item.key === key)))}><IconTrash size={17} stroke={1.8} aria-hidden="true" />Очистить</Button>
                  </Box>
                  <Box className={""}>{group.items.map((item) => <Box component="label" className={""} key={item.key}><Box component="input" type="checkbox" checked={draft.includes(item.key)} onChange={() => toggle(item.key)} /><Text>{item.title}</Text></Box>)}</Box>
                </> : null}
              </Box>
            );
          })}
          {groups.length === 0 ? <Text className={""}>Ничего не найдено.</Text> : null}
        </Box>
        <Box className={""}><Button type="button" className={""} onClick={() => onApply(draft)}>Применить</Button><Button type="button" onClick={onCancel}>Отмена</Button></Box>
      </Box>
    </Box>
  );
}
