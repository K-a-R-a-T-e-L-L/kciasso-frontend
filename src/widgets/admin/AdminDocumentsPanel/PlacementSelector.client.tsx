"use client";

import {
  Accordion,
  Button,
  Checkbox,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { IconSearch, IconSelectAll, IconTrash } from "@tabler/icons-react";
import { DOCUMENT_PLACEMENT_GROUPS } from "@/shared/documents/document-placement-registry";

export type PlacementSelectorProps = {
  value: string[];
  onApply: (keys: string[]) => void;
  onCancel: () => void;
  allowedGroupIds?: string[];
};

export default function PlacementSelector({
  value,
  onApply,
  onCancel,
  allowedGroupIds,
}: PlacementSelectorProps) {
  const [draft, setDraft] = useState(value);
  const [query, setQuery] = useState("");
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
  const groups = useMemo(
    () =>
      DOCUMENT_PLACEMENT_GROUPS
        .filter((group) => !allowedGroupIds || allowedGroupIds.includes(group.id))
        .map((group) => ({
          ...group,
          allItems: group.items,
          items: group.items.filter(
            (item) =>
              !normalizedQuery
              || `${group.title} ${item.title}`.toLocaleLowerCase("ru-RU").includes(normalizedQuery),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [allowedGroupIds, normalizedQuery],
  );

  const handleSearchChange = (nextQuery: string) => {
    setQuery(nextQuery);
    const normalized = nextQuery.trim().toLocaleLowerCase("ru-RU");
    setOpenGroupId(
      normalized
        ? DOCUMENT_PLACEMENT_GROUPS
          .filter((group) => !allowedGroupIds || allowedGroupIds.includes(group.id))
          .find((group) =>
            group.items.some((item) =>
              `${group.title} ${item.title}`.toLocaleLowerCase("ru-RU").includes(normalized),
            ),
          )?.id ?? null
        : null,
    );
  };

  return (
    <Modal
      opened
      onClose={onCancel}
      title="Выбор размещений"
      size="lg"
      aria-label="Выбор размещений"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">Выбрано разделов: {draft.length}</Text>
        <TextInput
          value={query}
          onChange={(event) => handleSearchChange(event.currentTarget.value)}
          label="Поиск по названию раздела"
          placeholder="Начните вводить название"
          leftSection={<IconSearch size={18} />}
        />
        <ScrollArea.Autosize mah="55vh" viewportProps={{ tabIndex: 0 }}>
          {groups.length ? (
            <Accordion
              value={openGroupId}
              onChange={setOpenGroupId}
              variant="contained"
              transitionDuration={0}
            >
              {groups.map((group) => {
                const selected = group.allItems.filter((item) => draft.includes(item.key)).length;
                return (
                  <Accordion.Item key={group.id} value={group.id}>
                    <Accordion.Control>
                      <Group justify="space-between" wrap="nowrap" pr="sm">
                        <Text fw={700}>{group.title}</Text>
                        <Text size="xs" c="dimmed">выбрано {selected} из {group.allItems.length}</Text>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="sm">
                        <Group>
                          <Button
                            type="button"
                            size="xs"
                            variant="light"
                            leftSection={<IconSelectAll size={16} />}
                            onClick={() =>
                              setDraft((current) => [
                                ...new Set([...current, ...group.allItems.map((item) => item.key)]),
                              ])
                            }
                          >
                            Выбрать все
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant="subtle"
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={() =>
                              setDraft((current) =>
                                current.filter((key) =>
                                  !group.allItems.some((item) => item.key === key),
                                ),
                              )
                            }
                          >
                            Очистить
                          </Button>
                        </Group>
                        <Checkbox.Group value={draft} onChange={setDraft}>
                          <Stack gap="xs">
                            {group.items.map((item) => (
                              <Checkbox
                                key={item.key}
                                value={item.key}
                                label={item.title}
                              />
                            ))}
                          </Stack>
                        </Checkbox.Group>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          ) : <Text c="dimmed">Ничего не найдено.</Text>}
        </ScrollArea.Autosize>
        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onCancel}>Отмена</Button>
          <Button type="button" onClick={() => onApply(draft)}>Применить</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
