"use client";

import { Button } from "@mantine/core";
import { useTransition } from "react";
import { logoutAdminAction } from "./actions";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return <Button type="button" variant="light" color="kciassoTeal" fullWidth loading={pending}
    onClick={() => startTransition(async () => { await logoutAdminAction(); })}>
    {pending ? "Выход..." : "Выйти"}
  </Button>;
}
