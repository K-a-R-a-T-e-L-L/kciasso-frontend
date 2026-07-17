import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, await context.params)
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, await context.params)
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, await context.params)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, await context.params)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, await context.params)
}

async function forward(request: NextRequest, params: { path: string[] }) {
  const token = (await cookies()).get('kciasso_admin_token')?.value
  if (!token) return NextResponse.json({ statusCode: 401, errorMessage: 'NOT_AUTH', error: 'Unauthorized' }, { status: 401 })

  const path = params.path.map(segment => encodeURIComponent(segment)).join('/')
  const headers = new Headers({ Authorization: `Bearer ${token}` })
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body
  const response = await fetch(`${backendUrl}/api/admin/documents/${path}${request.nextUrl.search}`, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
    ...(body ? { duplex: 'half' as const } : {}),
  })
  return new NextResponse(response.body, { status: response.status, headers: response.headers })
}
