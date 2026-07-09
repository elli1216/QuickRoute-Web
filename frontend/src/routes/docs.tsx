import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})

function DocsPage() {
  const fakerCategories = [
    {
      category: 'Name',
      items: [
        { variable: '{{name.firstName}}', example: 'Alice' },
        { variable: '{{name.lastName}}', example: 'Smith' },
        { variable: '{{name.fullName}}', example: 'Alice Smith' },
        { variable: '{{name.title}}', example: 'Software Engineer' },
      ],
    },
    {
      category: 'Internet',
      items: [
        { variable: '{{internet.email}}', example: 'alice@example.com' },
        { variable: '{{internet.username}}', example: 'alice_smith99' },
        { variable: '{{internet.password}}', example: 'aBc!23XYZ' },
        { variable: '{{internet.url}}', example: 'https://example.com' },
        { variable: '{{internet.uuid}}', example: '123e4567-e89b-12d3-a456-426614174000' },
      ],
    },
    {
      category: 'Address',
      items: [
        { variable: '{{address.city}}', example: 'San Francisco' },
        { variable: '{{address.streetAddress}}', example: '123 Main St' },
        { variable: '{{address.country}}', example: 'United States' },
        { variable: '{{address.zipCode}}', example: '94105' },
      ],
    },
    {
      category: 'Lorem (Placeholder Text)',
      items: [
        { variable: '{{lorem.word}}', example: 'voluptatem' },
        { variable: '{{lorem.sentence}}', example: 'Lorem ipsum dolor sit amet.' },
        { variable: '{{lorem.paragraph}}', example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
      ],
    },
    {
      category: 'Commerce',
      items: [
        { variable: '{{commerce.productName}}', example: 'Ergonomic Keyboard' },
        { variable: '{{commerce.price}}', example: '99.99' },
        { variable: '{{commerce.department}}', example: 'Electronics' },
      ],
    },
    {
      category: 'Date & Time',
      items: [
        { variable: '{{date.past}}', example: '2023-05-12T14:22:11Z' },
        { variable: '{{date.future}}', example: '2028-11-01T08:00:00Z' },
      ],
    },
    {
      category: 'Company',
      items: [
        { variable: '{{company.name}}', example: 'Acme Corp' },
        { variable: '{{company.industry}}', example: 'Technology' },
      ],
    },
  ]

  return (
    <div className="page-wrap py-12 md:py-16 px-4 md:px-0 max-w-5xl mx-auto space-y-12">
      <div className="text-center rise-in">
        <h1 className="display-title text-3xl md:text-5xl font-bold">
          Documentation
        </h1>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-(--line) pb-2">
          Tutorial: How to Mock Your First API
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-(--lagoon) text-white flex items-center justify-center text-sm">1</span>
                Define Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--sea-ink-soft)' }}>
                Head over to the <strong>Create Mock</strong> page. Select your HTTP method (e.g., <code>GET</code>, <code>POST</code>) and define the path (e.g., <code>/api/users</code>). You can also use path variables like <code>/api/users/:id</code>.
              </p>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-(--lagoon) text-white flex items-center justify-center text-sm">2</span>
                Set Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--sea-ink-soft)' }}>
                Choose a status code and an optional delay (great for testing loading states). Then, use the Visual Field Builder or Raw JSON editor to craft exactly what the API should return.
              </p>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-(--lagoon) text-white flex items-center justify-center text-sm">3</span>
                Call It!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--sea-ink-soft)' }}>
                Hit <strong>Create Mock</strong>. You will receive a unique Mock ID and a base URL. Simply point your frontend application or curl commands to that URL, and you're done!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold border-b border-(--line) pb-2">
            Dynamic Data (Faker Variables)
          </h2>
          <p className="text-sm" style={{ color: 'var(--sea-ink-soft)' }}>
            Instead of hardcoding static strings, you can use these double-bracket variables in your JSON response bodies. The server will automatically generate random, realistic data every time the endpoint is called!
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
                    <div key={j} className="flex justify-between items-center text-sm border-b border-(--line) pb-2 last:border-0 last:pb-0">
                      <code className="bg-(--surface-strong) px-2 py-1 rounded font-semibold text-(--lagoon)">{item.variable}</code>
                      <span className="text-xs" style={{ color: 'var(--sea-ink-soft)' }}>e.g., {item.example}</span>
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
              <CardTitle className="text-lg">Authentication Enforcement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--sea-ink-soft)' }}>
                You can secure your mock endpoints by requiring an API Key or a Bearer Token.
              </p>
              <pre className="p-3 rounded-lg text-xs bg-[#1d2e45] text-[#e8efff] overflow-x-auto">
                <code>{`curl -H "Authorization: Bearer secret123" \\
  https://.../mock/abc/users`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-lg">Path Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--sea-ink-soft)' }}>
                Define a route like <code>/users/:id</code>, and include <code>:id</code> in your response body. The server will dynamically replace it with whatever was in the URL.
              </p>
              <pre className="p-3 rounded-lg text-xs bg-[#1d2e45] text-[#e8efff] overflow-x-auto">
                <code>{`// GET /users/99
{
  "id": "99",
  "name": "{{name.firstName}}"
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
