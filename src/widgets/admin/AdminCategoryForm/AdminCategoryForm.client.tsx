"use client";

import { useActionState } from "react";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";
import type { AdminCategoryFormState } from "./AdminCategoryForm.types";
import { adminCategoryFormInitialState } from "./AdminCategoryForm.types";
import cls from "@/widgets/admin/AdminNewsForm/AdminNewsForm.module.scss";

type Props = {
  initialData?: AdminNewsCategoryDto;
  action: (state: AdminCategoryFormState, formData: FormData) => Promise<AdminCategoryFormState>;
  submitLabel: string;
};

export default function AdminCategoryForm({ initialData, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, adminCategoryFormInitialState);

  return (
    <form className={cls.form} action={formAction}>
      <div className={cls.grid}>
        <label>
          <span>Название</span>
          <input type="text" name="title" defaultValue={initialData?.title ?? ""} required />
        </label>

        <label>
          <span>Slug</span>
          <input type="text" name="slug" defaultValue={initialData?.slug ?? ""} required />
        </label>

        <label className={cls.spanFull}>
          <span>Описание</span>
          <textarea name="description" rows={5} defaultValue={initialData?.description ?? ""} />
        </label>

        <label>
          <span>Порядок</span>
          <input type="number" name="order" defaultValue={initialData?.order ?? 0} min={0} />
        </label>

        <label className={cls.checkbox}>
          <input type="checkbox" name="isActive" defaultChecked={initialData?.isActive ?? true} />
          <span>Категория активна</span>
        </label>
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
