"use client";

import { Alert, Button, Center, Drawer, Group, Loader, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminNewsCategoryDto, AdminNewsDto } from "@/shared/api/generated/types";
import AdminNewsForm from "./AdminNewsForm.client";

type Props = {
  categories: AdminNewsCategoryDto[];
  newsId?: number;
  opened: boolean;
  onClose: () => void;
};

export default function NewsEditorDrawer({ categories, newsId, opened, onClose }: Props) {
  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="xl"
      title={newsId ? "Редактирование новости" : "Новая новость"}
      scrollAreaComponent={ScrollArea.Autosize}>
      {opened ? (
        <NewsEditorContent
          key={newsId ?? "new"}
          categories={categories}
          newsId={newsId}
          onClose={onClose}
        />
      ) : null}
    </Drawer>
  );
}

function NewsEditorContent({ categories, newsId, onClose }: Omit<Props, "opened">) {
  const [item, setItem] = useState<AdminNewsDto>();
  const [loading, setLoading] = useState(Boolean(newsId));
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!newsId) return;
    const controller = new AbortController();
    fetch(`/api/admin/news/${newsId}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("LOAD_FAILED");
        return response.json() as Promise<AdminNewsDto>;
      })
      .then(setItem)
      .catch((reason) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError("Не удалось загрузить новость. Закройте окно и попробуйте снова.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [newsId]);

  const onSaved = () => {
    onClose();
    router.refresh();
  };

  return (
    <>
      {loading ? <Center py="xl"><Loader /></Center> : null}
      {error ? <Alert color="red">{error}</Alert> : null}
      {!loading && !error && (!newsId || item) ? (
        <AdminNewsForm
          key={newsId ?? "new"}
          categories={categories}
          initialData={item}
          mutation={newsId ? { method: "update", id: String(newsId) } : { method: "create" }}
          submitLabel={newsId ? "Сохранить изменения" : "Создать новость"}
          onSaved={onSaved}
          footer={<Group><Button type="button" variant="default" onClick={onClose}>Назад</Button></Group>}
        />
      ) : null}
    </>
  );
}
