import { useState, useMemo } from 'react'
import { Hash, Sparkles, ShieldCheck, Terminal, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { CodeWindow } from '#/components/ui/code-window'
import { ScreenWindow } from '#/components/ui/screen-window'
import { Input } from '#/components/ui/input'
import { fakerCategories } from '#/constants'
import { TUTORIALS } from '#/constants/tutorials'

export function DocsContent() {
  const [fakerSearch, setFakerSearch] = useState('')

  const filteredFakerCategories = useMemo(() => {
    return fakerCategories
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
  }, [fakerSearch])

  return (
    <div className="min-w-0 space-y-16">
      {/* Tutorials */}
      {TUTORIALS.map((tutorial, i) => {
        const sectionId = `tutorial-${i}`
        return (
          <section key={i} id={sectionId} className="scroll-mt-28 space-y-6">
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
                  <div key={index} id={stepId} className="scroll-mt-28">
                    <Card className="card-glass min-w-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
      <section id="faker-variables" className="scroll-mt-28 space-y-6">
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
            Instead of hardcoding static values, use double-bracket template
            tags (e.g.,{' '}
            <code className="text-blue-500 font-bold">{`{{name.fullName}}`}</code>
            ,{' '}
            <code className="text-blue-500 font-bold">{`{{internet.email}}`}</code>
            ) in your JSON response bodies. The server generates fresh,
            realistic data on every incoming API request!
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
                className="card-glass min-w-0 overflow-hidden scroll-mt-28"
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
      <section id="advanced-features" className="scroll-mt-28 space-y-6">
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
            <Card className="card-glass min-w-0 overflow-hidden flex flex-col w-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Authentication Enforcement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between min-w-0">
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{ color: 'var(--sea-ink-soft)' }}
                >
                  Secure your mock endpoints by enforcing an{' '}
                  <code>API_KEY</code> header or a <code>BEARER</code> token.
                  Requests missing the specified token immediately receive a{' '}
                  <code>401 Unauthorized</code> response.
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
            <Card className="card-glass min-w-0 overflow-hidden flex flex-col w-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-500" />
                  <span>Path Variables</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between min-w-0">
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{ color: 'var(--sea-ink-soft)' }}
                >
                  Define dynamic URL parameters like <code>/users/:id</code>.
                  Use <code>:id</code> anywhere inside your response body to
                  echo back whatever was passed in the request path!
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
  )
}
