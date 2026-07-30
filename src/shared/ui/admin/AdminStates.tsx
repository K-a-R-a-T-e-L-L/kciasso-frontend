import { Alert, Center, Stack, Text } from "@mantine/core";

export function AdminEmptyState({ title, description }: { title: string; description?: string }) {
  return <Center mih={180}><Stack align="center" gap="xs"><Text fw={700}>{title}</Text>{description ? <Text c="dimmed" ta="center">{description}</Text> : null}</Stack></Center>;
}

export function AdminErrorState({ title = "Не удалось загрузить данные", description }: { title?: string; description?: string }) {
  return <Alert color="red" title={title}>{description ?? "Повторите попытку или обратитесь к администратору."}</Alert>;
}
