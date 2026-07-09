import { CheckCircle2, Copy, Trash2, XCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { toast } from 'sonner'
import { formatJson } from '#/lib/json'
import { FieldBuilder } from '#/components/field-builder'
import { METHODS, STATUSES } from '#/lib/create'
import { useCreateStore } from '#/stores/useCreateStore'

interface RouteCardProps {
  i: number
}

export function RouteCard({ i }: RouteCardProps) {
  const routes = useCreateStore(state => state.routes)
  const fieldTrees = useCreateStore(state => state.fieldTrees)
  const responseModes = useCreateStore(state => state.responseModes)
  const updateRoute = useCreateStore(state => state.updateRoute)
  const updateFieldTree = useCreateStore(state => state.updateFieldTree)
  const setResponseMode = useCreateStore(state => state.setResponseMode)
  const cloneRoute = useCreateStore(state => state.cloneRoute)
  const removeRoute = useCreateStore(state => state.removeRoute)

  const route = routes[i]

  return (
    <Card className="card-glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Route {i + 1}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cloneRoute(i)}
              style={{ color: 'var(--sea-ink-soft)' }}
            >
              <Copy className="size-4 mr-1.5" />
              Clone
            </Button>
            <Button
              variant="ghost"
              disabled={routes.length > 1 ? false : true}
              size="sm"
              onClick={() => removeRoute(i)}
              style={{ color: '#ef4444' }}
            >
              <Trash2 className="size-4 mr-1.5" />
              Remove
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label>Method</Label>
            <Select
              value={route.method}
              onValueChange={(v) => updateRoute(i, 'method', v)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-3">
            <Label>Path</Label>
            <Input
              placeholder="/users/:id"
              value={route.path}
              onChange={(e) => updateRoute(i, 'path', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={String(route.status)}
              onValueChange={(v) => updateRoute(i, 'status', Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem
                    key={s.code}
                    value={String(s.code)}
                    className="text-xs"
                  >
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Delay (ms)</Label>
            <Input
              type="number"
              min={0}
              value={route.delay}
              onChange={(e) =>
                updateRoute(i, 'delay', Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Authentication</Label>
            <Select
              value={route.authType}
              onValueChange={(v) => updateRoute(i, 'authType', v)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="BEARER">Bearer Token</SelectItem>
                <SelectItem value="API_KEY">API Key Header</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {route.authType !== 'NONE' && (
            <div className="space-y-1.5">
              <Label>Expected Token / Key</Label>
              <Input
                placeholder="secret-token-123"
                value={route.expectedToken}
                onChange={(e) => updateRoute(i, 'expectedToken', e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Response Body</Label>
            <div className="flex gap-1">
              <button
                type="button"
                className={`text-xs px-2 py-1 rounded-sm transition-colors ${(responseModes[i] ?? 'field') === 'field'
                  ? 'font-semibold'
                  : 'opacity-60 hover:opacity-100'
                  }`}
                style={{
                  background:
                    (responseModes[i] ?? 'field') === 'field'
                      ? 'var(--accent)'
                      : 'transparent',
                  color:
                    (responseModes[i] ?? 'field') === 'field'
                      ? 'var(--accent-foreground)'
                      : 'inherit',
                }}
                onClick={() => setResponseMode(i, 'field')}
              >
                Fields
              </button>
              <button
                type="button"
                className={`text-xs px-2 py-1 rounded-sm transition-colors ${(responseModes[i] ?? 'field') === 'json'
                  ? 'font-semibold'
                  : 'opacity-60 hover:opacity-100'
                  }`}
                style={{
                  background:
                    (responseModes[i] ?? 'field') === 'json'
                      ? 'var(--accent)'
                      : 'transparent',
                  color:
                    (responseModes[i] ?? 'field') === 'json'
                      ? 'var(--accent-foreground)'
                      : 'inherit',
                }}
                onClick={() => setResponseMode(i, 'json')}
              >
                Raw JSON
              </button>
            </div>
          </div>
          {(responseModes[i] ?? 'field') === 'field' ? (
            <>
              <FieldBuilder
                nodes={fieldTrees[i] || []}
                onChange={(nodes) => updateFieldTree(i, nodes)}
                onJsonChange={(json) => updateRoute(i, 'body', json)}
              />
              <div
                className="text-xs leading-relaxed p-3 rounded-lg mt-2"
                style={{
                  background:
                    'color-mix(in srgb, var(--accent) 15%, transparent)',
                  color: 'var(--sea-ink-soft)',
                }}
              >
                <strong className="font-semibold">
                  When to use Fields:
                </strong>{' '}
                Use fields to build complex nested structures — objects
                within objects, arrays of objects, or any combination.
                Keys only matter inside objects; arrays use indexed
                positions. Use <strong>Generate</strong> on an array to
                quickly create several copies with auto-generated faker
                data.
              </div>
              <div
                className="text-xs leading-relaxed p-3 rounded-lg mt-2"
                style={{
                  background: 'color-mix(in srgb, var(--lagoon) 10%, transparent)',
                  color: 'var(--sea-ink-soft)',
                }}
              >
                <strong className="font-semibold">Faker Variables:</strong> You can use templates like <code>{`{{name.firstName}}`}</code>, <code>{`{{internet.email}}`}</code>, <code>{`{{internet.uuid}}`}</code> in string values to generate dynamic data on every request!
              </div>
              {route.body.trim() && (
                <details className="mt-2">
                  <summary
                    className="text-xs cursor-pointer select-none"
                    style={{ color: 'var(--sea-ink-soft)' }}
                  >
                    Preview JSON
                  </summary>
                  <pre
                    className="mt-1 p-3 rounded-xl text-xs overflow-x-auto max-w-full"
                    style={{
                      background: '#1d2e45',
                      color: '#e8efff',
                    }}
                  >
                    <code>{route.body}</code>
                  </pre>
                </details>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <Textarea
                className="min-h-32 max-w-3xl font-mono text-xs"
                placeholder='{"key": "value"}'
                value={route.body}
                onChange={(e) => updateRoute(i, 'body', e.target.value)}
                spellCheck={false}
              />
              {(() => {
                const body = route.body.trim()
                if (!body) return null
                let valid = true
                let error = ''
                try {
                  JSON.parse(body)
                } catch (err) {
                  valid = false
                  error = err instanceof Error ? err.message : String(err)
                }

                return (
                  <div
                    className={`text-xs p-3 rounded-lg flex items-start gap-2.5 border ${valid
                      ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
                      }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {valid ? <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" /> : <XCircle className="size-4 text-red-600 dark:text-red-400" />}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold">{valid ? 'Valid JSON' : 'Invalid JSON Syntax'}</span>
                      {!valid && <span className="font-mono mt-1 opacity-80 break-all">{error}</span>}
                    </div>
                  </div>
                )
              })()}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    const formatted = formatJson(route.body)
                    if (formatted !== route.body) {
                      updateRoute(i, 'body', formatted)
                    } else if (
                      route.body.trim() &&
                      formatted === route.body
                    ) {
                      try {
                        JSON.parse(route.body)
                      } catch {
                        toast.error('Invalid JSON — cannot format')
                      }
                    }
                  }}
                >
                  Format
                </Button>
              </div>
              <div
                className="text-xs leading-relaxed p-3 rounded-lg mt-2"
                style={{
                  background: 'color-mix(in srgb, var(--lagoon) 10%, transparent)',
                  color: 'var(--sea-ink-soft)',
                }}
              >
                <strong className="font-semibold">Faker Variables:</strong> You can use templates like <code>{`{{name.firstName}}`}</code>, <code>{`{{internet.email}}`}</code>, <code>{`{{internet.uuid}}`}</code> in string values to generate dynamic data on every request!
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
