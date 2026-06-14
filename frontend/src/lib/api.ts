const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface RouteFormInput {
  method: string
  path: string
  status: number
  delay: number
  body: string
}

interface RouteConfigDto {
  status?: number
  delay?: number
  body: unknown
}

export interface MockUploadResult {
  mockId: string
}

export interface MockSummary {
  mockId: string
  routeCount: number
  createdAt: string
  expiresAt: string
  routes: Array<{
    method: string
    pathPattern: string
    statusCode: number
    delayMs: number
  }>
}

export function buildEndpointUrl(mockId: string, pathPattern: string): string {
  return `${BASE}/mock/${mockId}${pathPattern}`
}

export function buildCurl(method: string, url: string): string {
  const cmd = method === 'GET' ? `curl ${url}` : `curl -X ${method} ${url}`
  return cmd
}

export async function uploadMock(
  routes: RouteFormInput[],
  expiresInHours: number = 168,
): Promise<MockUploadResult> {
  const body: Record<string, RouteConfigDto> = {}

  for (const route of routes) {
    const key = `${route.method} ${route.path}`
    let parsedBody: unknown = route.body
    if (route.body.trim()) {
      try {
        parsedBody = JSON.parse(route.body)
      } catch {
        parsedBody = route.body
      }
    } else {
      parsedBody = null
    }

    body[key] = {
      status: route.status,
      delay: route.delay,
      body: parsedBody,
    }
  }

  const res = await fetch(
    `${BASE}/mock/upload?expiresInHours=${expiresInHours}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Upload failed')
  }

  return res.json()
}

export async function listMocks(): Promise<Record<string, MockSummary>> {
  const res = await fetch(`${BASE}/mocks`)
  if (!res.ok) throw new Error('Failed to load mocks')
  return res.json()
}

export async function deleteMock(mockId: string): Promise<void> {
  const res = await fetch(`${BASE}/mock/${mockId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Delete failed')
}
