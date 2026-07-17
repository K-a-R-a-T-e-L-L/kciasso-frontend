import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function PATCH(request: NextRequest) {
  const token = (await cookies()).get('kciasso_admin_token')?.value
  if (!token) return NextResponse.json({ statusCode: 401, errorMessage: 'NOT_AUTH', error: 'Unauthorized' }, { status: 401 })

  const response = await fetch(`${backendUrl}/api/admin/document-placements/reorder`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': request.headers.get('content-type') || 'application/json',
    },
    body: request.body,
    cache: 'no-store',
    ...(request.body ? { duplex: 'half' as const } : {}),
  })

  return new NextResponse(response.body, { status: response.status, headers: response.headers })
}
