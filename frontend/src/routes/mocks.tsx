import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Toaster } from 'sonner'
import { useMocksStore } from '#/stores/useMocksStore'
import { MockCard } from '#/components/mock-card'
import { FolderX } from 'lucide-react'

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
    <div className="page-wrap py-12 md:py-16 px-4 md:px-0 max-w-5xl mx-auto space-y-12">
      <div className="text-center rise-in">
        <h1 className="display-title text-3xl md:text-5xl font-bold">
          Mocks
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card className="card-glass flex flex-col w-full">
          <CardHeader>
            <CardTitle className="text-lg">Look up a Mock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Paste mock ID..."
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup(lookupId)
                }}
                className="bg-(--surface-strong) border-transparent"
              />
              <Button
                variant="default"
                className="glow-button shrink-0"
                disabled={!lookupId.trim() || loading}
                onClick={() => handleLookup(lookupId)}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            {mock && (
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 border-t border-(--line)">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-(--lagoon)">
                  Result Found
                </h3>
                <MockCard
                  mock={mock}
                  onDelete={handleDelete}
                  isDeleting={deletingId === mock.mockId}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-glass flex flex-col w-full h-full">
          <CardHeader>
            <CardTitle className="text-lg">Recent Lookups</CardTitle>
          </CardHeader>
          <CardContent>
            {savedIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {savedIds.map((id) => (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs hover:bg-(--surface-strong) border-transparent bg-(--surface)"
                    onClick={() => {
                      setLookupId(id)
                      handleLookup(id)
                    }}
                  >
                    {id.slice(0, 12)}&hellip;
                  </Button>
                ))}
              </div>
            ) : (
              <p
                className="text-sm italic"
                style={{ color: 'var(--sea-ink-soft)' }}
              >
                Your recent lookups will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-(--line) pb-4">
          <h2 className="text-2xl font-bold">All Available Mocks</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAllMocks}
            disabled={allMocksLoading}
          >
            {allMocksLoading ? 'Refreshing...' : 'Refresh List'}
          </Button>
        </div>

        {allMocksLoading ? (
          <div
            className="text-center py-16 text-sm flex flex-col items-center justify-center gap-3 animate-pulse"
            style={{ color: 'var(--sea-ink-soft)' }}
          >
            <div className="w-8 h-8 rounded-full border-2 border-(--lagoon) border-t-transparent animate-spin"></div>
            Loading active mocks...
          </div>
        ) : allMocksError ? (
          <Card className="card-glass bg-red-500/5 border-red-500/20">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-red-400 font-semibold mb-2">Error loading mocks</p>
              <p className="text-sm" style={{ color: 'var(--sea-ink-soft)' }}>
                {allMocksError}
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={fetchAllMocks}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : allMocks.length === 0 ? (
          <Card className="card-glass border-dashed border-2 border-(--line) shadow-none bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-(--surface-strong) flex items-center justify-center mb-6">
                <FolderX className='size-20' />
              </div>
              <h3 className="text-xl font-bold mb-2">No Mocks Found</h3>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {allMocks.map((m) => (
              <MockCard
                key={m.mockId}
                mock={m}
                onDelete={handleDelete}
                isDeleting={deletingId === m.mockId}
              />
            ))}
          </div>
        )}
      </section>
      <Toaster />
    </div>
  )
}
