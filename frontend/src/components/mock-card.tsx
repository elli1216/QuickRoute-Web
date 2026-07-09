import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { toast } from 'sonner'
import { buildEndpointUrl } from '#/lib/api'
import type { MockSummary } from '#/lib/api'

interface MockCardProps {
  mock: MockSummary
  onDelete: (id: string) => void
  isDeleting: boolean
}

export function MockCard({ mock, onDelete, isDeleting }: MockCardProps) {
  return (
    <Card className="card-glass">
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
            onClick={() => onDelete(mock.mockId)}
            disabled={isDeleting}
            style={{ color: '#ef4444', borderColor: '#fecaca' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
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
  )
}
