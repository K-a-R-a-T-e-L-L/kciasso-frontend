"use client";

import { Group, Pagination, Select, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import type { NewsPaginationMetaDto } from "@/shared/api/generated/types";
import { adminNewsHref, type AdminNewsUrlQuery } from "./admin-news-query";

export default function AdminNewsPagination({
  query,
  meta,
}: {
  query: AdminNewsUrlQuery;
  meta: NewsPaginationMetaDto;
}) {
  const router = useRouter();
  const start = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);
  return (
    <Group justify="space-between" align="center" wrap="wrap">
      <Text size="sm" c="dimmed">Показано {start}–{end} из {meta.total}</Text>
      <Group>
        <Stack gap={2}>
          <Text size="xs" c="dimmed">Показывать</Text>
          <Select
            w={100}
            aria-label="Показывать"
            value={String(query.limit)}
            data={["10", "20", "50", "100"]}
            onChange={(value) => {
              if (value) router.push(adminNewsHref(query, { limit: Number(value) as AdminNewsUrlQuery["limit"] }, true));
            }}
          />
        </Stack>
        <Pagination
          value={meta.page}
          total={Math.max(1, meta.totalPages)}
          onChange={(page) => router.push(adminNewsHref(query, { page }))}
        />
      </Group>
    </Group>
  );
}
