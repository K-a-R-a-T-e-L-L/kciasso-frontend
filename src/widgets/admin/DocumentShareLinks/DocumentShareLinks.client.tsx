"use client";

import { Box, Title, Text, Button } from "@mantine/core";

import { FormEvent, useEffect, useState } from "react";
import {
  adminDocumentShareLinkRevokeControllerRevoke,
  adminDocumentShareLinksControllerCreate,
  adminDocumentShareLinksControllerList,
} from "@/shared/api/generated/clients";
import type {
  CreatedDocumentShareLinkDto,
  DocumentShareLinkDto,
  DocumentVersionDto,
} from "@/shared/api/generated/types";
import { modals } from "@mantine/modals";
import { getAdminApiErrorMessage } from "@/shared/admin/api-error";

type Props = { version: DocumentVersionDto };

function requestConfig() {
  return {
    baseURL: window.location.origin,
    credentials: "same-origin" as const,
    skipAuthRedirect: true,
  };
}

function formatDate(value?: string | null) {
  if (!value) return "Без срока";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
}

function formatSize(value: string) {
  const size = Number(value);
  if (!Number.isFinite(size)) return "—";
  if (size < 1024) return `${size} Б`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`;
  return `${(size / 1024 / 1024).toFixed(1)} МБ`;
}

function statusLabel(link: DocumentShareLinkDto) {
  if (link.revokedAt) return "Отозвана";
  if (link.isExpired) return "Истекла";
  return "Активна";
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Не удалось скопировать ссылку.");
}

export default function DocumentShareLinks({ version }: Props) {
  const [links, setLinks] = useState<DocumentShareLinkDto[]>([]);
  const [expiresAt, setExpiresAt] = useState("");
  const [created, setCreated] = useState<{
    dto: CreatedDocumentShareLinkDto;
    url: string;
  } | null>(null);
  const [busy, setBusy] = useState<"load" | "create" | "revoke" | null>("load");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const currentLink = links.find((link) => link.isActive) ?? null;

  async function refresh(showBusy = true) {
    if (showBusy) setBusy("load");
    try {
      const data = await adminDocumentShareLinksControllerList(
        version.id,
        requestConfig(),
      );
      setLinks(data);
    } catch (error) {
      setMessage({
        type: "error",
        text: getAdminApiErrorMessage(error, "Не удалось загрузить ссылки."),
      });
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    let active = true;
    adminDocumentShareLinksControllerList(version.id, requestConfig())
      .then((data) => {
        if (active) setLinks(data);
      })
      .catch((error) => {
        if (active)
          setMessage({
            type: "error",
            text: getAdminApiErrorMessage(
              error,
              "Не удалось загрузить ссылки.",
            ),
          });
      })
      .finally(() => {
        if (active) setBusy(null);
      });
    return () => {
      active = false;
    };
  }, [version.id]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setCreated(null);
    let expiry: string | null = null;
    if (expiresAt) {
      const date = new Date(expiresAt);
      if (Number.isNaN(date.getTime()) || date <= new Date()) {
        setMessage({
          type: "error",
          text: "Срок действия должен быть в будущем.",
        });
        return;
      }
      expiry = date.toISOString();
    }
    setBusy("create");
    try {
      const dto = await adminDocumentShareLinksControllerCreate(
        version.id,
        { expiresAt: expiry },
        requestConfig(),
      );
      const url = `${window.location.origin}/share/document#${dto.token}`;
      setCreated({ dto, url });
      setExpiresAt("");
      await refresh();
      setMessage({
        type: "success",
        text: "Ссылка создана. Скопируйте её сейчас: повторно получить этот токен нельзя.",
      });
    } catch (error) {
      setMessage({
        type: "error",
      text: getAdminApiErrorMessage(error, "Не удалось создать ссылку. Сервер временно недоступен, попробуйте ещё раз."),
      });
    } finally {
      setBusy(null);
    }
  }

  async function revoke(id: number) {
    modals.openConfirmModal({ title: "Отозвать ссылку?", children: "Файл и запись ссылки сохранятся.", labels: { confirm: "Отозвать", cancel: "Отмена" }, confirmProps: { color: "red" }, onConfirm: () => void revokeConfirmed(id) });
  }

  async function revokeConfirmed(id: number) {
    setBusy("revoke");
    setMessage(null);
    try {
      await adminDocumentShareLinkRevokeControllerRevoke(id, requestConfig());
      setCreated(null);
      await refresh();
      setMessage({ type: "success", text: "Ссылка отозвана." });
    } catch (error) {
      setMessage({
        type: "error",
      text: getAdminApiErrorMessage(error, "Не удалось отозвать ссылку. Сервер временно недоступен, попробуйте ещё раз."),
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <Box component="section" className={""} aria-label="Ссылки для согласования">
      <Box className={""}>
        <Box>
          <Title>Ссылки для согласования</Title>
          <Text>
            Версия {version.versionNumber} · {version.originalFilename}
          </Text>
        </Box>
        <Button
          type="button"
          className={""}
          onClick={() => void refresh()}
          disabled={busy !== null}
        >
          Обновить
        </Button>
      </Box>
      <Box className={""}>
        Текущая версия: {version.versionNumber} · {version.mimeType} · {formatSize(version.sizeBytes)}
      </Box>
      <Box component="form"
        className={""}
        data-testid={`share-links-version-${version.id}`}
        onSubmit={create}
      >
        <Box component="label">
          Срок действия{" "}
          <Box component="input"
            type="datetime-local"
            value={expiresAt}
            onChange={(event: any) => setExpiresAt(event.target.value)}
            disabled={busy !== null}
          />
        </Box>
        <Text>
          Время указывается в часовом поясе браузера; пустое поле — без срока.
        </Text>
        <Button
          type="submit"
          data-testid={`share-create-${version.id}`}
          disabled={busy !== null}
        >
          {busy === "create" ? "Создание…" : currentLink ? "Создать новую" : "Создать секретную ссылку"}
        </Button>
      </Box>
      {created ? (
        <Box className={""}>
          <Text>Новая ссылка создана</Text>
          <Text className={""}>{created.url}</Text>
          <Text>Любой человек, у которого есть эта ссылка, сможет открыть файл.</Text>
          <Text>
            Версия {created.dto.versionNumber} ·{" "}
            {formatDate(created.dto.expiresAt)}
          </Text>
          <Box className={""}>
            <Button
              type="button"
              onClick={() =>
                void copyText(created.url)
                  .then(() =>
                    setMessage({
                      type: "success",
                      text: "Ссылка скопирована.",
                    }),
                  )
                  .catch((error) =>
                    setMessage({
                      type: "error",
                      text:
                        error instanceof Error
                          ? error.message
                          : "Не удалось скопировать ссылку.",
                    }),
                  )
              }
            >
              Скопировать ссылку
            </Button>
            <Button
              type="button"
              className={""}
              onClick={() => setCreated(null)}
            >
              Закрыть
            </Button>
          </Box>
        </Box>
      ) : null}
      {message ? (
        <Text
          className={message.type === "error" ? "" : ""}
          role={message.type === "error" ? "alert" : "status"}
        >
          {message.text}
        </Text>
      ) : null}
      {!currentLink && busy !== "load" ? (
        <Text className={""}>Активной секретной ссылки нет.</Text>
      ) : null}
      {currentLink ? (
        <Box className={""}>
          {[currentLink].map((link) => (
            <Box
              className={""}
              data-testid={`share-link-row-${link.id}`}
              key={link.id}
            >
              <Box>
                <Text>{statusLabel(link)}</Text>
                <Text>Ссылка действует только для текущей версии документа.</Text>
              </Box>
              <Box>
                <Text>Создана: {formatDate(link.createdAt)}</Text>
                <Text>Срок: {formatDate(link.expiresAt)}</Text>
                <Text>Открытий: {link.accessCount}</Text>
                <Text>Последнее открытие: {formatDate(link.lastAccessAt)}</Text>
              </Box>
              {link.isActive ? (
                <Button
                  type="button"
                  className={""}
                  data-testid={`share-revoke-${link.id}`}
                  onClick={() => void revoke(link.id)}
                  disabled={busy !== null}
                >
                  {busy === "revoke" ? "Отзыв…" : "Отозвать"}
                </Button>
              ) : null}
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
