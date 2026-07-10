"use client";

import { useActionState } from "react";
import type { AdminSectionDto, AdminUserDto } from "@/shared/api/generated/types";
import type { AdminUserFormState } from "./AdminUserForm.types";
import { adminUserFormInitialState } from "./AdminUserForm.types";
import cls from "./AdminUserForm.module.scss";

type Props = {
  sections: AdminSectionDto[];
  initialData?: AdminUserDto;
  includePassword?: boolean;
  allowSuperAdminToggle?: boolean;
  action: (state: AdminUserFormState, formData: FormData) => Promise<AdminUserFormState>;
  submitLabel: string;
};

export default function AdminUserForm({
  sections,
  initialData,
  includePassword = false,
  allowSuperAdminToggle = false,
  action,
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useActionState(action, adminUserFormInitialState);
  const selectedPermissions = new Set(initialData?.permissions ?? []);

  return (
    <form className={cls.form} action={formAction}>
      <div className={cls.grid}>
        <label>
          <span>Имя</span>
          <input type="text" name="name" defaultValue={initialData?.name ?? ""} required />
        </label>

        <label>
          <span>Email</span>
          <input type="email" name="email" defaultValue={initialData?.email ?? ""} required />
        </label>

        {includePassword ? (
          <label className={cls.spanFull}>
            <span>Пароль</span>
            <input type="password" name="password" minLength={8} required />
          </label>
        ) : null}

        {allowSuperAdminToggle ? (
          <label className={cls.checkbox}>
            <input type="checkbox" name="isSuperAdmin" defaultChecked={initialData?.isSuperAdmin ?? false} />
            <span>Super-admin</span>
          </label>
        ) : (
          <>
            <input type="hidden" name="isSuperAdmin" value={initialData?.isSuperAdmin ? "true" : "false"} />
            {initialData?.isSuperAdmin ? (
              <div className={cls.roleNote}>
                <strong>Роль</strong>
                <span>Super-admin не меняется в форме подадмина.</span>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className={cls.permissionsBlock}>
        <div className={cls.permissionsHeader}>
          <span>Права по разделам</span>
          <p>Отметьте разделы, которыми пользователь может управлять.</p>
        </div>

        <div className={cls.permissionsGrid}>
          {sections.map((section) => (
            <label key={section.sectionId} className={cls.permissionItem}>
              <input
                type="checkbox"
                name="sectionIds"
                value={section.sectionId}
                defaultChecked={selectedPermissions.has(section.sectionId)}
              />
              <div>
                <strong>{section.title}</strong>
                <span>{section.sectionId}</span>
              </div>
            </label>
          ))}
        </div>
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
