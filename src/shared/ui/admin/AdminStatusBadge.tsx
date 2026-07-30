import { Badge, type BadgeProps } from "@mantine/core";

export default function AdminStatusBadge({ children, color = "gray", ...props }: BadgeProps) {
  return <Badge variant="light" color={color} {...props}>{children}</Badge>;
}
