export const OWNED_NEWS_MEDIA_PREFIX = "/api/public/news/media/";

const OWNED_KEY = /^[a-f0-9]{64}\.(?:jpg|jpeg|png|webp)$/;
const OWNED_URL = new RegExp(`^${OWNED_NEWS_MEDIA_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([a-f0-9]{64}\.(?:jpg|jpeg|png|webp))$`);

export type ExistingNewsCover =
  | { kind: "none" }
  | { kind: "owned"; url: string; key: string; filename: string }
  | { kind: "external"; url: string };

export function ownedNewsMediaKeyFromUrl(url: string | null | undefined) {
  if (!url) return null;
  const match = url.match(OWNED_URL);
  return match?.[1] && OWNED_KEY.test(match[1]) ? match[1] : null;
}

export function isOwnedNewsMediaUrl(url: string) {
  return ownedNewsMediaKeyFromUrl(url) !== null;
}

export function classifyNewsCover(url: string | null | undefined): ExistingNewsCover {
  const value = url?.trim();
  if (!value) return { kind: "none" };
  const key = ownedNewsMediaKeyFromUrl(value);
  if (key) return { kind: "owned", url: value, key, filename: key.slice(-12) };
  return { kind: "external", url: value };
}
