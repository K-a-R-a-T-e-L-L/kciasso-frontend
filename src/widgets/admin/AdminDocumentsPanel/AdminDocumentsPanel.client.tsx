"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Drawer,
  Grid,
  Group,
  Paper,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconFilter, IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import type {
  DocumentDto,
  DocumentVersionDto,
} from "@/shared/api/generated/types";
import type { DocumentsPageContext } from "@/shared/documents/document-placement-registry";
import { DOCUMENT_PLACEMENT_GROUPS } from "@/shared/documents/document-placement-registry";
import {
  serializeAdminDocumentQuery,
  type AdminDocumentQueryState,
} from "@/shared/documents/document-query-state";
import AdminPageHeader from "@/shared/ui/admin/AdminPageHeader";
import DocumentCard, { type DrawerSection } from "./DocumentCard.client";
import DocumentMetadataForm from "./DocumentMetadataForm.client";
import PlacementSelector from "./PlacementSelector.client";
import useAdminDocumentMutations from "./useAdminDocumentMutations";
import { parseResponse } from "./admin-document-response";
import { emptyForm, type FormState, type PanelMessage } from "./types";

export { parseResponse } from "./admin-document-response";
export { default as PlacementSelector } from "./PlacementSelector.client";

type Props = {
  initialDocuments: DocumentDto[];
  sectionKey: string;
  allowedGroupIds?: string[];
  canSeeAll?: boolean;
  pageContext?: DocumentsPageContext;
  query?: AdminDocumentQueryState;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  initialCreateOpen?: boolean;
};

const fallback: DocumentsPageContext = {
  mode: "default",
  title: "Материалы и документы",
  eyebrow: "Документы",
  helperText: "Выберите доступный раздел, чтобы открыть документы.",
  emptyText: "В доступных разделах пока нет документов.",
  breadcrumbs: ["Материалы и документы"],
  queryPlacementKey: "gia-9.normative-documents",
};

