import { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/app/api/admin/_forward";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return forwardAdminRequest(request, "/api/admin/home-carousel");
}

export function POST(request: NextRequest) {
  return forwardAdminRequest(request, "/api/admin/home-carousel");
}
