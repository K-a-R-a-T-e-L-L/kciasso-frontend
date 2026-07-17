"use client";

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
import { getAdminApiErrorMessage } from "@/shared/admin/api-error";
import cls from "./DocumentShareLinks.module.scss";

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
    if (!window.confirm("Отозвать ссылку? Файл и запись ссылки сохранятся."))
      return;
    setBusy("revoke");
    setMessage(null);
    try {
      await adminDocumentShareLinkRevokeControllerRevoke(id, requestConfig());
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
    <section className={cls.section} aria-label="Ссылки для согласования">
      <div className={cls.heading}>
        <div>
          <h4>Ссылки для согласования</h4>
          <p>
            Версия {version.versionNumber} · {version.originalFilename}
          </p>
        </div>
        <button
          type="button"
          className={cls.refresh}
          onClick={() => void refresh()}
          disabled={busy !== null}
        >
          Обновить
        </button>
      </div>
      <div className={cls.versionMeta}>
        Текущая версия: {version.versionNumber} · {version.mimeType} · {formatSize(version.sizeBytes)}
      </div>
      <form
        className={cls.createForm}
        data-testid={`share-links-version-${version.id}`}
        onSubmit={create}
      >
        <label>
          Срок действия{" "}
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
            disabled={busy !== null}
          />
        </label>
        <small>
          Время указывается в часовом поясе браузера; пустое поле — без срока.
        </small>
        <button
          type="submit"
          data-testid={`share-create-${version.id}`}
          disabled={busy !== null}
        >
          {busy === "create" ? "Создание…" : "Создать ссылку"}
        </button>
      </form>
      {created ? (
        <div className={cls.created}>
          <strong>Новая ссылка создана</strong>
          <output className={cls.url}>{created.url}</output>
          <p>Любой человек, у которого есть эта ссылка, сможет открыть файл.</p>
          <p>
            Версия {created.dto.versionNumber} ·{" "}
            {formatDate(created.dto.expiresAt)}
          </p>
          <div className={cls.rowActions}>
            <button
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
            </button>
            <button
              type="button"
              className={cls.secondary}
              onClick={() => setCreated(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
      {message ? (
        <p
          className={message.type === "error" ? cls.error : cls.success}
          role={message.type === "error" ? "alert" : "status"}
        >
          {message.text}
        </p>
      ) : null}
      {links.length === 0 && busy !== "load" ? (
        <p className={cls.empty}>Ссылки для этой версии ещё не создавались.</p>
      ) : null}
      {links.length > 0 ? (
        <div className={cls.list}>
          {links.map((link) => (
            <div
              className={cls.item}
              data-testid={`share-link-row-${link.id}`}
              key={link.id}
            >
              <div>
                <strong>{statusLabel(link)}</strong>
                <span>
                  Токен начинается с <code>{link.tokenPrefix}</code>
                </span>
              </div>
              <div>
                <span>Создана: {formatDate(link.createdAt)}</span>
                <span>Срок: {formatDate(link.expiresAt)}</span>
                <span>Открытий: {link.accessCount}</span>
                <span>Последнее открытие: {formatDate(link.lastAccessAt)}</span>
              </div>
              {link.isActive ? (
                <button
                  type="button"
                  className={cls.revoke}
                  data-testid={`share-revoke-${link.id}`}
                  onClick={() => void revoke(link.id)}
                  disabled={busy !== null}
                >
                  {busy === "revoke" ? "Отзыв…" : "Отозвать"}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
