import { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/app/api/admin/_forward";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return forwardAdminRequest(
    request,
    `/api/admin/document-share-links/${encodeURIComponent(id)}/revoke`,
  );
}
