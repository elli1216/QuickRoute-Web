import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Toaster, toast } from 'sonner'
import { listMocks, deleteMock, buildEndpointUrl } from '#/lib/api'

export const Route = createFileRoute('/mocks')({ component: MyMocks })

function MyMocks() {
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['mocks'],
    queryFn: listMocks,
  })

  const handleDelete = async (mockId: string) => {
    setDeleting(mockId)
    try {
      await deleteMock(mockId)
      queryClient.invalidateQueries({ queryKey: ['mocks'] })
      toast.success('Mock deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="page-wrap py-8 md:py-12 px-4 md:px-0">
      <h1 className="display-title text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        My Mocks
      </h1>

      {isLoading && (
        <p style={{ color: 'var(--sea-ink-soft)' }}>Loading mocks...</p>
      )}

      {error && (
        <div
          className="island-shell rounded-xl p-6 border text-center"
          style={{ borderColor: 'var(--line)' }}
        >
          <p style={{ color: '#ef4444' }}>
            Failed to load mocks. Is the server running?
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--sea-ink-soft)' }}>
            Make sure the backend is started on{' '}
            <code>http://localhost:8080</code>
          </p>
        </div>
      )}

      {data && Object.keys(data).length === 0 && (
        <div
          className="island-shell rounded-xl p-12 border text-center"
          style={{ borderColor: 'var(--line)' }}
        >
          <p className="text-lg">No mocks yet.</p>
          <p className="mt-2" style={{ color: 'var(--sea-ink-soft)' }}>
            Create your first mock to see it here.
          </p>
        </div>
      )}

      {data && Object.keys(data).length > 0 && (
        <div className="space-y-4">
          {Object.values(data).map((mock) => (
            <Card key={mock.mockId}>
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
                    onClick={() => handleDelete(mock.mockId)}
                    disabled={deleting === mock.mockId}
                    style={{ color: '#ef4444', borderColor: '#fecaca' }}
                  >
                    {deleting === mock.mockId ? 'Deleting...' : 'Delete'}
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
          ))}
        </div>
      )}
      <Toaster />
    </div>
  )
}
