import type { APIRequestContext } from "@playwright/test";

export const PLACEMENT_FIXTURE_KEYS = [
  "gia-9.normative-documents", "gia-9.demo", "gia-9.deadlines", "gia-9.results", "gia-9.reports",
  "gia-11.normative-documents", "gia-11.demo", "gia-11.deadlines", "gia-11.results", "gia-11.reports", "gia-11.essay", "gia-11.analytics",
  "gia.results", "gia.ege-appeals", "gia.oge-appeals", "gia.final-essay", "gia.final-interview", "gia.ppe", "gia.deadlines", "gia.application-gia-11", "gia.application-gia-9", "gia.kege", "gia.koge", "gia.speaking", "gia.foreign-citizens", "gia.posters", "gia.preparation",
  "quality.rsoko", "quality.rsoko.normativnye-dokumenty", "quality.rsoko.regionalnye-kontrolnye-raboty", "quality.rsoko.regionalnye-kontrolnye-raboty.demo", "quality.rsoko.regionalnye-kontrolnye-raboty.sroki", "quality.rsoko.regionalnye-kontrolnye-raboty.results", "quality.vpr", "quality.vpr.normativnye-dokumenty", "quality.vpr.demo", "quality.vpr.sroki", "quality.vpr.results", "quality.niko", "quality.niko.normativnye-dokumenty", "quality.niko.demo", "quality.niko.sroki", "quality.niko.results", "quality.proekt-500", "quality.funkcionalnaya-gramotnost", "quality.iccs", "quality.pirls", "quality.pisa", "quality.timss", "quality.ocenka-po-modeli-pisa", "quality.mehanizmy-upravleniya", "quality.issledovanie-kompetentsiy-uchiteley", "quality.issledovanie-kompetentsiy-uchiteley.normativnye-dokumenty", "quality.issledovanie-kompetentsiy-uchiteley.demo", "quality.issledovanie-kompetentsiy-uchiteley.sroki", "quality.issledovanie-kompetentsiy-uchiteley.results", "quality.vpr-spo", "quality.vpr-spo.normativnye-dokumenty",
  "regionalnyy-proekt.ege", "regionalnyy-proekt.vuz", "regionalnyy-proekt.video", "regionalnyy-proekt.documents", "regionalnyy-proekt",
  "about.ob-uchrezhdenii", "about.protivodeystvie-korruptsii", "about.soveshchaniya", "about.obuchenie",
] as const;

export type PlacementFixture = {
  documentId: number;
  cardTitle: string;
  placementKeys: readonly string[];
  firstPlacementLabel: string;
  middlePlacementLabel: string;
  lastPlacementLabel: string;
};

export async function createPlacementFixture(request: APIRequestContext): Promise<PlacementFixture> {
  const backend = process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4491";
  const auth = await request.post(`${backend}/api/user/authenticate`, {
    data: {
      email: process.env.KCIASSO_ADMIN_EMAIL ?? "admin-i6b6@example.com",
      password: process.env.KCIASSO_ADMIN_PASSWORD ?? "AdminI6b6Pass123!",
    },
  });
  if (!auth.ok()) throw new Error(`fixture auth failed: ${auth.status()}`);
  const token = (await auth.json()).token as string;
  const cardTitle = `I84 placement fixture ${Date.now()}`;
  const form = new FormData();
  for (const key of PLACEMENT_FIXTURE_KEYS) form.append("placementKeys", key);
  form.append("title", cardTitle);
  form.append("file", new Blob(["%PDF-1.7\\nI84 fixture\\n%%EOF"], { type: "application/pdf" }), "i84-placement.pdf");
  const created = await request.post(`${backend}/api/admin/documents`, {
    headers: { authorization: `Bearer ${token}` },
    multipart: form,
  });
  if (created.status() !== 201) throw new Error(`fixture create failed: ${created.status()} ${await created.text()}`);
  const body = await created.json() as { id: number };
  return {
    documentId: body.id,
    cardTitle,
    placementKeys: PLACEMENT_FIXTURE_KEYS,
    firstPlacementLabel: "Нормативные документы",
    middlePlacementLabel: "ВПР",
    lastPlacementLabel: "Training",
  };
}
