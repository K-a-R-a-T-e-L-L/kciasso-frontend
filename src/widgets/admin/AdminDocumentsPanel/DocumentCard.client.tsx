"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  Badge,
  ActionIcon,
  Button,
  Card,
  Drawer,
  Grid,
  Group,
  Popover,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp, IconFile, IconMapPin } from "@tabler/icons-react";
import type { DocumentDto, DocumentVersionDto } from "@/shared/api/generated/types";
import DocumentActions from "./DocumentActions.client";
import DocumentMetadataForm from "./DocumentMetadataForm.client";
import DocumentShareLinks from "@/widgets/admin/DocumentShareLinks/DocumentShareLinks.client";
import DocumentVersionPanel from "./DocumentVersionPanel.client";
import { placementTitle } from "@/shared/documents/document-placement-registry";
import { formatDate, formatSize } from "./admin-document-response";
import type { FormState } from "./types";

export type DrawerSection = "technical" | "edit" | "replace" | "versions" | "share";

type Props = {
  document: DocumentDto;
  index: number;
  orderedLength: number;
  canReorder: boolean;
  expanded: boolean;
  editing: boolean;
  versionDocumentId: number | null;
  shareDocumentId: number | null;
  historyDocumentId: number | null;
  versionFile: File | null;
  history: Record<number, DocumentVersionDto[]>;
  editingForm: FormState;
  editingPlacements: string[];
  busy: string | null;
  drawer: DrawerSection | null;
  onCloseDrawer: () => void;
  onToggleExpanded: (id: number) => void;
  onMove?: (id: number, offset: -1 | 1) => void;
  onOpenFile: (document: DocumentDto, version: DocumentVersionDto) => void;
  onEdit: (document: DocumentDto) => void;
  onToggleVersion: (id: number) => void;
  onHistory: (id: number) => void;
  onShare: (id: number) => void;
  onTechnical: (id: number) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: "DRAFT" | "PUBLISHED") => void;
  onEditFieldChange: (key: keyof FormState, value: string) => void;
  onOpenPlacement: () => void;
  onSaveMetadata: (event: FormEvent<HTMLFormElement>, id: number) => void;
  onCancelEdit: () => void;
  onVersionFileChange: (file: File | null) => void;
  onUploadVersion: (event: FormEvent<HTMLFormElement>, id: number) => void;
  onCloseHistory: () => void;
  onMakeCurrent: (id: number, version: DocumentVersionDto) => void;
};

const drawerTitles: Record<DrawerSection, string> = {
  technical: "Техническая информация",
  edit: "Редактирование документа",
  replace: "Замена файла",
  versions: "История версий",
  share: "Секретные ссылки",
};

