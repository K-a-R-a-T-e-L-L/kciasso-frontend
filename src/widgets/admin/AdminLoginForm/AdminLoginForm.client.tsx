"use client";

import { Alert, Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useActionState } from "react";
import { loginAdminAction } from "@/app/admin/(auth)/login/actions";
import { loginFormInitialState } from "./AdminLoginForm.types";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, loginFormInitialState);
  return <Stack component="form" {...({ action: formAction } as { action: typeof formAction })} gap="md">
    <TextInput label="Email" type="email" name="email" autoComplete="username" required />
    <PasswordInput label="Пароль" name="password" autoComplete="current-password" required />
    {state.error ? <Alert color="red">{state.error}</Alert> : null}
    <Button type="submit" loading={pending}>{pending ? "Выполняется вход..." : "Войти"}</Button>
  </Stack>;
}
