"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "@mantine/core";

export default function AdminLinkButton({ href, children, ...props }: ButtonProps & { href: string; children: React.ReactNode }) {
  return <Button component={Link} href={href} {...props}>{children}</Button>;
}

