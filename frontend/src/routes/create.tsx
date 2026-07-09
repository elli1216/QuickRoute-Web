import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
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
import { Toaster, toast } from 'sonner'
import type { RouteFormInput, MockUploadResult } from '#/lib/api'
import { uploadMock, buildEndpointUrl, buildCurl } from '#/lib/api'
import { formatJson } from '#/lib/json'
import { jsonToFieldNodes } from '#/lib/field-builder'
import type { FieldNode } from '#/lib/field-builder'
import { FieldBuilder } from '#/components/field-builder'
import { METHODS, STATUSES } from '#/lib/create'

export const Route = createFileRoute('/create')({ component: CreateMock })

const emptyRoute = (): RouteFormInput => ({
  method: 'GET',
  path: '',
  status: 200,
  delay: 0,
  body: '',
  authType: 'NONE',
  expectedToken: '',
})

function saveMockId(id: string) {
  const ids: string[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('quickroute-mock-ids') || '[]')
    } catch {
      return []
    }
  })().filter((x: string) => x !== id)
  ids.unshift(id)
  localStorage.setItem('quickroute-mock-ids', JSON.stringify(ids.slice(0, 20)))
}

function CreateMock() {
  const [routes, setRoutes] = useState<RouteFormInput[]>([emptyRoute()])
  const [fieldTrees, setFieldTrees] = useState<FieldNode[][]>([[]])
  const [expiresInHours, setExpiresInHours] = useState(168)
  const [responseModes, setResponseModes] = useState<('field' | 'json')[]>(() =>
    routes.map(() => 'field' as const),
  )
  const [result, setResult] = useState<MockUploadResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const updateRoute = useCallback(
    (i: number, field: keyof RouteFormInput, value: string | number) => {
      setRoutes((prev) => {
        const next = prev.map((r, j) =>
          j === i ? { ...r, [field]: value } : r,
        )
        return next
      })
    },
    [],
  )

  const updateFieldTree = useCallback((i: number, nodes: FieldNode[]) => {
    setFieldTrees((prev) => {
      const next = [...prev]
      next[i] = nodes
      return next
    })
  }, [])

  const setResponseMode = useCallback(
    (index: number, mode: 'field' | 'json') => {
      if (mode === 'json') {
        setResponseModes((prev) => {
          const next = [...prev]
          next[index] = 'json'
          return next
        })
        return
      }
      const body = routes[index].body
      if (!body.trim()) {
        updateFieldTree(index, [])
        setResponseModes((prev) => {
          const next = [...prev]
          next[index] = 'field'
          return next
        })
        return
      }
      try {
        const nodes = jsonToFieldNodes(body)
        updateFieldTree(index, nodes)
        setResponseModes((prev) => {
          const next = [...prev]
          next[index] = 'field'
          return next
        })
      } catch {
        toast.error('Invalid JSON — cannot switch to Field Builder')
      }
    },
    [routes, updateFieldTree],
  )

  const addRoute = useCallback(() => {
    setRoutes((prev) => [...prev, emptyRoute()])
    setFieldTrees((prev) => [...prev, []])
    setResponseModes((prev) => [...prev, 'field'])
  }, [])

  const removeRoute = useCallback((i: number) => {
    setRoutes((prev) =>
      prev.length > 1 ? prev.filter((_, j) => j !== i) : prev,
    )
    setFieldTrees((prev) =>
      prev.length > 1 ? prev.filter((_, j) => j !== i) : prev,
    )
    setResponseModes((prev) =>
      prev.length > 1 ? prev.filter((_, j) => j !== i) : prev,
    )
  }, [])

  const handleSubmit = useCallback(async () => {
    const errors: string[] = []
    routes.forEach((r, i) => {
      if (!r.path.trim()) errors.push(`Route ${i + 1}: path is required`)
      if (r.status < 100 || r.status > 599)
        errors.push(`Route ${i + 1}: status must be 100-599`)
      if (r.delay < 0) errors.push(`Route ${i + 1}: delay must be >= 0`)
    })

    if (errors.length > 0) {
      errors.forEach((e) => toast.error(e))
      return
    }

    setSubmitting(true)
    try {
      const res = await uploadMock(routes, expiresInHours)
      setResult(res)
      saveMockId(res.mockId)
      toast.success('Mock created!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }, [routes])

  const resetForm = useCallback(() => {
    setRoutes([emptyRoute()])
    setFieldTrees([[]])
    setResponseModes(['field'])
    setResult(null)
  }, [])

  if (result) {
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
                    <pre
                      key={i}
                      className="p-3 rounded-xl text-xs overflow-x-auto"
                      style={{ background: '#1d2e45', color: '#e8efff' }}
                    >
                      <code>{curl}</code>
                    </pre>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={resetForm}>Create Another Mock</Button>
            </div>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="page-wrap py-8 md:py-12 px-4 md:px-0">
      <div className="space-y-6 flex flex-col items-center justify-center ">
        <div className="mb-6 md:mb-8">
          <h1 className="display-title text-2xl md:text-4xl font-bold flex items-center justify-center">
            Create a Mock
          </h1>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-3xl">
          {routes.map((route, i) => (
            <Card key={i} className="card-glass">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Route {i + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRoute(i)}
                    style={{ color: '#ef4444' }}
                  >
                    Remove
                  </Button>
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
                      <SelectTrigger>
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
