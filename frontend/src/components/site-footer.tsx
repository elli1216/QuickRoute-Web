import { Link } from '@tanstack/react-router'
import {
  ExternalLink,
  ArrowUpRight,
  Heart,
} from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-(--line) bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl relative z-10">
      <div className="page-wrap py-12 px-8 md:px-2 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          
          {/* Brand Col (2 cols on large) */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src="/main-logo.svg"
                alt="QuickRoute"
                className="h-20 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft)">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link
                  to="/"
                  className="text-(--sea-ink-soft) hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-(--sea-ink-soft) hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  Create Mock
                </Link>
              </li>
              <li>
                <Link
                  to="/mocks"
                  className="text-(--sea-ink-soft) hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  Mocks
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-(--sea-ink-soft) hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Docs & Features */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft)">
              Features
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link
                  to="/docs"
                  hash="faker-variables"
                  className="text-(--sea-ink-soft) hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  Faker Variables
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  hash="auth-enforcement"
                  className="text-(--sea-ink-soft) hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  Auth Enforcement
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  hash="path-variables"
                  className="text-(--sea-ink-soft) hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  Path Variables
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Attribution Card */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft)">
              Developer
            </h4>
            <a
              href="https://eli-floresca.is-pinoy.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-2xl border border-(--line) bg-white/60 dark:bg-slate-900/60 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Portfolio
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-(--sea-ink-soft) group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-bold text-sm text-foreground group-hover:text-blue-500 transition-colors">
                Eli Floresca
              </p>
              <p
                className="text-xs mt-1 font-medium leading-relaxed"
                style={{ color: 'var(--sea-ink-soft)' }}
              >
                eli-floresca.is-pinoy.dev
              </p>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
