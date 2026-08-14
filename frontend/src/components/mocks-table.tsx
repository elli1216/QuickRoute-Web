import { useState } from 'react'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { buildEndpointUrl, buildCurl } from '#/lib/api'
import type { MockSummary } from '#/lib/api'
import { Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'
import { Key, Copy, Check, Activity } from 'lucide-react'
import { toast } from 'sonner'

interface MocksTableProps {
  data: MockSummary[]
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    POST: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    PATCH:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    DELETE:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  }
  return (
    <Badge
      variant="outline"
      className={`font-mono text-xs font-bold ${colors[method] || ''}`}
    >
      {method}
    </Badge>
  )
}

export function MocksTable({ data }: MocksTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedMock, setSelectedMock] = useState<MockSummary | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast.success('Copied curl command to clipboard')
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const columns: ColumnDef<MockSummary>[] = [
    {
      accessorKey: 'mockId',
      header: 'Mock ID',
      cell: ({ row }) => {
        const mock = row.original
        return (
          <button
            type="button"
            onClick={() => setSelectedMock(mock)}
            className="font-mono text-sm font-semibold text-(--lagoon) hover:underline cursor-pointer text-left"
          >
            {mock.mockId}
          </button>
        )
      },
    },
    {
      accessorKey: 'routeCount',
      header: 'Routes',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10">
          {row.getValue('routeCount')}{' '}
          {row.getValue('routeCount') === 1 ? 'route' : 'routes'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const d = new Date(row.getValue('createdAt'))
        return <span>{d.toLocaleString()}</span>
      },
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expires At',
      cell: ({ row }) => {
        const d = new Date(row.getValue('expiresAt'))
        return <span className="opacity-70">{d.toLocaleString()}</span>
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const mock = row.original
        return (
          <Link
            to="/mock/$mockId/dashboard"
            params={{ mockId: mock.mockId }}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-(--lagoon)/10 text-(--lagoon) hover:bg-(--lagoon)/20 transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </Link>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search mocks by ID or date..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm bg-(--surface-strong) border-transparent shadow-none"
        />
      </div>

      <div className="rounded-md border border-(--line) bg-(--surface-strong) overflow-hidden">
        <Table>
          <TableHeader className="bg-black/5 dark:bg-white/5 border-b border-(--line)">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-(--line) hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-(--sea-ink-soft) h-10"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-(--line) hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-(--sea-ink-soft)"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-transparent shadow-none bg-(--surface-strong)"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-transparent shadow-none bg-(--surface-strong)"
        >
          Next
        </Button>
      </div>

      {/* Routes Modal */}
      <Dialog
        open={!!selectedMock}
        onOpenChange={(open) => !open && setSelectedMock(null)}
      >
        <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-2 font-mono text-lg">
                Mock:{' '}
                <span className="text-(--lagoon)">{selectedMock?.mockId}</span>
              </DialogTitle>
              <DialogDescription>
                Configured routes and endpoints for this mock server.
              </DialogDescription>
            </div>
            {selectedMock && (
              <Link
                to="/mock/$mockId/dashboard"
                params={{ mockId: selectedMock.mockId }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-(--lagoon) text-white hover:bg-(--lagoon-deep) transition-colors shrink-0 mr-6"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Live Inspector</span>
              </Link>
            )}
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {selectedMock?.routes && selectedMock.routes.length > 0 ? (
              selectedMock.routes.map((route, idx) => {
                const endpointUrl = buildEndpointUrl(
                  selectedMock.mockId,
                  route.pathPattern,
                )
                const curlCmd = buildCurl(
                  route.method,
                  endpointUrl,
                  route.authType,
                  route.expectedToken,
                )
                const isCopied = copiedIndex === idx

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-(--line) bg-black/5 dark:bg-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 font-mono text-sm font-semibold">
                        <MethodBadge method={route.method} />
                        <span>{route.pathPattern}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono opacity-80 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          {route.statusCode}
                        </span>
                        {route.delayMs > 0 && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            {route.delayMs}ms delay
                          </span>
                        )}
                        {(route.expectedToken ||
                          (route.authType && route.authType !== 'NONE')) && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                            <Key className="w-3 h-3" />
                            {route.authType || 'AUTH'}
                          </span>
                        )}
                      </div>
                    </div>

                    {route.expectedToken && (
                      <div className="flex items-center gap-2 text-xs font-mono bg-purple-500/10 text-purple-700 dark:text-purple-300 p-2 rounded-lg border border-purple-500/20">
                        <Key className="w-3.5 h-3.5 shrink-0 text-purple-500" />
                        <span className="font-medium">Auth Token:</span>
                        <code className="bg-purple-500/20 px-1.5 py-0.5 rounded font-bold">
                          {route.expectedToken}
                        </code>
                        {route.authType && (
                          <span className="opacity-70 text-[10px]">
                            ({route.authType})
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between bg-black/80 text-slate-200 dark:bg-black/40 p-2.5 rounded-lg font-mono text-xs overflow-x-auto gap-2">
                      <code className="truncate flex-1">{curlCmd}</code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0 text-slate-400 hover:text-white hover:bg-white/10"
                        onClick={() => copyToClipboard(curlCmd, idx)}
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-center py-6 text-(--sea-ink-soft)">
                No route details available for this mock.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
