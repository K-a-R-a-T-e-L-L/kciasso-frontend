"use client";

import { useActionState, useState } from "react";
import type { AdminUserDto } from "@/shared/api/generated/types";
import type { AdminUserFormState } from "./AdminUserForm.types";
import { adminUserFormInitialState } from "./AdminUserForm.types";
import cls from "./AdminUserForm.module.scss";

type Role = "SUPER_ADMIN" | "ADMIN";
type Mode = "NONE" | "ALL" | "SELECTED_GROUPS";
type Group = "GIA_9" | "GIA_11" | "GIA" | "QUALITY" | "REGIONAL" | "ABOUT";

const GROUPS: Array<{ value: Group; label: string }> = [
  { value: "GIA_9", label: "ГИА-9" },
  { value: "GIA_11", label: "ГИА-11" },
  { value: "GIA", label: "Общий раздел ГИА" },
  { value: "QUALITY", label: "Качество образования" },
  { value: "REGIONAL", label: "Региональный проект" },
  { value: "ABOUT", label: "О центре" },
];

type Props = {
  initialData?: AdminUserDto;
  includePassword?: boolean;
  action: (state: AdminUserFormState, formData: FormData) => Promise<AdminUserFormState>;
  submitLabel: string;
};

export default function AdminUserForm({ initialData, includePassword = false, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, adminUserFormInitialState);
  const [role, setRole] = useState<Role>(initialData?.role ?? "ADMIN");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [siteSettings, setSiteSettings] = useState(initialData?.canManageSiteSettings ?? false);
  const [news, setNews] = useState(initialData?.canManageNews ?? false);
  const [mode, setMode] = useState<Mode>(initialData?.documentsAccessMode ?? "NONE");
  const [groups, setGroups] = useState<Group[]>((initialData?.documentGroups ?? []) as Group[]);

  const applyContentPreset = () => {
    setSiteSettings(true);
    setNews(true);
    setMode("ALL");
    setGroups([]);
  };

  const toggleGroup = (group: Group) => setGroups((current) => current.includes(group) ? current.filter((item) => item !== group) : [...current, group]);
  const summary = role === "SUPER_ADMIN"
    ? "Полный административный доступ, включая пользователей."
    : [siteSettings && "настройки сайта", news && "новости", mode === "ALL" ? "все документы" : mode === "SELECTED_GROUPS" && groups.length ? `документы: ${groups.length} групп` : null].filter(Boolean).join(", ") || "Нет доступа к контенту";

  return (
    <form className={cls.form} action={formAction}>
      <div className={cls.grid}>
        <label><span>Имя</span><input type="text" name="name" defaultValue={initialData?.name ?? ""} required /></label>
        <label><span>Email</span><input type="email" name="email" defaultValue={initialData?.email ?? ""} required /></label>
        <label><span>Роль</span><select name="role" value={role} onChange={(event) => setRole(event.target.value as Role)}><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super-admin</option></select></label>
        <label className={cls.checkbox}><input type="checkbox" name="isActive" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /><span>Активный администратор</span></label>
        <label className={cls.spanFull}><span>{includePassword ? "Пароль" : "Новый пароль (необязательно)"}</span><input type="password" name="password" minLength={8} required={includePassword} /></label>
      </div>

      <div className={cls.permissionsBlock}>
        <div className={cls.permissionsHeader}><span>Доступ к контенту</span><p>Preset не изменяет роль и не выдаёт доступ к пользователям.</p></div>
        <button type="button" className={cls.preset} onClick={applyContentPreset}>Полный доступ к контенту</button>
        <div className={cls.permissionsGrid}>
          <label className={cls.permissionItem}><input type="checkbox" name="canManageSiteSettings" checked={siteSettings} onChange={(event) => setSiteSettings(event.target.checked)} /><div><strong>Настройки сайта</strong></div></label>
          <label className={cls.permissionItem}><input type="checkbox" name="canManageNews" checked={news} onChange={(event) => setNews(event.target.checked)} /><div><strong>Новости</strong></div></label>
        </div>

        <fieldset className={cls.documentsAccess}>
          <legend>Документы</legend>
          {([['NONE', 'Нет доступа'], ['ALL', 'Все группы'], ['SELECTED_GROUPS', 'Выбранные группы']] as Array<[Mode, string]>).map(([value, label]) => (
            <label key={value}><input type="radio" name="documentsAccessMode" value={value} checked={mode === value} onChange={() => setMode(value)} />{label}</label>
          ))}
          {mode === "SELECTED_GROUPS" ? <div className={cls.permissionsGrid}>{GROUPS.map((group) => <label key={group.value} className={cls.permissionItem}><input type="checkbox" name="documentGroups" value={group.value} checked={groups.includes(group.value)} onChange={() => toggleGroup(group.value)} /><div><strong>{group.label}</strong></div></label>)}</div> : null}
          {mode === "SELECTED_GROUPS" && groups.length === 0 ? <p className={cls.warning}>Пустой список означает отсутствие доступа к документам.</p> : null}
        </fieldset>
        <p className={cls.summary}><strong>Итог:</strong> {summary}</p>
      </div>

      {state.error ? <p className={cls.error}>{state.error}</p> : null}
      <div className={cls.actions}><button type="submit" disabled={pending}>{pending ? "Сохранение..." : submitLabel}</button></div>
    </form>
  );
}
