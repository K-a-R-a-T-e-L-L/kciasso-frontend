"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Alert, Box, Button, Paper, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import type { AdminSiteSettingsFormData, AdminSiteSettingsFormState } from "./AdminSiteSettingsForm.types";
import { adminSiteSettingsFormInitialState } from "./AdminSiteSettingsForm.types";

type Props = { initialData: AdminSiteSettingsFormData; action: (state: AdminSiteSettingsFormState, formData: FormData) => Promise<AdminSiteSettingsFormState> };

export default function AdminSiteSettingsForm({ initialData, action }: Props) {
  const [state, formAction, pending] = useActionState(action, adminSiteSettingsFormInitialState);
  return <Box component="form" action={formAction}><Stack gap="lg">
    <Paper p="lg"><SimpleGrid cols={{ base: 1, sm: 2 }}>
      <TextInput label="Горячая линия ГИА" name="giaHotlinePhone" defaultValue={initialData.giaHotlinePhone} description="Отображается в header, mobile menu и контактах." required />
      <TextInput label="Телефон для справок" name="informationPhone" defaultValue={initialData.informationPhone} description="Используется в блоках справочной информации и footer." required />
      <TextInput label="Телефон доверия ЕГЭ" name="egeTrustPhone" defaultValue={initialData.egeTrustPhone} description="Используется в публичных контактных списках." required />
      <TextInput label="Электронная почта" type="email" name="email" defaultValue={initialData.email} description="Формирует mailto-ссылки на публичной части сайта." required />
    </SimpleGrid></Paper>
    <Paper p="lg"><Stack gap="xs"><Text fw={700}>Порядок секций главной страницы</Text><Text c="dimmed" size="sm">Порядок настраивается в разделе «Страницы», чтобы у сайта был один редактор layout.</Text>
      {initialData.homeSectionsOrder.map((value) => <TextInput key={value} type="hidden" name="homeSectionsOrder" value={value} readOnly />)}
      <Button component={Link} href="/admin/pages/home" variant="light">Перейти к главной странице →</Button>
    </Stack></Paper>
    {state.error ? <Alert color="red">{state.error}</Alert> : null}
    {state.success ? <Alert color="green">{state.success}</Alert> : null}
    <Button type="submit" loading={pending}>{pending ? "Сохранение..." : "Сохранить настройки"}</Button>
  </Stack></Box>;
}
