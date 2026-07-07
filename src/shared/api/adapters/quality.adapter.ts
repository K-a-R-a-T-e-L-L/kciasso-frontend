import { qualityHub } from "@/shared/content/quality.mock";
import { resolveQualitySectionPath } from "@/shared/content/qualitySections";

export async function getQualityHub() {
  return qualityHub;
}

export async function getQualitySectionByPath(parts: string[]) {
  return resolveQualitySectionPath(parts);
}