export default function DocumentCard(props: Props) {
  const drawerFocusRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const placementsTriggerRef = useRef<HTMLButtonElement>(null);
  const version = props.document.currentVersion;
  const shown = props.document.placements.slice(0, 2);
  const extra = Math.max(0, props.document.placements.length - shown.length);
  const [placementQuery, setPlacementQuery] = useState("");
  const filteredPlacements = props.document.placements.filter((item) =>
    placementTitle(item.sectionKey).toLocaleLowerCase("ru-RU").includes(placementQuery.trim().toLocaleLowerCase("ru-RU")),
  );

  return (
    <Card ref={cardRef} component="article" p="md" radius="md" withBorder shadow="xs" data-testid={`document-card-${props.document.id}`}>
      <Grid align="center" gutter={{ base: "sm", md: "md" }}>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Group wrap="nowrap">
            <ThemeIcon size={42} variant="light"><IconFile size={22} /></ThemeIcon>
            <Stack gap={2} miw={0}>
              <Group gap="xs" wrap="nowrap">
                <Badge variant="outline" color="gray">#{props.index + 1}</Badge>
                <Title order={3} size="h5" lineClamp={1}>{props.document.title}</Title>
              </Group>
              <Text size="sm" c="dimmed">{props.document.documentNumber || "Без номера"} · {formatDate(props.document.documentDate)}</Text>
            </Stack>
          </Group>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
          {props.document.canManage !== false ? (
            <Select
              label="Статус"
              size="xs"
              value={props.document.status}
              data={[{ value: "DRAFT", label: "Черновик" }, { value: "PUBLISHED", label: "Опубликован" }]}
              onChange={(value) => props.onStatusChange(props.document.id, value as "DRAFT" | "PUBLISHED")}
            />
          ) : <Badge variant="light">Только просмотр</Badge>}
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
          <Group gap={5} wrap="wrap">
            {shown.map((item) => (
              <Badge
                key={item.sectionKey}
                variant="light"
                leftSection={<IconMapPin size={12} />}
                maw="100%"
                title={placementTitle(item.sectionKey)}
              >
                {placementTitle(item.sectionKey)}
              </Badge>
            ))}
            {extra ? (
              <Popover
                opened={props.expanded}
                onChange={(opened) => {
                  if (opened !== props.expanded) props.onToggleExpanded(props.document.id);
                }}
                position="bottom-start"
                withinPortal
              >
                <Popover.Target><Button ref={placementsTriggerRef} size="compact-xs" variant="subtle" onClick={() => props.onToggleExpanded(props.document.id)}>+ ещё {extra}</Button></Popover.Target>
                <Popover.Dropdown role="dialog" aria-label="Все размещения">
                  <Stack gap="xs" maw={340}>
                    <Text fw={700}>Все размещения</Text>
                    {props.document.placements.length > 12 ? <TextInput size="xs" value={placementQuery} onChange={(event) => setPlacementQuery(event.currentTarget.value)} placeholder="Найти размещение" /> : null}
                    <ScrollArea.Autosize mah={180} data-testid="placement-rows" viewportProps={{ tabIndex: 0 }}>
                      <Stack gap={4}>
                        {filteredPlacements.map((item) => <Text component="span" size="sm" key={item.sectionKey}>{placementTitle(item.sectionKey)}</Text>)}
                      </Stack>
                    </ScrollArea.Autosize>
                    <Button
                      variant="light"
                      onClick={() => {
                        props.onToggleExpanded(props.document.id);
                        requestAnimationFrame(() => placementsTriggerRef.current?.focus());
                      }}
                    >
                      Закрыть
                    </Button>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            ) : null}
          </Group>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 1 }}>
          <Stack gap={1}>
            <Text size="xs" fw={700}>{version?.extension?.toUpperCase() ?? "—"}</Text>
            <Text size="xs" c="dimmed" truncate title={version?.originalFilename ?? ""}>{version?.originalFilename ?? "Файл недоступен"}</Text>
            <Text size="xs" c="dimmed">{formatSize(version?.sizeBytes)}</Text>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="xs" align="flex-end">
          {props.canReorder && props.onMove ? <Group gap={4}><ActionIcon variant="light" aria-label="Вверх" disabled={props.index === 0} onClick={() => props.onMove?.(props.document.id, -1)}><IconArrowUp size={16} /></ActionIcon><ActionIcon variant="light" aria-label="Вниз" disabled={props.index === props.orderedLength - 1} onClick={() => props.onMove?.(props.document.id, 1)}><IconArrowDown size={16} /></ActionIcon></Group> : null}
          <DocumentActions
            document={props.document}
            version={version}
            index={props.index}
            orderedLength={props.orderedLength}
            busy={Boolean(props.busy)}
            canReorder={props.canReorder}
            onMove={props.onMove}
            onOpenFile={props.onOpenFile}
            onEdit={props.onEdit}
            onToggleVersion={props.onToggleVersion}
            onHistory={props.onHistory}
            onShare={props.onShare}
            onTechnical={props.onTechnical}
            onDelete={props.onDelete}
          />
          </Stack>
        </Grid.Col>
      </Grid>

      <Drawer
        opened={Boolean(props.drawer)}
        onClose={() => {
          props.onCloseDrawer();
          requestAnimationFrame(() =>
            cardRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Действия документа"]')?.focus(),
          );
        }}
        onEnterTransitionEnd={() => drawerFocusRef.current?.focus()}
        title={props.drawer ? drawerTitles[props.drawer] : ""}
        position="right"
        size="lg"
      >
        <Stack ref={drawerFocusRef} tabIndex={-1}>
        {props.drawer === "technical" ? <Stack><Text>ID: {props.document.id}</Text><Text>Версий: {props.document.versionsCount}</Text></Stack> : null}
        {props.drawer === "edit" ? (
          <DocumentMetadataForm mode="edit" form={props.editingForm} onFieldChange={props.onEditFieldChange} placements={props.editingPlacements} onOpenPlacement={props.onOpenPlacement} onSubmit={(event) => props.onSaveMetadata(event, props.document.id)} busy={Boolean(props.busy)} onCancel={props.onCancelEdit} />
        ) : null}
        {props.drawer === "share" && version ? <DocumentShareLinks version={version} /> : null}
        {props.drawer === "replace" || props.drawer === "versions" ? (
          <DocumentVersionPanel
            documentId={props.document.id}
            versionDocumentId={props.versionDocumentId}
            versionFile={props.versionFile}
            historyDocumentId={props.historyDocumentId}
            history={props.history}
            busy={Boolean(props.busy)}
            onFileChange={props.onVersionFileChange}
            onUpload={(event) => props.onUploadVersion(event, props.document.id)}
            onCloseHistory={props.onCloseHistory}
            onMakeCurrent={props.onMakeCurrent}
          />
        ) : null}
        </Stack>
      </Drawer>
    </Card>
  );
}
