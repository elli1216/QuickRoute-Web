import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  ArrowUp,
  Hash,
  Search,
  Layers,
  Terminal,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { CodeWindow } from '#/components/ui/code-window'
import { ScreenWindow } from '#/components/ui/screen-window'
import { Input } from '#/components/ui/input'
import { fakerCategories } from '#/constants'
import { TUTORIALS } from '#/constants/tutorials'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})

interface NavSection {
  id: string
  title: string
  icon: typeof BookOpen
  badge?: string
  children?: { id: string; title: string }[]
}

const DOC_SECTIONS: NavSection[] = [
  {
    id: 'tutorial-0',
    title: 'How to Mock Your First API',
    icon: BookOpen,
    badge: '3 Steps',
    children: [
      { id: 'tutorial-0-step-1', title: '1. Define Route' },
      { id: 'tutorial-0-step-2', title: '2. Set Response' },
      { id: 'tutorial-0-step-3', title: '3. Call It!' },
    ],
  },
  {
    id: 'tutorial-1',
    title: 'Building Arrays of Objects',
    icon: Layers,
    badge: '5 Steps',
    children: [
      { id: 'tutorial-1-step-1', title: '1. Add Array Field' },
      { id: 'tutorial-1-step-2', title: '2. Add Object Field' },
      { id: 'tutorial-1-step-3', title: '3. Add Fields Inside' },
      { id: 'tutorial-1-step-4', title: '4. Generate Multiple' },
      { id: 'tutorial-1-step-5', title: '5. Preview JSON' },
    ],
  },
  {
    id: 'faker-variables',
    title: 'Dynamic Data (Faker)',
    icon: Sparkles,
    badge: 'Template Tags',
    children: [
      { id: 'faker-Name', title: 'Name Variables' },
      { id: 'faker-Internet', title: 'Internet & UUID' },
      { id: 'faker-Address', title: 'Address' },
      { id: 'faker-Lorem', title: 'Lorem Placeholder' },
      { id: 'faker-Commerce', title: 'Commerce' },
      { id: 'faker-DateTime', title: 'Date & Time' },
      { id: 'faker-Company', title: 'Company' },
    ],
  },
  {
    id: 'advanced-features',
    title: 'Advanced Features',
    icon: ShieldCheck,
    children: [
      { id: 'auth-enforcement', title: 'Authentication Enforcement' },
      { id: 'path-variables', title: 'Dynamic Path Variables' },
    ],
  },
]

