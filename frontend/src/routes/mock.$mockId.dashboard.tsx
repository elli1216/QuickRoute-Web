import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Clock, Globe, ArrowLeft, RefreshCw, Activity } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { BASE } from '#/lib/constants'
import { useQuery } from '@tanstack/react-query'

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

function DashboardPage() {
  const { mockId } = Route.useParams()
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null)

  const { data: logs, isLoading, error, isRefetching } = useQuery<RequestLog[]>({
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

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      case 'POST': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'PUT': return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
      case 'DELETE': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      case 'PATCH': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      default: return 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-500'
    if (status >= 300 && status < 400) return 'text-blue-500'
    if (status >= 400 && status < 500) return 'text-orange-500'
    if (status >= 500) return 'text-red-500'
    return 'text-slate-500'
  }

  return (
    <div className="page-wrap py-6 md:py-10 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-(--sea-ink-soft) hover:text-(--lagoon) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-(--lagoon)" />
              Live Inspector
            </h1>
            <p className="text-sm text-(--sea-ink-soft)">
              Monitoring API traffic for Mock ID: <span className="font-mono text-xs text-foreground bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{mockId}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRefetching && <RefreshCw className="w-4 h-4 animate-spin text-(--sea-ink-soft)" />}
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Updates
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-6 flex-1 min-h-0">
        {/* Left Sidebar: Request List */}
        <Card className="flex flex-col h-full card-glass overflow-hidden border-(--line)">
          <CardHeader className="py-4 border-b border-(--line) shrink-0 bg-(--surface-strong)">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="w-4 h-4 text-(--sea-ink-soft)" />
              Recent Requests
            </CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-y-auto">
            {isLoading && !logs ? (
              <div className="p-8 text-center text-(--sea-ink-soft)">Loading requests...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">Failed to load requests.</div>
            ) : !logs || logs.length === 0 ? (
              <div className="p-8 text-center text-(--sea-ink-soft) flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                <p>No requests yet. Send a request to your mock endpoint to see it appear here.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-(--line)">
                {logs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`flex flex-col gap-2 p-4 text-left transition-colors hover:bg-(--surface-strong) ${selectedLogId === log.id ? 'bg-(--surface-strong) border-l-2 border-l-(--lagoon)' : 'border-l-2 border-l-transparent'}`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge className={`${getMethodColor(log.method)} font-mono text-[10px] uppercase shrink-0`}>
                          {log.method}
                        </Badge>
                        <span className="font-mono text-xs truncate text-foreground/90 font-medium">
                          {log.path}
                        </span>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${getStatusColor(log.responseStatus)}`}>
                        {log.responseStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-(--sea-ink-soft)">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Right Pane: Request Details */}
        <Card className="flex flex-col h-full card-glass overflow-hidden border-(--line)">
          {selectedLog ? (
            <>
              <CardHeader className="py-4 border-b border-(--line) shrink-0 bg-(--surface-strong)">
                <div className="flex items-center gap-3">
                  <Badge className={`${getMethodColor(selectedLog.method)} text-sm px-2 py-0.5`}>
                    {selectedLog.method}
                  </Badge>
                  <span className="font-mono text-sm font-medium truncate flex-1" title={selectedLog.path}>
                    {selectedLog.path}
                  </span>
                  <span className={`text-sm font-bold ${getStatusColor(selectedLog.responseStatus)}`}>
                    {selectedLog.responseStatus}
                  </span>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-0">
                <div className="p-6 space-y-8">
                  {/* Headers */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-(--sea-ink-soft)">Headers</h3>
                    <div className="bg-(--surface-strong) rounded-lg border border-(--line) overflow-hidden">
                      {(() => {
                        try {
                          const headers = JSON.parse(selectedLog.headers)
                          const entries = Object.entries(headers)
                          if (entries.length === 0) return <div className="p-3 text-sm text-(--sea-ink-soft)">No headers</div>
                          return (
                            <table className="w-full text-sm text-left">
                              <tbody className="divide-y divide-(--line)">
                                {entries.map(([key, value]) => (
                                  <tr key={key} className="hover:bg-white/40 dark:hover:bg-slate-900/40">
                                    <td className="py-2 px-4 font-mono text-xs font-medium text-foreground w-1/3 border-r border-(--line)">{key}</td>
                                    <td className="py-2 px-4 font-mono text-xs text-(--sea-ink-soft) break-all">{String(value)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )
                        } catch(e) {
                          return <div className="p-3 text-sm font-mono break-all">{selectedLog.headers}</div>
                        }
                      })()}
                    </div>
                  </div>

                  {/* Query Params */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-(--sea-ink-soft)">Query Parameters</h3>
                    <div className="bg-(--surface-strong) rounded-lg border border-(--line) overflow-hidden">
                      {(() => {
                        try {
                          const params = JSON.parse(selectedLog.queryParams)
                          const entries = Object.entries(params)
                          if (entries.length === 0) return <div className="p-3 text-sm text-(--sea-ink-soft)">No query parameters</div>
                          return (
                            <table className="w-full text-sm text-left">
                              <tbody className="divide-y divide-(--line)">
                                {entries.map(([key, value]) => (
                                  <tr key={key} className="hover:bg-white/40 dark:hover:bg-slate-900/40">
                                    <td className="py-2 px-4 font-mono text-xs font-medium text-foreground w-1/3 border-r border-(--line)">{key}</td>
                                    <td className="py-2 px-4 font-mono text-xs text-(--sea-ink-soft) break-all">
                                      {Array.isArray(value) ? value.join(', ') : String(value)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )
                        } catch(e) {
                          return <div className="p-3 text-sm font-mono break-all">{selectedLog.queryParams}</div>
                        }
                      })()}
                    </div>
                  </div>

                  {/* Request Body */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-(--sea-ink-soft)">Request Body</h3>
                    <div className="bg-(--bg-base) rounded-lg border border-(--line) overflow-hidden p-4">
                      {selectedLog.body ? (
                        <pre className="font-mono text-xs text-foreground overflow-x-auto whitespace-pre-wrap wrap-break-word">
                          {selectedLog.body}
                        </pre>
                      ) : (
                        <span className="text-sm text-(--sea-ink-soft)">No request body</span>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-(--sea-ink-soft) p-8 text-center space-y-4">
              <Activity className="w-12 h-12 opacity-20" />
              <div>
                <p className="font-medium text-foreground/80">Select a request</p>
                <p className="text-sm">Click on a request from the sidebar to view its details here.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
