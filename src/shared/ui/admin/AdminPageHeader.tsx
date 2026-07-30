import { Group, Stack, Text, Title } from "@mantine/core";

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <Group justify="space-between" align="flex-start" gap="lg" wrap="wrap">
      <Stack gap={4}>
        {eyebrow ? <Text size="xs" fw={800} tt="uppercase" c="kciassoBlue.6">{eyebrow}</Text> : null}
        <Title order={1}>{title}</Title>
        {description ? <Text c="dimmed" maw={760}>{description}</Text> : null}
      </Stack>
      {actions}
    </Group>
  );
}
