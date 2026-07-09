import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Toaster } from 'sonner'
import { useMocksStore } from '#/stores/useMocksStore'
import { MockCard } from '#/components/mock-card'

export const Route = createFileRoute('/mocks')({ component: MyMocks })

function loadSavedMockIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem('quickroute-mock-ids') || '[]')
  } catch {
    return []
  }
}

function MyMocks() {
  const lookupId = useMocksStore(state => state.lookupId);
  const mock = useMocksStore(state => state.mock);
  const loading = useMocksStore(state => state.loading);
  const deletingId = useMocksStore(state => state.deletingId);
  const allMocks = useMocksStore(state => state.allMocks);
  const allMocksLoading = useMocksStore(state => state.allMocksLoading);
  const allMocksError = useMocksStore(state => state.allMocksError);
  const setLookupId = useMocksStore(state => state.setLookupId);
  const handleLookup = useMocksStore(state => state.handleLookup);
  const handleDelete = useMocksStore(state => state.handleDelete);
  const fetchAllMocks = useMocksStore(state => state.fetchAllMocks);

  const savedIds = loadSavedMockIds()

  useEffect(() => {
    fetchAllMocks()
  }, [fetchAllMocks])

  return (
    <div className="page-wrap py-8 md:py-12 px-4 md:px-0">
      <div className="space-y-6 flex flex-col items-center justify-center">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="display-title text-2xl md:text-4xl font-bold">
            My Mocks
          </h1>
        </div>

        <div className="w-full space-y-4 mb-6 md:mb-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <Card className='w-full max-w-3xl card-glass'>
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
                  className="w-full glow-button"
                  disabled={!lookupId.trim() || loading}
                  onClick={() => handleLookup(lookupId)}
                >
                  {loading ? 'Looking up...' : 'Look Up'}
                </Button>
              </CardContent>
            </Card>

            {savedIds.length > 0 && (
              <Card className="w-full max-w-3xl card-glass">
                <CardHeader>
                  <CardTitle className="text-base">Recent Mock IDs</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {savedIds.map((id) => (
                    <Button
                      key={id}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs hover:bg-(--surface-strong)"
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
            <div className="w-full max-w-3xl mx-auto space-y-3 mt-8">
              <h2 className="text-lg font-semibold border-b border-(--line) pb-2">Search Result</h2>
              <MockCard mock={mock} onDelete={handleDelete} isDeleting={deletingId === mock.mockId} />
            </div>
          )}

          <div className="w-full max-w-5xl mx-auto space-y-4 mt-12">
            <h2 className="text-xl font-bold border-b border-(--line) pb-2">All Available Mocks</h2>

            {allMocksLoading ? (
              <div className="text-center py-12 text-sm" style={{ color: 'var(--sea-ink-soft)' }}>
                Loading available mocks...
              </div>
            ) : allMocksError ? (
              <Card className="card-glass bg-red-500/10 border-red-500/20">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-red-400 font-semibold mb-2">Error loading mocks</p>
                  <p className="text-sm" style={{ color: 'var(--sea-ink-soft)' }}>{allMocksError}</p>
                  <Button variant="outline" className="mt-4" onClick={fetchAllMocks}>Try Again</Button>
                </CardContent>
              </Card>
            ) : allMocks.length === 0 ? (
              <Card className="card-glass border-dashed border-2 border-(--line) shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-(--surface-strong) flex items-center justify-center mb-4">
                    <span className="text-2xl opacity-50">📂</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No Mocks Found</h3>
                  <p className="text-sm mb-4 max-w-sm" style={{ color: 'var(--sea-ink-soft)' }}>
                    You haven't created any mocks yet, or all your mocks have expired.
                  </p>
                  <Button variant="default" className="glow-button" onClick={() => window.location.href = '/create'}>
                    Create Your First Mock
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {allMocks.map(m => (
                  <MockCard key={m.mockId} mock={m} onDelete={handleDelete} isDeleting={deletingId === m.mockId} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
