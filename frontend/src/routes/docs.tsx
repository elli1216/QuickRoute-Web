import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { CodeWindow } from '#/components/ui/code-window'
import { ScreenWindow } from '#/components/ui/screen-window'
import { fakerCategories } from '#/constants'
import { TUTORIALS } from '#/constants/tutorials'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})

function DocsPage() {
  return (
    <div className="page-wrap py-12 md:py-16 px-4 md:px-0 max-w-5xl mx-auto space-y-12">
      <div className="text-center rise-in">
        <h1 className="display-title text-3xl md:text-5xl font-bold">
          Documentation
        </h1>
      </div>

      {TUTORIALS.map((tutorial, i) => (
        <section key={i} className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-(--line) pb-2">
            {tutorial.title}
          </h2>
          <div className="space-y-10">
            {tutorial.steps.map((step, index) => (
              <Card key={index} className="card-glass">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-(--lagoon) text-white flex items-center justify-center text-base shadow-lg shadow-blue-500/20">
                      {index + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: 'var(--sea-ink-soft)' }}
                  >
                    {step.description}
                  </p>
                  <ScreenWindow title="quickroute.dev/create">
                    <img
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      className="w-full h-auto object-cover"
                    />
                  </ScreenWindow>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold border-b border-(--line) pb-2">
            Dynamic Data (Faker Variables)
          </h2>
          <p className="text-sm" style={{ color: 'var(--sea-ink-soft)' }}>
            Instead of hardcoding static strings, you can use these
            double-bracket variables in your JSON response bodies. The server
            will automatically generate random, realistic data every time the
            endpoint is called!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {fakerCategories.map((cat, i) => (
            <Card key={i} className="card-glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{cat.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cat.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex justify-between items-center text-sm border-b border-(--line) pb-2 last:border-0 last:pb-0"
                    >
                      <code className="bg-(--surface-strong) px-2 py-1 rounded font-semibold text-(--lagoon)">
                        {item.variable}
                      </code>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--sea-ink-soft)' }}
                      >
                        e.g., {item.example}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-(--line) pb-2">
          Advanced Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-lg">
                Authentication Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: 'var(--sea-ink-soft)' }}
              >
                You can secure your mock endpoints by requiring an API Key or a
                Bearer Token.
              </p>
              <CodeWindow title="Terminal">
                <pre>
                  <code>{`curl -H "Authorization: Bearer secret123" \\
  https://.../mock/abc/users`}</code>
                </pre>
              </CodeWindow>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-lg">Path Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: 'var(--sea-ink-soft)' }}
              >
                Define a route like <code>/users/:id</code>, and include{' '}
                <code>:id</code> in your response body. The server will
                dynamically replace it with whatever was in the URL.
              </p>
              <CodeWindow title="JSON Response">
                <pre>
                  <code>{`// GET /users/99
{
  "id": "99",
  "name": "{{name.firstName}}"
}`}</code>
                </pre>
              </CodeWindow>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
