import { useState, useMemo } from 'react'
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Search,
  Layers,
  Compass,
} from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '#/components/ui/drawer'
import { Input } from '#/components/ui/input'

export interface NavSection {
  id: string
  title: string
  icon: typeof BookOpen
  children?: { id: string; title: string }[]
}

export const DOC_SECTIONS: NavSection[] = [
  {
    id: 'tutorial-0',
    title: 'How to Mock Your First API',
    icon: BookOpen,
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

export function DocsSidebar({
  activeSection,
  scrollTo,
}: {
  activeSection: string
  scrollTo: (id: string) => void
}) {
  return (
    <aside className="hidden lg:block sticky top-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto pr-2 space-y-4">
      <div className="island-shell p-4 rounded-2xl space-y-4 backdrop-blur-xl border border-white/20 dark:border-slate-800/70">
        <div className="flex items-center justify-between pb-3 border-b border-(--line)">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-(--sea-ink-soft)">
              On This Page
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
            {DOC_SECTIONS.length} Topics
          </span>
        </div>

        <nav className="space-y-3.5 text-xs font-medium">
          {DOC_SECTIONS.map((section) => {
            const Icon = section.icon
            const isSectionActive =
              activeSection === section.id ||
              section.children?.some((c) => c.id === activeSection)

            return (
              <div key={section.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => scrollTo(section.id)}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
                    isSectionActive
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                      : 'text-(--sea-ink-soft) hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    <span className="truncate">{section.title}</span>
                  </div>
                </button>

                {/* Nested Sub-links */}
                {section.children && (
                  <div className="pl-5 space-y-0.5 border-l-2 border-(--line) ml-3 my-1">
                    {section.children.map((child) => {
                      const isChildActive = activeSection === child.id
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => scrollTo(child.id)}
                          className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors cursor-pointer truncate ${
                            isChildActive
                              ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10'
                              : 'text-(--sea-ink-soft) hover:text-foreground'
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
      </div>
    </aside>
  )
}

export function DocsMobileNavigation({
  activeSection,
  scrollTo,
}: {
  activeSection: string
  scrollTo: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [tocSearch, setTocSearch] = useState('')

  const handleScroll = (id: string) => {
    scrollTo(id)
    setOpen(false)
  }

  // Filter TOC sections for mobile drawer search
  const filteredDocSections = useMemo(() => {
    if (!tocSearch.trim()) return DOC_SECTIONS
    const query = tocSearch.toLowerCase()
    return DOC_SECTIONS.map((sec) => ({
      ...sec,
      children: sec.children?.filter((c) =>
        c.title.toLowerCase().includes(query),
      ),
    })).filter(
      (sec) =>
        sec.title.toLowerCase().includes(query) ||
        (sec.children && sec.children.length > 0),
    )
  }, [tocSearch])

  // Current active navigation info for mobile breadcrumb
  const currentNav =
    DOC_SECTIONS.find((s) => s.id === activeSection) ||
    DOC_SECTIONS.flatMap((s) => s.children || []).find(
      (c) => c.id === activeSection,
    ) ||
    DOC_SECTIONS[0]

  return (
    <div className="lg:hidden sticky top-16 md:top-20 z-30 mb-6">
      <div className="island-shell p-2.5 shadow-lg shadow-black/5 backdrop-blur-2xl border border-white/30 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 pl-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-pulse" />
          <span className="text-xs text-(--sea-ink-soft) font-medium shrink-0">
            Section:
          </span>
          <span className="text-xs font-bold truncate text-foreground">
            {currentNav.title}
          </span>
        </div>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-blue-500 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
              aria-label="Open Table of Contents"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table of Contents</span>
              <span className="sm:hidden">Menu</span>
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh] mx-auto max-w-[420px] fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[20px] border border-white/30 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-2xl">
            <DrawerHeader className="text-left pb-3 border-b border-(--line) px-5 pt-5">
              <DrawerTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Compass className="w-4 h-4" />
                </div>
                Table of Contents
              </DrawerTitle>
              <DrawerDescription className="text-[11px] text-(--sea-ink-soft) mt-1 pl-10">
                Jump to any section or tutorial
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-5 overflow-y-auto max-h-full">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-(--sea-ink-soft)" />
                <Input
                  placeholder="Filter topics & steps..."
                  value={tocSearch}
                  onChange={(e) => setTocSearch(e.target.value)}
                  className="pl-8 text-xs h-9 bg-black/5 dark:bg-white/5 border-(--line) rounded-xl"
                />
              </div>

              <nav className="space-y-4 text-xs font-medium pb-8">
                {filteredDocSections.length === 0 ? (
                  <div className="text-center py-6 text-(--sea-ink-soft) bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-(--line)">
                    No matches found for "{tocSearch}"
                  </div>
                ) : (
                  filteredDocSections.map((section) => {
                    const Icon = section.icon
                    const isSectionActive =
                      activeSection === section.id ||
                      section.children?.some((c) => c.id === activeSection)

                    return (
                      <div key={section.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => handleScroll(section.id)}
                          className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                            isSectionActive
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                              : 'text-(--sea-ink-soft) hover:text-foreground bg-black/5 dark:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className="w-4 h-4 shrink-0 opacity-80" />
                            <span className="truncate">{section.title}</span>
                          </div>
                        </button>

                        {/* Nested Links */}
                        {section.children && (
                          <div className="pl-6 space-y-1 ml-4 border-l-2 border-(--line) py-1.5">
                            {section.children.map((child) => {
                              const isChildActive = activeSection === child.id
                              return (
                                <button
                                  key={child.id}
                                  type="button"
                                  onClick={() => handleScroll(child.id)}
                                  className={`w-full text-left py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer truncate ${
                                    isChildActive
                                      ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10'
                                      : 'text-(--sea-ink-soft) hover:text-foreground'
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
                  })
                )}
              </nav>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
