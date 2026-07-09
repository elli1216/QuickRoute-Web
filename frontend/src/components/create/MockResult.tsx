import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import { toast } from 'sonner'
import { buildEndpointUrl, buildCurl } from '#/lib/api'
import { useCreateStore } from '#/stores/useCreateStore'
import { CodeWindow } from '#/components/ui/code-window'

export function MockResult() {
  const result = useCreateStore(state => state.result)
  const routes = useCreateStore(state => state.routes)
  const expiresInHours = useCreateStore(state => state.expiresInHours)
  const resetForm = useCreateStore(state => state.resetForm)

  if (!result) return null

  return (
    <div className="page-wrap max-w-3xl py-8 md:py-12 px-4 md:px-0">
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="display-title text-xl md:text-2xl">
            Mock Created!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="island-shell rounded-xl p-4 md:p-5 border"
            style={{ borderColor: 'var(--line)' }}
          >
            <Label>Your Mock ID</Label>
            <div className="flex gap-2 mt-1">
              <code
                className="flex-1 p-3 rounded-lg text-sm font-mono break-all"
                style={{ background: 'var(--bg-base)' }}
              >
                {result.mockId}
              </code>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(result.mockId)
                  toast.success('Copied!')
                }}
                className="shrink-0"
              >
                Copy
              </Button>
            </div>
          </div>

          <div
            className="island-shell rounded-xl p-4 md:p-5 border"
            style={{ borderColor: 'var(--line)' }}
          >
            <Label>Expires</Label>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--sea-ink-soft)' }}
            >
              {new Date(
                Date.now() + expiresInHours * 3_600_000,
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Endpoints</h3>
            <div className="space-y-2">
              {routes.map((r, i) => {
                const url = buildEndpointUrl(
                  result.mockId,
                  r.path.startsWith('/') ? r.path : `/${r.path}`,
                )
                return (
                  <div
                    key={i}
                    className="island-shell rounded-xl p-3 md:p-4 border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold shrink-0 self-start sm:self-auto"
                      style={{
                        background:
                          r.method === 'GET'
                            ? '#dbeafe'
                            : r.method === 'POST'
                              ? '#dcfce7'
                              : r.method === 'DELETE'
                                ? '#fee2e2'
                                : r.method === 'PUT'
                                  ? '#fef3c7'
                                  : '#f3e8ff',
                        color:
                          r.method === 'GET'
                            ? '#1e40af'
                            : r.method === 'POST'
                              ? '#166534'
                              : r.method === 'DELETE'
                                ? '#991b1b'
                                : r.method === 'PUT'
                                  ? '#92400e'
                                  : '#6b21a8',
                      }}
                    >
                      {r.method}
                    </span>
                    <code className="text-xs md:text-sm flex-1 break-all">
                      {url}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(url)
                        toast.success('URL copied!')
                      }}
                      className="w-full sm:w-auto shrink-0"
                    >
                      Copy URL
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">Quick test (curl)</h3>
            <div className="space-y-2">
              {routes.map((r, i) => {
                const url = buildEndpointUrl(
                  result.mockId,
                  r.path.startsWith('/') ? r.path : `/${r.path}`,
                )
                const curl = buildCurl(r.method, url)
                return (
                  <CodeWindow key={i}>
                    <pre><code>{curl}</code></pre>
                  </CodeWindow>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={resetForm}>Create Another Mock</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
