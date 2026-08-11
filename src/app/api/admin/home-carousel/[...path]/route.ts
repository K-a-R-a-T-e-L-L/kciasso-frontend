import { NextRequest, NextResponse } from "next/server";
import { forwardAdminRequest } from "@/app/api/admin/_forward";

export const dynamic = "force-dynamic";

async function backendPath(context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return `/api/admin/home-carousel/${path.map(encodeURIComponent).join("/")}`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardAdminRequest(request, await backendPath(context));
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardAdminRequest(request, await backendPath(context));
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardAdminRequest(request, await backendPath(context));
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const response = await forwardAdminRequest(
    request,
    await backendPath(context),
  );
  return response.status === 204 ? NextResponse.json({ ok: true }) : response;
}
