import { ReactNode } from 'react'

interface ScreenWindowProps {
  title?: string
  children: ReactNode
  className?: string
}

export function ScreenWindow({ title = "quickroute.dev", children, className = '' }: ScreenWindowProps) {
  return (
    <div 
      className={`rounded-xl overflow-hidden shadow-2xl border flex flex-col ${className}`}
      style={{ 
        background: 'var(--surface-strong)', 
        borderColor: 'color-mix(in srgb, var(--line) 50%, transparent)' 
      }}
    >
      {/* Browser Chrome / Header */}
      <div 
        className="flex items-center px-4 py-3 border-b relative"
        style={{ 
          background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
          borderColor: 'color-mix(in srgb, var(--line) 50%, transparent)'
        }}
      >
        <div className="flex gap-1.5 shrink-0 opacity-80 hover:opacity-100 transition-opacity absolute left-4">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/20"></div>
        </div>
        
        {/* URL Bar */}
        <div className="flex-1 flex justify-center">
          <div 
            className="px-6 py-1 rounded-md text-xs font-medium max-w-xs w-full text-center truncate shadow-inner flex items-center justify-center gap-2"
            style={{ 
              background: 'color-mix(in srgb, var(--bg-base) 80%, transparent)',
              color: 'var(--sea-ink-soft)',
              border: '1px solid color-mix(in srgb, var(--line) 20%, transparent)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {title}
          </div>
        </div>
      </div>
      
      {/* Content Area (Image placeholder or image) */}
      <div className="flex-1 relative flex items-center justify-center min-h-32 bg-(--bg-base)">
        {children}
      </div>
    </div>
  )
}
