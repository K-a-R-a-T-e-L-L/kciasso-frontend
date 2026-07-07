import { gia11Page, gia9Page, giaReferenceHub, giaReferencePages } from "@/shared/content/gia.mock";

export async function getGiaReferenceHub() {
  return giaReferenceHub;
}

export async function getGiaReferencePageBySlug(slug: string) {
  return giaReferencePages.find((item) => item.slug === slug) ?? null;
}

export async function getGia9Page() {
  return gia9Page;
}

export async function getGia11Page() {
  return gia11Page;
}
