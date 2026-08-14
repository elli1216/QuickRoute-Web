import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Button } from '#/components/ui/button'
import {
  Clock,
  Globe,
  ArrowLeft,
  RefreshCw,
  Activity,
  Copy,
  Check,
  Terminal,
  Code2,
  ExternalLink,
} from 'lucide-react'
import { BASE } from '#/lib/constants'
import {
  getMock,
  buildCurl,
  buildEndpointUrl,
} from '#/lib/api'
import type { MockSummary } from '#/lib/api'
import { useQuery } from '@tanstack/react-query'
import { toast, Toaster } from 'sonner'

export const Route = createFileRoute('/mock/$mockId/dashboard')({
  component: DashboardPage,
})

interface RequestLog {
  id: number
  method: string
  path: string
  headers: string
  queryParams: string
  body: string
  timestamp: string
  responseStatus: number
}

function tryFormatJson(data: unknown): string {
  if (data === undefined || data === null) return ''
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return data
    }
  }
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

function tryParseJsonObject(str: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(str)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function buildLogCurl(
  log: RequestLog,
  baseUrl: string,
  mockId: string,
): string {
  const fullUrl = `${baseUrl}/mock/${mockId}${log.path}`
  let cmd =
    log.method === 'GET'
      ? `curl "${fullUrl}"`
      : `curl -X ${log.method} "${fullUrl}"`

  const headersObj = tryParseJsonObject(log.headers)
  const headerEntries = Object.entries(headersObj)

  for (const [k, v] of headerEntries) {
    const lowerKey = k.toLowerCase()
    if (
      lowerKey === 'host' ||
      lowerKey === 'user-agent' ||
      lowerKey === 'accept-encoding' ||
      lowerKey === 'connection'
    ) {
      continue
    }
    cmd += ` \\\n  -H "${k}: ${v}"`
  }

  if (log.body && log.body.trim()) {
    const formattedBody = log.body.replace(/'/g, "'\\''")
    cmd += ` \\\n  -d '${formattedBody}'`
  }

  return cmd
}

function DashboardPage() {
  const { mockId } = Route.useParams()
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'inspector' | 'mock-details'>(
    'inspector',
  )
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const mockBaseUrl = `${BASE}/mock/${mockId}`

  // Fetch Mock details (routes, payloads, auth config) from DB
  const { data: mockDetail } = useQuery<MockSummary>({
    queryKey: ['mock-detail', mockId],
    queryFn: () => getMock(mockId),
  })

  const {
    data: logs,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery<RequestLog[]>({
    queryKey: ['mock-logs', mockId],
    queryFn: async () => {
      const res = await fetch(`${BASE}/mock/${mockId}/logs`)
      if (!res.ok) throw new Error('Failed to fetch logs')
      return res.json()
    },
    refetchInterval: 3000, // Poll every 3 seconds
  })

  const selectedLog = logs?.find((log) => log.id === selectedLogId)

  // Auto-select first log if none selected
  useEffect(() => {
    if (logs && logs.length > 0 && selectedLogId === null) {
      setSelectedLogId(logs[0].id)
    }
  }, [logs, selectedLogId])

  const copyText = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success(`Copied ${label} to clipboard`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'POST':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'PUT':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
      case 'PATCH':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    }
  }

  const getStatusBadgeClass = (status: number) => {
    if (status >= 200 && status < 300)
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    if (status >= 300 && status < 400)
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    if (status >= 400 && status < 500)
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    if (status >= 500)
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  }

  return (
    <div className="page-wrap py-6 md:py-8 max-w-7xl mx-auto min-h-[calc(100vh-100px)] flex flex-col space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-(--surface-strong) p-5 rounded-2xl border border-(--line)">
        <div className="flex items-center gap-4">
          <Link
            to="/mocks"
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-(--sea-ink-soft) hover:text-(--lagoon) transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-(--lagoon)" />
                Live Inspector
              </h1>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 flex items-center gap-1.5 text-xs font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </Badge>
            </div>
            <p className="text-xs text-(--sea-ink-soft) mt-0.5 font-mono">
              Mock ID:{' '}
              <span className="font-bold text-foreground">{mockId}</span>
            </p>
          </div>
        </div>

        {/* Base URL & Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/5 dark:bg-white/5 border border-(--line) px-3 py-1.5 rounded-xl font-mono text-xs max-w-xs md:max-w-md truncate">
            <span className="text-(--sea-ink-soft) shrink-0 mr-1.5">Base:</span>
            <span className="truncate font-medium">{mockBaseUrl}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              copyText(mockBaseUrl, 'base-url', 'Base Endpoint URL')
            }
            className="h-9 gap-1.5 border-transparent bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
          >
            {copiedKey === 'base-url' ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 text-(--sea-ink-soft)" />
            )}
            <span className="text-xs font-semibold">Copy Base URL</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="h-9 gap-1.5 border-transparent bg-black/5 dark:bg-white/5 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 text-(--sea-ink-soft) ${isRefetching ? 'animate-spin' : ''}`}
            />
            <span className="text-xs font-semibold">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Two-Pane Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] gap-6 flex-1 min-h-150">
        {/* Left Sidebar: Request History */}
        <Card className="flex flex-col h-full card-glass overflow-hidden border-(--line) shadow-none">
          <CardHeader className="py-3.5 px-4 border-b border-(--line) shrink-0 bg-(--surface-strong) flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Globe className="w-4 h-4 text-(--lagoon)" />
              Incoming Requests
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono">
              {logs?.length || 0} total
            </Badge>
          </CardHeader>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-(--sea-ink-soft) animate-pulse flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Fetching traffic logs...</span>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-xs text-rose-500 font-medium">
                Failed to load requests. Please check connection.
              </div>
            ) : !logs || logs.length === 0 ? (
              <div className="p-6 text-center text-(--sea-ink-soft) flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Activity className="w-6 h-6 opacity-40 text-(--lagoon)" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    No requests received yet
                  </p>
                  <p className="text-xs text-(--sea-ink-soft) mt-1 leading-relaxed">
                    Send HTTP calls to your mock routes below to see live
                    traffic appear here.
                  </p>
                </div>

                {mockDetail?.routes && mockDetail.routes.length > 0 && (
                  <div className="w-full space-y-3 text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-center">
                      Configured Route Calls:
                    </span>
                    {mockDetail.routes.map((r, idx) => {
                      const curlCmd = buildCurl(
                        r.method,
                        buildEndpointUrl(mockId, r.pathPattern),
                        r.authType,
                        r.expectedToken,
                      )
                      const key = `sample-curl-${idx}`
                      return (
                        <div
                          key={idx}
                          className="bg-black/80 dark:bg-black/50 text-slate-200 p-3 rounded-xl font-mono text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-blue-400 font-bold">
                              {r.method} {r.pathPattern}
                            </span>
                            <span className="text-emerald-400">
                              {r.statusCode} OK
                            </span>
                          </div>
                          <code className="block truncate text-slate-300 text-[11px]">
                            {curlCmd}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyText(
                                curlCmd,
                                key,
                                `${r.method} ${r.pathPattern} cURL`,
                              )
                            }
                            className="w-full text-xs h-6 gap-1 text-slate-300 hover:text-white hover:bg-white/10 mt-1 cursor-pointer"
                          >
                            {copiedKey === key ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copy {r.method} cURL</span>
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-(--line)">
                {logs.map((log) => {
                  const isSelected =
                    selectedLogId === log.id && activeTab === 'inspector'
                  return (
                    <button
                      key={log.id}
                      type="button"
                      onClick={() => {
                        setSelectedLogId(log.id)
                        setActiveTab('inspector')
                      }}
                      className={`flex flex-col gap-2 p-3.5 text-left transition-all hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${isSelected
                        ? 'bg-black/5 dark:bg-white/10 border-l-4 border-l-(--lagoon)'
                        : 'border-l-4 border-l-transparent'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge
                            variant="outline"
                            className={`${getMethodBadgeClass(log.method)} font-mono text-[10px] uppercase font-bold shrink-0 px-2 py-0`}
                          >
                            {log.method}
                          </Badge>
                          <span className="font-mono text-xs truncate text-foreground font-semibold">
                            {log.path}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getStatusBadgeClass(log.responseStatus)} text-[10px] font-mono font-bold shrink-0 px-1.5 py-0`}
                        >
                          {log.responseStatus}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-(--sea-ink-soft)">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 opacity-70" />
                          <span>
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour12: false,
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] opacity-60">
                          #{log.id}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Right Pane: Inspector & Payload Details */}
        <Card className="flex flex-col h-full card-glass overflow-hidden border-(--line) shadow-none">
          {selectedLog ? (
            <>
              {/* Header Details */}
              <CardHeader className="py-4 px-6 border-b border-(--line) shrink-0 bg-(--surface-strong) space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge
                      variant="outline"
                      className={`${getMethodBadgeClass(selectedLog.method)} text-sm font-mono font-bold px-2.5 py-0.5`}
                    >
                      {selectedLog.method}
                    </Badge>
                    <span
                      className="font-mono text-base font-bold truncate"
                      title={selectedLog.path}
                    >
                      {selectedLog.path}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${getStatusBadgeClass(selectedLog.responseStatus)} text-xs font-mono font-bold px-2 py-0.5`}
                    >
                      Status {selectedLog.responseStatus}
                    </Badge>
                  </div>

                  {/* Actions for Selected Log */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyText(
                          `${mockBaseUrl}${selectedLog.path}`,
                          'full-url',
                          'Endpoint URL',
                        )
                      }
                      className="h-8 text-xs gap-1.5 bg-black/5 dark:bg-white/5 border-transparent"
                    >
                      {copiedKey === 'full-url' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5 text-(--sea-ink-soft)" />
                      )}
                      <span>Copy Full URL</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="default"
                      onClick={() =>
                        copyText(
                          buildLogCurl(selectedLog, BASE, mockId),
                          'log-curl',
                          'cURL Command',
                        )
                      }
                      className="h-8 text-xs gap-1.5 glow-button"
                    >
                      {copiedKey === 'log-curl' ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Terminal className="w-3.5 h-3.5" />
                      )}
                      <span>Copy cURL</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-0">
                <div className="p-6 space-y-8">
                  {/* Generated cURL Snippet */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft) flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-(--lagoon)" />
                        Equivalent cURL Command
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            buildLogCurl(selectedLog, BASE, mockId),
                            'snippet-curl',
                            'cURL Command',
                          )
                        }
                        className="text-xs font-semibold text-(--lagoon) hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'snippet-curl' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {copiedKey === 'snippet-curl' ? 'Copied' : 'Copy'}
                        </span>
                      </button>
                    </div>

                    <div className="bg-black/90 dark:bg-black/70 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-black/10 shadow-inner">
                      <pre className="whitespace-pre-wrap">
                        {buildLogCurl(selectedLog, BASE, mockId)}
                      </pre>
                    </div>
                  </div>

                  {/* Headers */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft) flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-(--sea-ink-soft)" />
                      Request Headers
                    </h3>
                    <div className="bg-(--surface-strong) rounded-xl border border-(--line) overflow-hidden">
                      {(() => {
                        const headersObj = tryParseJsonObject(
                          selectedLog.headers,
                        )
                        const entries = Object.entries(headersObj)
                        if (entries.length === 0) {
                          return (
                            <div className="p-4 text-xs text-(--sea-ink-soft) italic">
                              No request headers captured.
                            </div>
                          )
                        }
                        return (
                          <table className="w-full text-xs text-left">
                            <tbody className="divide-y divide-(--line)">
                              {entries.map(([key, value]) => (
                                <tr
                                  key={key}
                                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                  <td className="py-2.5 px-4 font-mono font-semibold text-foreground w-1/3 border-r border-(--line)">
                                    {key}
                                  </td>
                                  <td className="py-2.5 px-4 font-mono text-(--sea-ink-soft) break-all">
                                    {String(value)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Query Parameters */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft) flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-(--sea-ink-soft)" />
                      Query Parameters
                    </h3>
                    <div className="bg-(--surface-strong) rounded-xl border border-(--line) overflow-hidden">
                      {(() => {
                        const paramsObj = tryParseJsonObject(
                          selectedLog.queryParams,
                        )
                        const entries = Object.entries(paramsObj)
                        if (entries.length === 0) {
                          return (
                            <div className="p-4 text-xs text-(--sea-ink-soft) italic">
                              No query parameters provided.
                            </div>
                          )
                        }
                        return (
                          <table className="w-full text-xs text-left">
                            <tbody className="divide-y divide-(--line)">
                              {entries.map(([key, value]) => (
                                <tr
                                  key={key}
                                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                  <td className="py-2.5 px-4 font-mono font-semibold text-foreground w-1/3 border-r border-(--line)">
                                    {key}
                                  </td>
                                  <td className="py-2.5 px-4 font-mono text-(--sea-ink-soft) break-all">
                                    {Array.isArray(value)
                                      ? value.join(', ')
                                      : String(value)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Request Body */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft) flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-(--sea-ink-soft)" />
                        Request Body Payload
                      </h3>
                      {selectedLog.body && selectedLog.body.trim() && (
                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              selectedLog.body,
                              'body-text',
                              'Request Body',
                            )
                          }
                          className="text-xs font-semibold text-(--lagoon) hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'body-text' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>Copy Payload</span>
                        </button>
                      )}
                    </div>

                    <div className="bg-(--surface-strong) rounded-xl border border-(--line) overflow-hidden p-4">
                      {selectedLog.body && selectedLog.body.trim() ? (
                        <pre className="font-mono text-xs text-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {tryFormatJson(selectedLog.body)}
                        </pre>
                      ) : (
                        <span className="text-xs text-(--sea-ink-soft) italic">
                          No request body payload sent with this request.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-(--sea-ink-soft) p-8 text-center space-y-3">
              <Activity className="w-10 h-10 opacity-30 text-(--lagoon)" />
              <div>
                <p className="font-bold text-foreground">Select a request</p>
                <p className="text-xs text-(--sea-ink-soft) mt-0.5">
                  Click on any incoming request log from the sidebar to inspect
                  payload details and copy cURL commands.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
