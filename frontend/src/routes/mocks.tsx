import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Toaster, toast } from 'sonner'
import { getMock, deleteMock, buildEndpointUrl } from '#/lib/api'
import type { MockSummary } from '#/lib/api'

export const Route = createFileRoute('/mocks')({ component: MyMocks })

function loadSavedMockIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem('quickroute-mock-ids') || '[]')
  } catch {
    return []
  }
}

function removeSavedId(id: string) {
  const ids = loadSavedMockIds().filter((x) => x !== id)
  localStorage.setItem('quickroute-mock-ids', JSON.stringify(ids))
}

function MyMocks() {
  const [lookupId, setLookupId] = useState('')
  const [mock, setMock] = useState<MockSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const savedIds = loadSavedMockIds()

  const handleLookup = async (id: string) => {
    const trimmed = id.trim()
    if (!trimmed) return

    setLoading(true)
    setMock(null)
    try {
      const result = await getMock(trimmed)
      setMock(result)
    } catch {
      toast.error('Mock not found')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!mock) return
    setDeleting(true)
    try {
      await deleteMock(mock.mockId)
      removeSavedId(mock.mockId)
      toast.success('Mock deleted')
      setMock(null)
      setLookupId('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="page-wrap py-8 md:py-12 px-4 md:px-0">
      <h1 className="display-title text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        My Mocks
      </h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6 md:mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Look up a Mock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Mock ID</Label>
              <Input
                placeholder="Paste mock ID..."
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup(lookupId)
                }}
              />
            </div>
            <Button
              variant="default"
              className="w-full"
              disabled={!lookupId.trim() || loading}
              onClick={() => handleLookup(lookupId)}
            >
              {loading ? 'Looking up...' : 'Look Up'}
            </Button>
          </CardContent>
        </Card>

        {savedIds.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Mock IDs</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {savedIds.map((id) => (
                <Button
                  key={id}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs"
                  onClick={() => {
                    setLookupId(id)
                    handleLookup(id)
                  }}
                >
                  {id.slice(0, 12)}&hellip;
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {mock && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-mono break-all">
                  {mock.mockId}
                </CardTitle>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--sea-ink-soft)' }}
                >
                  {mock.routeCount} route{mock.routeCount !== 1 ? 's' : ''}{' '}
                  &bull; Created {new Date(mock.createdAt).toLocaleString()}
                  <br />
                  Expires {new Date(mock.expiresAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                style={{ color: '#ef4444', borderColor: '#fecaca' }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {mock.routes.map((route, j) => {
                const url = buildEndpointUrl(
                  mock.mockId,
                  route.pathPattern.startsWith('/')
                    ? route.pathPattern
                    : `/${route.pathPattern}`,
                )
                return (
                  <div
                    key={j}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm py-2 sm:py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-bold shrink-0"
                        style={{
                          background:
                            route.method === 'GET'
                              ? '#dbeafe'
                              : route.method === 'POST'
                                ? '#dcfce7'
                                : route.method === 'DELETE'
                                  ? '#fee2e2'
                                  : route.method === 'PUT'
                                    ? '#fef3c7'
                                    : '#f3e8ff',
                          color:
                            route.method === 'GET'
                              ? '#1e40af'
                              : route.method === 'POST'
                                ? '#166534'
                                : route.method === 'DELETE'
                                  ? '#991b1b'
                                  : route.method === 'PUT'
                                    ? '#92400e'
                                    : '#6b21a8',
                        }}
                      >
                        {route.method}
                      </span>
                      <code className="flex-1 truncate text-xs sm:text-sm">
                        {route.pathPattern}
                      </code>
                      <span
                        className="shrink-0 text-xs"
                        style={{ color: 'var(--sea-ink-soft)' }}
                      >
                        {route.statusCode}
                        {route.delayMs > 0 ? ` / ${route.delayMs}ms` : ''}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-xs w-full sm:w-auto"
                      onClick={() => {
                        navigator.clipboard.writeText(url)
                        toast.success('URL copied!')
                      }}
                    >
                      Copy URL
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
      <Toaster />
    </div>
  )
}
