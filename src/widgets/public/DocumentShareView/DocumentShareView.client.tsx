"use client";

import { useEffect, useRef, useState } from "react";
import {
  DocumentShareNetworkError,
  DocumentShareUnavailableError,
  resolveDocumentShare,
  type ResolvedDocumentFile,
} from "@/shared/documents/document-share.client";
import cls from "./DocumentShareView.module.scss";

type ViewState =
  "loading" | "missing" | "malformed" | "unavailable" | "network" | "ready";

function isValidToken(token: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}

export default function DocumentShareView() {
  const tokenRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [state, setState] = useState<ViewState>("loading");
  const [file, setFile] = useState<
    (ResolvedDocumentFile & { objectUrl: string }) | null
  >(null);

  useEffect(() => {
    const rawToken = window.location.hash.slice(1);
    window.history.replaceState(null, "", "/share/document");
    if (!rawToken) {
      queueMicrotask(() => setState("missing"));
      return;
    }
    if (!isValidToken(rawToken)) {
      queueMicrotask(() => setState("malformed"));
      return;
    }

    tokenRef.current = rawToken;
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      let attempt = 0;
      while (tokenRef.current && attempt < 2) {
        try {
          const resolved = await resolveDocumentShare(
            tokenRef.current,
            controller.signal,
          );
          const objectUrl = URL.createObjectURL(resolved.blob);
          objectUrlRef.current = objectUrl;
          tokenRef.current = null;
          setFile({ ...resolved, objectUrl });
          setState("ready");
          return;
        } catch (error) {
          if (controller.signal.aborted) return;
          if (error instanceof DocumentShareUnavailableError) {
            tokenRef.current = null;
            setState("unavailable");
            return;
          }
          if (!(error instanceof DocumentShareNetworkError)) {
            tokenRef.current = null;
            setState("network");
            return;
          }
          attempt += 1;
        }
      }
      tokenRef.current = null;
      setState("network");
    }

    void load();
    return () => {
      controller.abort();
      abortRef.current = null;
      tokenRef.current = null;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    };
  }, []);

  function download() {
    if (!file) return;
    const link = document.createElement("a");
    link.href = file.objectUrl;
    link.download = file.filename;
    link.click();
  }

  const isInline =
    file &&
    ["application/pdf", "image/jpeg", "image/png"].includes(file.mimeType);

  return (
    <main className={cls.page}>
      <section className={cls.card} aria-live="polite">
        <span className={cls.eyebrow}>Документ для согласования</span>
        {state === "loading" ? (
          <>
            <h1>Открываем файл…</h1>
            <p>Проверяем защищённую ссылку.</p>
          </>
        ) : null}
        {state === "missing" ? (
          <>
            <h1>Ссылка отсутствует</h1>
            <p>Ссылка отсутствует или уже была обработана.</p>
          </>
        ) : null}
        {state === "malformed" || state === "unavailable" ? (
          <>
            <h1>Ссылка недействительна</h1>
            <p>Ссылка недействительна, истекла или была отозвана.</p>
          </>
        ) : null}
        {state === "network" ? (
          <>
            <h1>Файл временно недоступен</h1>
            <p>Не удалось открыть файл. Попробуйте ещё раз позднее.</p>
            <p className={cls.hint}>
              Откройте исходную ссылку повторно, чтобы попробовать ещё раз.
            </p>
          </>
        ) : null}
        {state === "ready" && file ? (
          <>
            <h1>
              {isInline ? "Просмотр документа" : "Файл готов к скачиванию"}
            </h1>
            <p className={cls.filename}>{file.filename}</p>
            <p className={cls.meta}>
              {file.mimeType} ·{" "}
              {file.size > 0
                ? `${file.size.toLocaleString("ru-RU")} Б`
                : "размер не указан"}
            </p>
            {isInline ? (
              <div className={cls.viewer}>
                {file.mimeType === "application/pdf" ? (
                  <iframe title="Предпросмотр документа" src={file.objectUrl} />
                ) : (
                  // Blob URLs for secret files cannot use Next image optimization.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.objectUrl} alt={file.filename} />
                )}
              </div>
            ) : null}
            <button type="button" className={cls.download} onClick={download}>
              Скачать файл
            </button>
          </>
        ) : null}
      </section>
    </main>
  );
}
