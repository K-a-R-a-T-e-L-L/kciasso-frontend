"use client";

import { useActionState, useState } from "react";
import type { AdminNewsCategoryDto, AdminNewsDto } from "@/shared/api/generated/types";
import type { NewsFormState } from "./AdminNewsForm.types";
import { newsFormInitialState } from "./AdminNewsForm.types";
import cls from "./AdminNewsForm.module.scss";

type Props = {
  categories: AdminNewsCategoryDto[];
  initialData?: AdminNewsDto;
  action: (state: NewsFormState, formData: FormData) => Promise<NewsFormState>;
  submitLabel: string;
};

type PublishMode = "draft" | "publish-now" | "schedule";

function toDateTimeLocal(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function resolveInitialMode(initialData?: AdminNewsDto): PublishMode {
  if (!initialData) {
    return "draft";
  }

  if (initialData.status === "scheduled") {
    return "schedule";
  }

  if (initialData.status === "published") {
    return "publish-now";
  }

  return "draft";
}

export default function AdminNewsForm({ categories, initialData, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, newsFormInitialState);
  const [publishMode, setPublishMode] = useState<PublishMode>(resolveInitialMode(initialData));

  return (
    <form className={cls.form} action={formAction}>
      <div className={cls.grid}>
        <label className={cls.spanFull}>
          <span>Заголовок</span>
          <input type="text" name="title" defaultValue={initialData?.title ?? ""} required />
        </label>

        <label>
          <span>Slug</span>
          <input type="text" name="slug" defaultValue={initialData?.slug ?? ""} required />
        </label>

        <label>
          <span>Категория</span>
          <select name="categoryId" defaultValue={initialData?.category?.id ? String(initialData.category.id) : ""}>
            <option value="">Без рубрики</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>

        <label className={cls.spanFull}>
          <span>Краткое описание</span>
          <textarea name="excerpt" rows={4} defaultValue={initialData?.excerpt ?? ""} required />
        </label>

        <label className={cls.spanFull}>
          <span>Содержание</span>
          <textarea name="content" rows={14} defaultValue={initialData?.content ?? ""} required />
        </label>

        <label className={cls.spanFull}>
          <span>Cover image URL</span>
          <input type="url" name="coverImageUrl" defaultValue={initialData?.coverImageUrl ?? ""} />
        </label>

        <label>
          <span>Статус публикации</span>
          <select
            name="publishMode"
            value={publishMode}
            onChange={(event) => setPublishMode(event.target.value as PublishMode)}
          >
            <option value="draft">Черновик</option>
            <option value="publish-now">Опубликовать сейчас</option>
            <option value="schedule">Запланировать</option>
          </select>
        </label>

        {publishMode === "schedule" ? (
          <label>
            <span>Дата и время публикации</span>
            <input
              type="datetime-local"
              name="publishedAt"
              defaultValue={toDateTimeLocal(initialData?.publishedAt)}
              required
            />
          </label>
        ) : (
          <div className={cls.modeHint}>
            <span>Пояснение</span>
            <p>
              {publishMode === "draft"
                ? "Запись сохранится без публикации в публичной ленте."
                : "Дата публикации будет установлена текущим временем."}
            </p>
          </div>
        )}
      </div>

      {state.error ? <p className={cls.error}>{state.error}</p> : null}

      <div className={cls.actions}>
        <button type="submit" disabled={pending}>
          {pending ? "Сохранение..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
