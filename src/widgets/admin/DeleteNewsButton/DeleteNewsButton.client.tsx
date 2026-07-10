"use client";

import { useTransition } from "react";

type Props = {
  action: () => Promise<void>;
  confirmText?: string;
  idleLabel?: string;
  pendingLabel?: string;
};

export default function DeleteNewsButton({
  action,
  confirmText = "Удалить запись? Действие будет отправлено сразу.",
  idleLabel = "Удалить",
  pendingLabel = "Удаление...",
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        if (!window.confirm(confirmText)) {
          return;
        }

        startTransition(async () => {
          await action();
        });
      }}
      disabled={pending}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