function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>('tutorial-0')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [fakerSearch, setFakerSearch] = useState('')

  // Scroll spy to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      const sectionElements = DOC_SECTIONS.flatMap((s) => [
        s.id,
        ...(s.children?.map((c) => c.id) || []),
      ])

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionElements[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 160) {
            setActiveSection(sectionElements[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMobileDrawerOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
      history.replaceState(null, '', `#${id}`)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Filter faker categories based on search
  const filteredFakerCategories = fakerCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.variable.toLowerCase().includes(fakerSearch.toLowerCase()) ||
          item.example.toLowerCase().includes(fakerSearch.toLowerCase()) ||
          cat.category.toLowerCase().includes(fakerSearch.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0)

  // Find active section title for mobile bar
  const currentNav =
    DOC_SECTIONS.find((s) => s.id === activeSection) ||
    DOC_SECTIONS.flatMap((s) => s.children || []).find((c) => c.id === activeSection) ||
    DOC_SECTIONS[0]

  return (
    <div className="page-wrap py-8 md:py-12">
      {/* Header Banner */}
      <div className="text-center mb-10 md:mb-12 rise-in">
        <h1 className="display-title text-3xl md:text-5xl font-bold">
          Documentation
        </h1>
      </div>

      {/* Mobile Sticky Section Navigation Bar */}
      <div className="lg:hidden sticky top-18 z-30 mb-8 -mx-2 px-2">
        <div className="island-shell px-4 py-3 flex items-center justify-between shadow-lg shadow-black/5 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 rounded-2xl">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="text-xs font-semibold text-(--sea-ink-soft) shrink-0">
              Section:
            </span>
            <span className="text-xs font-bold truncate text-foreground">
              {currentNav.title}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Table of Contents</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">
        
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-6">
          <div className="island-shell p-4 rounded-2xl space-y-5 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-(--line)">
              <span className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft)">
                On this page
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                Docs Menu
              </span>
            </div>

            <nav className="space-y-4 text-xs font-medium">
              {DOC_SECTIONS.map((section) => {
                const Icon = section.icon
                const isSectionActive =
                  activeSection === section.id ||
                  section.children?.some((c) => c.id === activeSection)

                return (
                  <div key={section.id} className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => scrollTo(section.id)}
                      className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
                        isSectionActive
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-(--sea-ink-soft) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{section.title}</span>
                      </div>
                      {section.badge && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 shrink-0 ml-1">
                          {section.badge}
                        </span>
                      )}
                    </button>

                    {/* Nested Sub-links */}
                    {section.children && (
                      <div className="pl-6 space-y-1 border-l-2 border-(--line) ml-3 my-1">
                        {section.children.map((child) => {
                          const isChildActive = activeSection === child.id
                          return (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => scrollTo(child.id)}
                              className={`w-full text-left py-1 px-2 rounded-lg text-[11px] transition-colors cursor-pointer truncate ${
                                isChildActive
                                  ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5'
                                  : 'text-(--sea-ink-soft) hover:text-foreground)'
                              }`}
                            >
                              {child.title}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className="pt-3 border-t border-(--line)">
              <button
                type="button"
                onClick={scrollToTop}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-(--sea-ink-soft) hover:text-foreground) hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Scroll to top</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Documentation Content Column */}
        <div className="min-w-0 space-y-16">
          
          {/* Tutorials from constant */}
          {TUTORIALS.map((tutorial, i) => {
            const sectionId = `tutorial-${i}`
            return (
              <section
                key={i}
                id={sectionId}
                className="scroll-mt-28 space-y-8"
              >
                <div className="space-y-2 border-b border-(--line) pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    <a
                      href={`#${sectionId}`}
                      className="group flex items-center gap-2 text-inherit no-underline"
                    >
                      <span>{tutorial.title}</span>
                      <Hash className="w-5 h-5 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </a>
                  </h2>
                </div>

                <div className="space-y-8">
                  {tutorial.steps.map((step, index) => {
                    const stepId = `${sectionId}-step-${index + 1}`
                    return (
                      <div
                        key={index}
                        id={stepId}
                        className="scroll-mt-28"
                      >
                        <Card className="card-glass shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="text-lg md:text-xl flex items-center gap-3">
                              <span className="w-8 h-8 rounded-xl bg-(--lagoon) text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/20 shrink-0">
                                {index + 1}
                              </span>
                              <span>{step.title}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <p
                              className="text-sm md:text-base leading-relaxed font-medium"
                              style={{ color: 'var(--sea-ink-soft)' }}
                            >
                              {step.description}
                            </p>
                            <ScreenWindow title="quickroute.app/create">
                              <img
                                src={step.imageSrc}
                                alt={step.imageAlt}
                                className="w-full h-auto object-cover rounded-b-xl"
                                loading="lazy"
                              />
                            </ScreenWindow>
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}

          {/* Dynamic Data (Faker Variables) */}
          <section
            id="faker-variables"
            className="scroll-mt-28 space-y-8"
          >
            <div className="space-y-3 border-b border-(--line) pb-4">
              <div className="flex items-center gap-2">
                <span className="island-kicker text-xs bg-pink-500/10 text-pink-500">
                  Dynamic Mocking
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <a
                  href="#faker-variables"
                  className="group flex items-center gap-2 text-inherit no-underline"
                >
                  <Sparkles className="w-6 h-6 text-pink-500" />
                  <span>Dynamic Data (Faker Variables)</span>
                  <Hash className="w-5 h-5 opacity-0 group-hover:opacity-40 transition-opacity" />
                </a>
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed font-medium"
                style={{ color: 'var(--sea-ink-soft)' }}
              >
                Instead of hardcoding static values, use double-bracket template tags (e.g.,{' '}
                <code className="text-blue-500 font-bold">{`{{name.fullName}}`}</code>,{' '}
                <code className="text-blue-500 font-bold">{`{{internet.email}}`}</code>) in your JSON response bodies. The server generates fresh, realistic data on every incoming API request!
              </p>

              {/* Quick Search for Faker tags */}
              <div className="relative pt-2 max-w-md">
                <Search className="absolute left-3 top-5 w-4 h-4 text-(--sea-ink-soft)" />
                <Input
                  placeholder="Search faker variables (e.g., email, uuid, city)..."
                  value={fakerSearch}
                  onChange={(e) => setFakerSearch(e.target.value)}
                  className="pl-9 bg-white/60 dark:bg-slate-900/60 rounded-xl"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {filteredFakerCategories.map((cat, i) => {
                const catSlug = cat.category.replace(/[^a-zA-Z0-9]/g, '')
                return (
                  <Card
                    key={i}
                    id={`faker-${catSlug}`}
                    className="card-glass scroll-mt-28"
                  >
                    <CardHeader className="pb-3 border-b border-(--line)">
                      <CardTitle className="text-base font-bold flex items-center justify-between">
                        <span>{cat.category}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                          {cat.items.length} items
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {cat.items.map((item, j) => (
                          <div
                            key={j}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm border-b border-(--line) pb-2.5 last:border-0 last:pb-0"
                          >
                            <code className="bg-(--surface-strong) px-2 py-1 rounded-md font-semibold text-(--lagoon) text-xs w-fit">
                              {item.variable}
                            </code>
                            <span
                              className="text-xs font-medium truncate"
                              style={{ color: 'var(--sea-ink-soft)' }}
                            >
                              e.g., {item.example}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* Advanced Features */}
          <section
            id="advanced-features"
            className="scroll-mt-28 space-y-8"
          >
            <div className="space-y-2 border-b border-(--line) pb-4">
              <div className="flex items-center gap-2">
                <span className="island-kicker text-xs bg-emerald-500/10 text-emerald-500">
                  Security & Routing
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <a
                  href="#advanced-features"
                  className="group flex items-center gap-2 text-inherit no-underline"
                >
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  <span>Advanced Features</span>
                  <Hash className="w-5 h-5 opacity-0 group-hover:opacity-40 transition-opacity" />
                </a>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Authentication Enforcement */}
              <div id="auth-enforcement" className="scroll-mt-28 flex">
                <Card className="card-glass flex flex-col w-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <span>Authentication Enforcement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <p
                      className="text-sm leading-relaxed font-medium"
                      style={{ color: 'var(--sea-ink-soft)' }}
                    >
                      Secure your mock endpoints by enforcing an <code>API_KEY</code> header or a <code>BEARER</code> token. Requests missing the specified token immediately receive a <code>401 Unauthorized</code> response.
                    </p>
                    <CodeWindow title="Terminal / curl">
                      <pre>
                        <code>{`curl -H "Authorization: Bearer secret123" \\
  https://quickroute-api.onrender.com/mock/abc/users`}</code>
                      </pre>
                    </CodeWindow>
                  </CardContent>
                </Card>
              </div>

              {/* Dynamic Path Variables */}
              <div id="path-variables" className="scroll-mt-28 flex">
                <Card className="card-glass flex flex-col w-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-blue-500" />
                      <span>Path Variables</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <p
                      className="text-sm leading-relaxed font-medium"
                      style={{ color: 'var(--sea-ink-soft)' }}
                    >
                      Define dynamic URL parameters like <code>/users/:id</code>. Use <code>:id</code> anywhere inside your response body to echo back whatever was passed in the request path!
                    </p>
                    <CodeWindow title="JSON Response Template">
                      <pre>
                        <code>{`// GET /users/42
{
  "id": "42",
  "name": "{{name.firstName}}",
  "status": "active"
}`}</code>
                      </pre>
                    </CodeWindow>
                  </CardContent>
                </Card>
              </div>

            </div>
          </section>

        </div>
      </div>

      {/* Mobile Drawer Table of Contents */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-x-4 bottom-4 top-20 max-h-[85vh] bg-white/95 dark:bg-slate-950/95 border border-white/20 dark:border-slate-800/80 rounded-3xl p-5 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-(--line)">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-sm">Table of Contents</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {DOC_SECTIONS.map((section) => (
                <div key={section.id} className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => scrollTo(section.id)}
                    className="w-full flex items-center justify-between text-left p-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-bold text-xs"
                  >
                    <span>{section.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  {section.children && (
                    <div className="pl-4 space-y-1">
                      {section.children.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => scrollTo(child.id)}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-(--sea-ink-soft) hover:text-foreground)"
                        >
                          {child.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full glow-button shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  )
}
