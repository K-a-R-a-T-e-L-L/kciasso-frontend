import type { Metadata } from "next";

export function isSiteNoindexEnabled(): boolean {
  return process.env.SITE_NOINDEX === "true";
}

export function getSiteRobotsMetadata(): Metadata["robots"] | undefined {
  if (!isSiteNoindexEnabled()) return undefined;

  return {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  };
}
