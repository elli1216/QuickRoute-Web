import { useState, useEffect } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X, BookOpen, Layers, Home, Plus, Sparkles } from 'lucide-react'
import { ModeToggle } from '#/components/mode-toggle'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const routerState = useRouterState()

  // Auto-close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [routerState.location.pathname])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-3 md:top-4 z-50 px-3 md:px-0">
      <div className="page-wrap island-shell py-2.5 md:py-3 px-4 md:px-6 flex items-center justify-between shadow-lg shadow-black/5 backdrop-blur-xl relative">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <img
            src="/main-logo.svg"
            alt="QuickRoute"
            className="h-8 w-auto md:h-9 group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex">
            <Link
              to="/docs"
              className="nav-link text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Docs
            </Link>
            <Link
              to="/mocks"
              className="nav-link text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Mocks
            </Link>
          </div>
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Quick CTA on desktop */}
          <Link
            to="/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold glow-button shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Mock</span>
          </Link>


          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 transition-transform duration-200 rotate-90 scale-100" />
            ) : (
              <Menu className="w-5 h-5 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-18 z-40 px-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="island-shell p-4 shadow-2xl backdrop-blur-2xl border border-white/20 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 rounded-2xl space-y-3">
            
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                activeProps={{
                  className: 'flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400',
                }}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                activeProps={{
                  className: 'flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400',
                }}
              >
                <BookOpen className="w-4 h-4" />
                <span>Documentation</span>
                <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  Guides
                </span>
              </Link>

              <Link
                to="/mocks"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                activeProps={{
                  className: 'flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400',
                }}
              >
                <Layers className="w-4 h-4" />
                <span>Mocks</span>
              </Link>
            </div>

            {/* Mobile Action Button */}
            <div className="pt-2 border-t border-(--line)">
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm glow-button shadow-md active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Mocking Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  )
}