export default function AdminDocumentsPanel({
  initialDocuments,
  sectionKey,
  allowedGroupIds,
  canSeeAll = false,
  pageContext = fallback,
  query: queryInput,
  pagination: paginationInput,
  initialCreateOpen = false,
}: Props) {
  const legacy = !queryInput;
  const query = queryInput ?? {
    sortBy: "updatedAt",
    sortDirection: "desc",
    page: 1,
    pageSize: 20,
  };
  const pagination = paginationInput ?? {
    page: 1,
    pageSize: 20,
    total: initialDocuments.length,
    totalPages: 1,
  };
  const [documents, setDocuments] = useState(initialDocuments);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [placements, setPlacements] = useState([sectionKey]);
  const [createOpen, setCreateOpen] = useState(initialCreateOpen);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingForm, setEditingForm] = useState<FormState>(emptyForm);
  const [editingPlacements, setEditingPlacements] = useState<string[]>([]);
  const [versionDocumentId, setVersionDocumentId] = useState<number | null>(
    null,
  );
  const [shareDocumentId, setShareDocumentId] = useState<number | null>(null);
  const [historyDocumentId, setHistoryDocumentId] = useState<number | null>(
    null,
  );
  const [technicalDocumentId, setTechnicalDocumentId] = useState<number | null>(
    null,
  );
  const [drawer, setDrawer] = useState<DrawerSection | null>(null);
  const [placementPicker, setPlacementPicker] = useState<
    "create" | "edit" | null
  >(null);
  const [expandedPlacements, setExpandedPlacements] = useState<
    Record<number, boolean>
  >({});
  const [versionFile, setVersionFile] = useState<File | null>(null);
  const [history, setHistory] = useState<Record<number, DocumentVersionDto[]>>(
    {},
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<PanelMessage>(null);
  const [search, setSearch] = useState(query.search ?? "");

  useEffect(() => {
    if (!initialCreateOpen) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("create");
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [initialCreateOpen]);

  const ordered = useMemo(() => documents, [documents]);
  const field = (
    setter: React.Dispatch<React.SetStateAction<FormState>>,
    key: keyof FormState,
    value: string,
  ) => setter((current) => ({ ...current, [key]: value }));
  const refresh = async () => {
    const qs = serializeAdminDocumentQuery(query);
    const response = await fetch(`/api/admin/documents${qs ? `?${qs}` : ""}`);
    setDocuments((await parseResponse(response)).items);
  };
  const navigate = (patch: Partial<AdminDocumentQueryState>) => {
    const next = { ...query, ...patch };
    const qs = serializeAdminDocumentQuery(next);
    window.location.assign(`${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };
  const canReorder =
    legacy ||
    (pageContext.mode === "placement" &&
      !query.search &&
      !query.status &&
      query.sortBy === "placementOrder" &&
      query.sortDirection === "asc" &&
      pagination.total <= pagination.pageSize);
  const context = query.placement
    ? `placement:${query.placement}`
    : query.group
      ? `group:${query.group}`
      : query.scope === "all"
        ? "all"
        : "default";
  const sectionOptions = [
    { value: "default", label: "Доступные материалы" },
    ...(canSeeAll ? [{ value: "all", label: "Все материалы" }] : []),
    ...DOCUMENT_PLACEMENT_GROUPS.flatMap((group) => [
      {
        group: group.title,
        items: [
          { value: `group:${group.id}`, label: `Все: ${group.title}` },
          ...group.items.map((item) => ({
            value: `placement:${item.key}`,
            label: item.title,
          })),
        ],
      },
    ]),
  ];

  const closeDrawer = () => {
    setDrawer(null);
    setEditingId(null);
    setVersionDocumentId(null);
    setShareDocumentId(null);
    setHistoryDocumentId(null);
    setTechnicalDocumentId(null);
  };
  const openDrawer = (section: DrawerSection, id: number) => {
    setDrawer(section);
    setVersionDocumentId(section === "replace" ? id : null);
    setHistoryDocumentId(section === "versions" ? id : null);
    setShareDocumentId(section === "share" ? id : null);
    setTechnicalDocumentId(section === "technical" ? id : null);
    if (section === "edit") {
      const document = documents.find((item) => item.id === id);
      if (document) {
        setEditingId(id);
        setEditingPlacements(
          document.placements.map((item) => item.sectionKey),
        );
        setEditingForm({
          title: document.title,
          description: document.description ?? "",
          documentNumber: document.documentNumber ?? "",
          documentDate: document.documentDate?.slice(0, 10) ?? "",
        });
      }
    }
  };

  const mutations = useAdminDocumentMutations({
    sectionKey,
    documents,
    orderedDocuments: ordered,
    form,
    file,
    placements,
    editingPlacements,
    editingForm,
    versionFile,
    history,
    setDocuments,
    setForm,
    setFile,
    setPlacements,
    setEditingId,
    setVersionFile,
    setVersionDocumentId,
    setHistory,
    setBusy,
    setMessage,
    setCreateOpen,
    refresh,
  });
  return (
    <Stack gap="lg" miw={0}>
      <AdminPageHeader
        eyebrow={pageContext.eyebrow}
        title={pageContext.title}
        description={pageContext.helperText}
        actions={
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setCreateOpen(true)}
          >
            Добавить документ
          </Button>
        }
      />

      <Paper p={{ base: "md", sm: "lg" }} shadow="sm" withBorder>
        <Group gap="xs" mb="md">
          <IconFilter size={18} />
          <Title order={3} size="h5">
            Фильтры
          </Title>
        </Group>
        <Grid align="flex-end">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Раздел"
              value={context}
              data={sectionOptions}
              searchable
              onChange={(value) => {
                const next = value ?? "default";
                navigate({
                  group: next.startsWith("group:") ? next.slice(6) : undefined,
                  placement: next.startsWith("placement:")
                    ? next.slice(10)
                    : undefined,
                  scope: next === "all" ? "all" : undefined,
                  page: 1,
                });
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput
              label="Поиск"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  navigate({ search: search.trim() || undefined, page: 1 });
                }
              }}
              placeholder="Название или номер"
              leftSection={<IconSearch size={16} />}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Select
              label="Статус"
              clearable
              value={query.status ?? null}
              data={[
                { value: "DRAFT", label: "Черновик" },
                { value: "PUBLISHED", label: "Опубликован" },
              ]}
              onChange={(status) =>
                navigate({ status: status || undefined, page: 1 })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Select
              label="Сортировка"
              value={`${query.sortBy}:${query.sortDirection}`}
              data={[
                { value: "updatedAt:desc", label: "Недавно обновлённые" },
                { value: "createdAt:desc", label: "Недавно созданные" },
                { value: "title:asc", label: "По названию" },
              ]}
              onChange={(value) => {
                const [sortBy, sortDirection] = (
                  value ?? "updatedAt:desc"
                ).split(":");
                navigate({ sortBy, sortDirection, page: 1 });
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Group gap="xs" wrap="nowrap">
              <Button
                w={38}
                px={0}
                aria-label="Найти"
                onClick={() =>
                  navigate({ search: search.trim() || undefined, page: 1 })
                }
              >
                <IconSearch size={18} />
              </Button>
              <Button
                color="red"
                flex={1}
                leftSection={<IconX size={16} />}
                onClick={() => {
                  setSearch("");
                  navigate({
                    scope: undefined,
                    search: undefined,
                    status: undefined,
                    group: undefined,
                    placement: undefined,
                    sortBy: "updatedAt",
                    sortDirection: "desc",
                    page: 1,
                    pageSize: 20,
                  });
                }}
              >
                Сбросить
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      {message ? (
        <Alert
          color={message.type === "error" ? "red" : "teal"}
          role={message.type === "error" ? "alert" : "status"}
        >
          {message.text}
        </Alert>
      ) : null}

      <Stack gap="sm">
        {ordered.map((document, index) => (
          <DocumentCard
            key={document.id}
            document={document}
            index={index}
            orderedLength={ordered.length}
            canReorder={canReorder}
            expanded={Boolean(expandedPlacements[document.id])}
            editing={editingId === document.id}
            versionDocumentId={versionDocumentId}
            shareDocumentId={shareDocumentId}
            historyDocumentId={historyDocumentId}
            versionFile={versionFile}
            history={history}
            editingForm={editingForm}
            editingPlacements={editingPlacements}
            busy={busy}
            drawer={
              drawer &&
              (editingId === document.id ||
                versionDocumentId === document.id ||
                historyDocumentId === document.id ||
                shareDocumentId === document.id ||
                technicalDocumentId === document.id)
                ? drawer
                : null
            }
            onCloseDrawer={closeDrawer}
            onToggleExpanded={(id) =>
              setExpandedPlacements((current) => ({
                ...current,
                [id]: !current[id],
              }))
            }
            onMove={canReorder ? mutations.move : undefined}
            onEdit={(item) => openDrawer("edit", item.id)}
            onToggleVersion={(id) => openDrawer("replace", id)}
            onHistory={(id) => {
              void mutations.loadHistory(id);
              openDrawer("versions", id);
            }}
            onShare={(id) => openDrawer("share", id)}
            onTechnical={(id) => openDrawer("technical", id)}
            onDelete={mutations.deleteDocument}
            onStatusChange={mutations.changeStatus}
            onEditFieldChange={(key, value) =>
              field(setEditingForm, key, value)
            }
            onOpenPlacement={() => setPlacementPicker("edit")}
            onSaveMetadata={mutations.saveMetadata}
            onCancelEdit={closeDrawer}
            onVersionFileChange={setVersionFile}
            onUploadVersion={mutations.uploadVersion}
            onCloseHistory={() => setHistoryDocumentId(null)}
            onMakeCurrent={mutations.makeCurrent}
          />
        ))}
        {ordered.length === 0 ? (
          <Paper
            data-testid="documents-empty-state"
            p="xl"
            ta="center"
            withBorder
          >
            <Text c="dimmed">{pageContext.emptyText}</Text>
          </Paper>
        ) : null}
      </Stack>

      <Paper p="md" withBorder>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Показано{" "}
            {pagination.total
              ? (pagination.page - 1) * pagination.pageSize + 1
              : 0}
            –{Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            из {pagination.total}
          </Text>
          <Group>
            <Select
              w={110}
              aria-label="На странице"
              value={String(pagination.pageSize)}
              data={["20", "50", "100"]}
              onChange={(value) =>
                navigate({ pageSize: Number(value), page: 1 })
              }
            />
            <Pagination
              value={pagination.page}
              total={Math.max(1, pagination.totalPages)}
              onChange={(page) => navigate({ page })}
            />
          </Group>
        </Group>
      </Paper>

      <Drawer
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Новый документ"
        position="right"
        size="lg"
      >
        <DocumentMetadataForm
          mode="create"
          form={form}
          onFieldChange={(key, value) => field(setForm, key, value)}
          placements={placements}
          onOpenPlacement={() => setPlacementPicker("create")}
          onSubmit={mutations.submitCreate}
          busy={busy === "create"}
          file={file}
          onFileChange={setFile}
        />
      </Drawer>

      {placementPicker ? (
        <PlacementSelector
          allowedGroupIds={allowedGroupIds}
          value={placementPicker === "create" ? placements : editingPlacements}
          onApply={(keys) => {
            if (placementPicker === "create") setPlacements(keys);
            else setEditingPlacements(keys);
            setPlacementPicker(null);
          }}
          onCancel={() => setPlacementPicker(null)}
        />
      ) : null}
    </Stack>
  );
}
