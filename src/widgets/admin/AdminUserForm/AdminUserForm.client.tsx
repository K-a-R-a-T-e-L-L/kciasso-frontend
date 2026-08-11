"use client";

import { useActionState, useEffect, useState } from "react";
import { Alert, Button, Checkbox, Divider, Group, PasswordInput, Radio, Select, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import type { AdminUserDto } from "@/shared/api/generated/types";
import type { AdminUserFormState } from "./AdminUserForm.types";
import { adminUserFormInitialState } from "./AdminUserForm.types";

type Role = "SUPER_ADMIN" | "ADMIN";
type Mode = "NONE" | "ALL" | "SELECTED_GROUPS";
type Group = "GIA_9" | "GIA_11" | "GIA" | "QUALITY" | "REGIONAL" | "ABOUT";
const GROUPS: Array<{ value: Group; label: string }> = [
  { value: "GIA_9", label: "ГИА-9" }, { value: "GIA_11", label: "ГИА-11" }, { value: "GIA", label: "Общий раздел ГИА" },
  { value: "QUALITY", label: "Качество образования" }, { value: "REGIONAL", label: "Региональный проект" }, { value: "ABOUT", label: "О центре" },
];

type Props = { initialData?: AdminUserDto; includePassword?: boolean; action: (state: AdminUserFormState, formData: FormData) => Promise<AdminUserFormState>; submitLabel: string; onSaved?: () => void; onCancel?: () => void };

export default function AdminUserForm({ initialData, includePassword = false, action, submitLabel, onSaved, onCancel }: Props) {
  const [state, formAction, pending] = useActionState(action, adminUserFormInitialState);
  useEffect(() => { if (state.success) onSaved?.(); }, [state.success, onSaved]);
  const [role, setRole] = useState<Role>(initialData?.role ?? "ADMIN");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [siteSettings, setSiteSettings] = useState(initialData?.canManageSiteSettings ?? false);
  const [news, setNews] = useState(initialData?.canManageNews ?? false);
  const [mode, setMode] = useState<Mode>(initialData?.documentsAccessMode ?? "NONE");
  const [groups, setGroups] = useState<Group[]>((initialData?.documentGroups ?? []) as Group[]);
  const toggleGroup = (group: Group) => setGroups((current) => current.includes(group) ? current.filter((item) => item !== group) : [...current, group]);
  const summary = role === "SUPER_ADMIN" ? "Полный административный доступ, включая пользователей." : [siteSettings && "настройки сайта", news && "новости", mode === "ALL" ? "все документы" : mode === "SELECTED_GROUPS" && groups.length ? `документы: ${groups.length} групп` : null].filter(Boolean).join(", ") || "Нет доступа к контенту";

  return <Stack component="form" {...({ action: formAction } as { action: typeof formAction })} gap="lg">
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      <TextInput label="Имя" name="name" defaultValue={initialData?.name ?? ""} required />
      <TextInput label="Email" type="email" name="email" defaultValue={initialData?.email ?? ""} required />
      <Select label="Роль" name="role" value={role} onChange={(value) => setRole((value as Role) ?? "ADMIN")} data={[{ value: "ADMIN", label: "Admin" }, { value: "SUPER_ADMIN", label: "Super-admin" }]} />
      <Checkbox label="Активный администратор" name="isActive" checked={isActive} onChange={(event: any) => setIsActive(event.currentTarget.checked)} mt="xl" />
      <PasswordInput label={includePassword ? "Пароль" : "Новый пароль (необязательно)"} name="password" minLength={8} required={includePassword} />
    </SimpleGrid>
    <Divider />
    <Stack gap="sm"><Title order={3}>Доступ к контенту</Title><Text c="dimmed" size="sm">Preset не меняет роль и не выдаёт доступ к пользователям.</Text>
      <Button type="button" variant="light" onClick={() => { setSiteSettings(true); setNews(true); setMode("ALL"); setGroups([]); }}>Полный доступ к контенту</Button>
      <Checkbox label="Настройки сайта" name="canManageSiteSettings" checked={siteSettings} onChange={(event: any) => setSiteSettings(event.currentTarget.checked)} />
      <Checkbox label="Новости" name="canManageNews" checked={news} onChange={(event: any) => setNews(event.currentTarget.checked)} />
      <Radio.Group label="Документы" name="documentsAccessMode" value={mode} onChange={(value) => setMode(value as Mode)}><Group mt="xs"><Radio value="NONE" label="Нет доступа" /><Radio value="ALL" label="Все группы" /><Radio value="SELECTED_GROUPS" label="Выбранные группы" /></Group></Radio.Group>
      {mode === "SELECTED_GROUPS" ? <Checkbox.Group value={groups} onChange={(values) => setGroups(values as Group[])}><SimpleGrid cols={{ base: 1, sm: 2 }}>{GROUPS.map((group) => <Checkbox key={group.value} value={group.value} name="documentGroups" label={group.label} />)}</SimpleGrid></Checkbox.Group> : null}
      {mode === "SELECTED_GROUPS" && groups.length === 0 ? <Alert color="yellow">Пустой список означает отсутствие доступа к документам.</Alert> : null}
      <Text><Text span fw={700}>Итог:</Text> {summary}</Text>
    </Stack>
    {state.error ? <Alert color="red">{state.error}</Alert> : null}
    <Group justify="flex-end">
      {onCancel ? <Button type="button" variant="default" onClick={onCancel}>Назад</Button> : null}
      <Button type="submit" loading={pending}>{pending ? "Сохранение..." : submitLabel}</Button>
    </Group>
  </Stack>;
}
