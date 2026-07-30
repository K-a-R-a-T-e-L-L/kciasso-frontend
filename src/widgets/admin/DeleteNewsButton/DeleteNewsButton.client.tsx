"use client";

import { useTransition } from "react";
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";

type Props = { action: () => Promise<void>; confirmText?: string; idleLabel?: string; pendingLabel?: string };

export default function DeleteNewsButton({ action, confirmText = "Удалить запись? Действие будет отправлено сразу.", idleLabel = "Удалить", pendingLabel = "Удаление..." }: Props) {
  const [pending, startTransition] = useTransition();
  return <Button type="button" color="red" variant="subtle" loading={pending} onClick={() => modals.openConfirmModal({ title: "Подтвердите удаление", children: confirmText, labels: { confirm: idleLabel, cancel: "Отмена" }, confirmProps: { color: "red" }, onConfirm: () => startTransition(async () => { await action(); }) })}>{pending ? pendingLabel : idleLabel}</Button>;
}
