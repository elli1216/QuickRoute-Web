import type { ReactNode } from 'react'

interface CodeWindowProps {
  title?: ReactNode
  children: ReactNode
  className?: string
}

export function CodeWindow({ title, children, className = '' }: CodeWindowProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-xl border flex flex-col ${className}`}
      style={{
        background: 'var(--sea-ink)',
        borderColor: 'color-mix(in srgb, var(--sea-ink-soft) 30%, transparent)'
      }}
    >
      <div
        className="flex items-center px-4 py-2.5 border-b"
        style={{
          background: 'color-mix(in srgb, var(--sea-ink-soft) 40%, var(--sea-ink))',
          borderColor: 'color-mix(in srgb, var(--sea-ink-soft) 30%, transparent)'
        }}
      >
        <div className="flex gap-1.5 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/20"></div>
        </div>
        {title && (
          <div className="ml-4 flex items-center gap-2 text-xs font-mono font-medium opacity-90" style={{ color: 'var(--foam)' }}>
            {title}
          </div>
        )}
      </div>
      <div
        className="p-4 text-sm overflow-x-auto font-mono flex-1 leading-relaxed"
        style={{ color: 'var(--foam)' }}
      >
        {children}
      </div>
    </div>
  )
}
