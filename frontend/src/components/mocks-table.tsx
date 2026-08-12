import { useState } from 'react'
import type {
  ColumnDef,
  SortingState} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
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
import type { MockSummary } from '#/lib/api'
import { Trash2 } from 'lucide-react'

interface MocksTableProps {
  data: MockSummary[]
  onDelete: (id: string) => void
  deletingId: string | null
}

export function MocksTable({ data, onDelete, deletingId }: MocksTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<MockSummary>[] = [
    {
      accessorKey: 'mockId',
      header: 'Mock ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue('mockId')}
        </span>
      ),
    },
    {
      accessorKey: 'routeCount',
      header: 'Routes',
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
      cell: ({ row }) => {
        const mock = row.original
        const isDeleting = deletingId === mock.mockId
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(mock.mockId)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border-transparent shadow-none"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
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
          placeholder="Search mocks..."
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
            {table.getRowModel().rows?.length ? (
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
                  No results.
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
    </div>
  )
}
