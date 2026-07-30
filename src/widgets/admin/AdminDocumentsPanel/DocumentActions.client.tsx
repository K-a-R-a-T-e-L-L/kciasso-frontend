"use client";

import { ActionIcon, Button, Group, Menu } from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconFileUpload,
  IconHistory,
  IconInfoCircle,
  IconLink,
  IconTrash,
} from "@tabler/icons-react";
import type { DocumentDto, DocumentVersionDto } from "@/shared/api/generated/types";
import PlacementPublicationControls from "./PlacementPublicationControls.client";

type Props = {
  document: DocumentDto;
  version?: DocumentVersionDto | null;
  index: number;
  orderedLength: number;
  busy: boolean;
  onMove?: (id: number, offset: -1 | 1) => void;
  canReorder?: boolean;
  onOpenFile: (document: DocumentDto, version: DocumentVersionDto) => void;
  onEdit: (document: DocumentDto) => void;
  onToggleVersion: (id: number) => void;
  onHistory: (id: number) => void;
  onShare: (id: number) => void;
  onTechnical: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function DocumentActions({
  document,
  version,
  index,
  orderedLength,
  busy,
  onMove,
  canReorder,
  onOpenFile,
  onEdit,
  onToggleVersion,
  onHistory,
  onShare,
  onTechnical,
  onDelete,
}: Props) {
  return (
    <Group gap="xs" justify="flex-end" wrap="wrap">
      {version ? (
        <Button size="xs" leftSection={<IconExternalLink size={15} />} onClick={() => onOpenFile(document, version)}>
          Открыть
        </Button>
      ) : null}
      {document.canManage !== false ? (
        <Button size="xs" variant="light" leftSection={<IconEdit size={15} />} onClick={() => onEdit(document)}>
          Редактировать
        </Button>
      ) : null}
      {document.canManage !== false ? (
        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon variant="subtle" aria-label="Действия документа"><IconDots size={19} /></ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Файл и доступ</Menu.Label>
            <Menu.Item leftSection={<IconFileUpload size={17} />} onClick={() => onToggleVersion(document.id)}>Заменить файл</Menu.Item>
            <Menu.Item leftSection={<IconHistory size={17} />} onClick={() => onHistory(document.id)}>Версии</Menu.Item>
            {version ? <Menu.Item leftSection={<IconLink size={17} />} onClick={() => onShare(document.id)}>Секретная ссылка</Menu.Item> : null}
            <Menu.Item leftSection={<IconInfoCircle size={17} />} onClick={() => onTechnical(document.id)}>Техническая информация</Menu.Item>
            {canReorder && onMove ? (
              <>
                <Menu.Divider />
                <Menu.Item leftSection={<IconArrowUp size={17} />} disabled={index === 0 || busy} onClick={() => onMove(document.id, -1)}>Выше</Menu.Item>
                <Menu.Item leftSection={<IconArrowDown size={17} />} disabled={index === orderedLength - 1 || busy} onClick={() => onMove(document.id, 1)}>Ниже</Menu.Item>
              </>
            ) : null}
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconTrash size={17} />} disabled={busy} onClick={() => onDelete(document.id)}>Удалить</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : null}
      <PlacementPublicationControls documentId={document.id} placements={document.placements} canManage={document.canManage !== false} onRefresh={async () => window.location.reload()} />
    </Group>
  );
}
