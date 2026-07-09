import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Toaster } from 'sonner'
import { useCreateStore } from '#/stores/useCreateStore'
import { MockResult } from '#/components/create/MockResult'
import { RouteCard } from '#/components/create/RouteCard'

export const Route = createFileRoute('/create')({ component: CreateMock })

function CreateMock() {
  const routes = useCreateStore(state => state.routes)
  const expiresInHours = useCreateStore(state => state.expiresInHours)
  const result = useCreateStore(state => state.result)
  const submitting = useCreateStore(state => state.submitting)
  const addRoute = useCreateStore(state => state.addRoute)
  const handleSubmit = useCreateStore(state => state.handleSubmit)
  const setExpiresInHours = useCreateStore(state => state.setExpiresInHours)

  if (result) {
    return (
      <>
        <MockResult />
        <Toaster />
      </>
    )
  }

  return (
    <div className="page-wrap py-8 md:py-12 px-4 md:px-0">
      <div className="space-y-6 flex flex-col items-center justify-center ">
        <div className="mb-6 md:mb-8 rise-in">
          <h1 className="display-title text-3xl md:text-5xl font-bold">
            Create a Mock
          </h1>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-3xl">
          {routes.map((_, i) => (
            <RouteCard key={i} i={i} />
          ))}

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-base">Expiration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Expires after (hours)</Label>
                <Input
                  type="number"
                  min={1}
                  value={expiresInHours}
                  onChange={(e) =>
                    setExpiresInHours(Math.max(1, Number(e.target.value)))
                  }
                />
              </div>
              <p className="text-xs" style={{ color: 'var(--sea-ink-soft)' }}>
                Mock auto-deletes after this time. Default: 168 hours (7 days).
              </p>
            </CardContent>
          </Card>

          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="outline" onClick={addRoute} className="w-fit">
              + Add Route
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-fit glow-button"
              size="lg"
            >
              {submitting ? 'Uploading...' : 'Create Mock'}
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
