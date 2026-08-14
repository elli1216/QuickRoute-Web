import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  DocsSidebar,
  DocsMobileNavigation,
  DOC_SECTIONS,
} from '#/components/docs-navigation'
import { DocsContent } from '#/components/docs-content'

export const Route = createFileRoute('/docs')({
  head: () => ({
    meta: [
      {
        title: 'API Mocking Documentation & Tutorials | QuickRoute Docs',
      },
      {
        name: 'description',
        content:
          'Learn how to mock REST APIs, generate dynamic JSON with Faker variables, configure authentication, and use path variables in QuickRoute. Read the full guide ✓',
      },
      {
        property: 'og:title',
        content: 'API Mocking Documentation & Tutorials | QuickRoute Docs',
      },
      {
        property: 'og:description',
        content:
          'Learn how to mock REST APIs, generate dynamic JSON with Faker variables, configure authentication, and use path variables in QuickRoute.',
      },
    ],
  }),
  component: DocsPage,
})

function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>('tutorial-0')
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Scroll spy to highlight active section in real-time
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350)

      const sectionElements = DOC_SECTIONS.flatMap((s) => [
        s.id,
        ...(s.children?.map((c) => c.id) || []),
      ])

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionElements[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 180) {
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
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -90 // Offset for fixed/sticky headers
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveSection(id)
      history.replaceState(null, '', `#${id}`)
    }
  }

  return (
    <div className="page-wrap overflow-x-hidden py-6 md:py-12">
      {/* Header Banner */}
      <div className="text-center mb-8 md:mb-12 rise-in">
        <h1 className="display-title text-3xl md:text-5xl font-bold">
          Documentation
        </h1>
      </div>

      <DocsMobileNavigation activeSection={activeSection} scrollTo={scrollTo} />

      {/* Main Grid: Sticky Desktop Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] xl:grid-cols-[290px_1fr] gap-8 lg:gap-12 items-start">
        <DocsSidebar activeSection={activeSection} scrollTo={scrollTo} />
        <DocsContent />
      </div>
    </div>
  )
}
