"use client";

import { Button, FileInput, Group, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import type { FormEvent } from "react";
import type { FormState } from "./types";

type Props = {
  mode: "create" | "edit";
  form: FormState;
  onFieldChange: (key: keyof FormState, value: string) => void;
  placements: string[];
  onOpenPlacement: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy: boolean;
  onCancel?: () => void;
  file?: File | null;
  onFileChange?: (file: File | null) => void;
};

export default function DocumentMetadataForm(props: Props) {
  const create = props.mode === "create";
  return <Stack component="form" gap="md" onSubmit={props.onSubmit as never}>
      {!create ? <Title order={3}>{"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430"}</Title> : null}
      <TextInput label={"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435"} value={props.form.title} required onChange={(event) => props.onFieldChange("title", event.currentTarget.value)} />
      <Textarea label={"\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435"} minRows={3} value={props.form.description} onChange={(event) => props.onFieldChange("description", event.currentTarget.value)} />
      <Group grow align="start">
        <TextInput label={"\u041d\u043e\u043c\u0435\u0440"} value={props.form.documentNumber} onChange={(event) => props.onFieldChange("documentNumber", event.currentTarget.value)} />
        <TextInput label={"\u0414\u0430\u0442\u0430"} type="date" value={props.form.documentDate} onChange={(event) => props.onFieldChange("documentDate", event.currentTarget.value)} />
      </Group>
      <Button variant="light" type="button" onClick={props.onOpenPlacement}>{"\u0420\u0430\u0437\u043c\u0435\u0449\u0435\u043d\u0438\u044f"}: {props.placements.length}</Button>
      {create ? <FileInput label={"\u0424\u0430\u0439\u043b"} accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png" required value={props.file ?? null} onChange={props.onFileChange} /> : null}
      {create && props.file ? <Text size="sm" c="dimmed">{props.file.name}</Text> : null}
      <Group justify="flex-end" wrap="wrap">
        {props.onCancel ? <Button type="button" variant="default" onClick={props.onCancel}>{"\u041e\u0442\u043c\u0435\u043d\u0430"}</Button> : null}
        <Button type="submit" loading={props.busy}>{create ? "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442" : "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"}</Button>
      </Group>
  </Stack>;
}
