import { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/app/api/admin/_forward";

type Context = { params: Promise<{ versionId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { versionId } = await context.params;
  return forwardAdminRequest(
    request,
    `/api/admin/document-versions/${encodeURIComponent(versionId)}/share-links`,
  );
}

export async function POST(request: NextRequest, context: Context) {
  const { versionId } = await context.params;
  return forwardAdminRequest(
    request,
    `/api/admin/document-versions/${encodeURIComponent(versionId)}/share-links`,
  );
}
