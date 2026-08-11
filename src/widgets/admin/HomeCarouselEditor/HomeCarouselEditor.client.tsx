"use client";

import { useState, type FormEvent } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Drawer,
  FileInput,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconEdit,
  IconPhoto,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import type { HomeCarouselSlideDto } from "@/shared/api/adapters/home-carousel.adapter";
import {
  getCarouselApiErrorMessage,
  moveCarouselSlide,
  validateCarouselForm,
  type CarouselFormFields,
} from "./home-carousel-editor.model";

const emptyForm: CarouselFormFields = {
  title: "",
  subtitle: "",
  primaryUrl: "",
  secondaryUrl: "",
};

async function parseResponse(response: Response) {
  if (response.ok) return response.status === 204 ? null : response.json();
  const payload: unknown = await response.json().catch(() => null);
  throw new Error(getCarouselApiErrorMessage(payload));
}

export default function HomeCarouselEditor({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const [slides, setSlides] = useState<HomeCarouselSlideDto[]>([]);
  const [editing, setEditing] = useState<HomeCarouselSlideDto | "new" | null>(
    null,
  );
  const [removing, setRemoving] = useState<HomeCarouselSlideDto | null>(null);
  const [form, setForm] = useState<CarouselFormFields>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/home-carousel", {
      cache: "no-store",
    });
    const data = (await parseResponse(response)) as HomeCarouselSlideDto[];
    setSlides(data);
  };

  const open = async () => {
    setOpened(true);
    setError("");
    setBusy(true);
    try {
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось загрузить слайды.",
      );
    } finally {
      setBusy(false);
    }
  };

  const beginCreate = () => {
    setEditing("new");
    setForm(emptyForm);
    setFile(null);
    setError("");
  };

  const beginEdit = (slide: HomeCarouselSlideDto) => {
    setEditing(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      primaryUrl: slide.primaryUrl,
      secondaryUrl: slide.secondaryUrl,
    });
    setFile(null);
    setError("");
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateCarouselForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (editing === "new" && !file) {
      setError("Выберите фоновое изображение.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        data.set(key, value.trim()),
      );
      if (file) data.set("file", file);
      const isCreate = editing === "new";
      const endpoint = isCreate
        ? "/api/admin/home-carousel"
        : `/api/admin/home-carousel/${editing?.id}`;
      await parseResponse(
        await fetch(endpoint, {
          method: isCreate ? "POST" : "PATCH",
          body: data,
        }),
      );
      await load();
      setEditing(null);
      setFile(null);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось сохранить слайд.",
      );
    } finally {
      setBusy(false);
    }
  };

  const move = async (id: number, offset: -1 | 1) => {
    const previous = slides;
    const next = moveCarouselSlide(slides, id, offset);
    if (next === previous) return;
    setSlides(next);
    setBusy(true);
    setError("");
    try {
      const result = (await parseResponse(
        await fetch("/api/admin/home-carousel/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slideIds: next.map((slide) => slide.id) }),
        }),
      )) as HomeCarouselSlideDto[];
      setSlides(result);
    } catch (reason) {
      setSlides(previous);
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось изменить порядок.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!removing) return;
    setBusy(true);
    setError("");
    try {
      await parseResponse(
        await fetch(`/api/admin/home-carousel/${removing.id}`, {
          method: "DELETE",
        }),
      );
      await load();
      setRemoving(null);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Не удалось удалить слайд.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        variant="light"
        leftSection={<IconPhoto size={17} />}
        onClick={() => void open()}
        disabled={disabled}
      >
        Настроить слайды
      </Button>
      <Drawer
        opened={opened}
        onClose={() => {
          setOpened(false);
          setEditing(null);
        }}
        title="Карусель на главной"
        position="right"
        size="xl"
      >
        <Stack gap="lg">
          <Box>
            <Title order={2}>Слайды карусели</Title>
            <Text c="dimmed">
              Оформление и подписи кнопок заданы сайтом. Здесь меняются только
              содержание, изображение и ссылки.
            </Text>
          </Box>
          {error ? (
            <Alert color="red" role="alert">
              {error}
            </Alert>
          ) : null}
          {editing ? (
            <Paper
              component="form"
              onSubmit={save}
              noValidate
              p="md"
              withBorder
            >
              <Stack>
                <Title order={3} size="h4">
                  {editing === "new" ? "Новый слайд" : "Редактирование слайда"}
                </Title>
                {editing !== "new" ? (
                  <Image
                    src={editing.imageUrl}
                    alt=""
                    h={150}
                    radius="md"
                    fit="cover"
                  />
                ) : null}
                <FileInput
                  label={
                    editing === "new"
                      ? "Фоновое изображение"
                      : "Новое изображение (необязательно)"
                  }
                  description="JPG, PNG или WebP до 10 МБ"
                  accept="image/jpeg,image/png,image/webp"
                  value={file}
                  onChange={setFile}
                  required={editing === "new"}
                />
                <TextInput
                  label="Заголовок"
                  required
                  minLength={2}
                  maxLength={120}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.currentTarget.value })
                  }
                />
                <Textarea
                  label="Подпись"
                  required
                  minLength={2}
                  maxLength={300}
                  minRows={3}
                  value={form.subtitle}
                  onChange={(event) =>
                    setForm({ ...form, subtitle: event.currentTarget.value })
                  }
                />
                <TextInput
                  label="Ссылка кнопки «Перейти»"
                  description="Внутренний адрес вида /news или полный https://-адрес"
                  required
                  value={form.primaryUrl}
                  onChange={(event) =>
                    setForm({ ...form, primaryUrl: event.currentTarget.value })
                  }
                />
                <TextInput
                  label="Ссылка «Подробнее»"
                  required
                  value={form.secondaryUrl}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      secondaryUrl: event.currentTarget.value,
                    })
                  }
                />
                <Group justify="flex-end">
                  <Button
                    variant="default"
                    onClick={() => setEditing(null)}
                    disabled={busy}
                  >
                    Отмена
                  </Button>
                  <Button type="submit" loading={busy}>
                    {editing === "new" ? "Добавить слайд" : "Сохранить"}
                  </Button>
                </Group>
              </Stack>
            </Paper>
          ) : (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={beginCreate}
              disabled={busy || slides.length >= 30}
            >
              Добавить слайд
            </Button>
          )}
          <Stack gap="sm" aria-label="Список слайдов">
            {slides.map((slide, index) => (
              <Card key={slide.id} withBorder p="sm">
                <Group align="flex-start" wrap="nowrap">
                  <Image
                    src={slide.imageUrl}
                    alt=""
                    w={150}
                    h={96}
                    radius="md"
                    fit="cover"
                  />
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Badge variant="light">{index + 1}</Badge>
                      <Text fw={800}>{slide.title}</Text>
                    </Group>
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {slide.subtitle}
                    </Text>
                    <Text size="xs">Перейти: {slide.primaryUrl}</Text>
                    <Text size="xs">Подробнее: {slide.secondaryUrl}</Text>
                  </Stack>
                  <Stack gap={4}>
                    <Group gap={4}>
                      <Button
                        aria-label={`Слайд ${index + 1} выше`}
                        px={8}
                        variant="subtle"
                        disabled={busy || index === 0}
                        onClick={() => void move(slide.id, -1)}
                      >
                        <IconArrowUp size={17} />
                      </Button>
                      <Button
                        aria-label={`Слайд ${index + 1} ниже`}
                        px={8}
                        variant="subtle"
                        disabled={busy || index === slides.length - 1}
                        onClick={() => void move(slide.id, 1)}
                      >
                        <IconArrowDown size={17} />
                      </Button>
                    </Group>
                    <Button
                      variant="light"
                      leftSection={<IconEdit size={16} />}
                      onClick={() => beginEdit(slide)}
                      disabled={busy}
                    >
                      Изменить
                    </Button>
                    <Button
                      color="red"
                      variant="subtle"
                      leftSection={<IconTrash size={16} />}
                      onClick={() => setRemoving(slide)}
                      disabled={busy}
                    >
                      Удалить
                    </Button>
                  </Stack>
                </Group>
              </Card>
            ))}
            {!busy && slides.length === 0 ? (
              <Text c="dimmed">Слайдов пока нет. Добавьте первый слайд.</Text>
            ) : null}
          </Stack>
        </Stack>
      </Drawer>
      <Modal
        opened={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title="Удалить слайд?"
        centered
      >
        <Stack>
          <Text>Слайд «{removing?.title}» исчезнет с главной страницы.</Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setRemoving(null)}
              disabled={busy}
            >
              Отмена
            </Button>
            <Button color="red" onClick={() => void remove()} loading={busy}>
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
