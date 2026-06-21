import { createFileRoute, Link } from '@tanstack/react-router'
import { features, steps } from '#/lib/landing'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="page-wrap pt-16 md:pt-24 pb-12 md:pb-16 text-center">
        <div className="rise-in">
          <span className="island-kicker">
            Free &bull; No login &bull; Open source
          </span>
          <img
            src="/main-logo.svg"
            alt="QuickRoute"
            className="h-30 w-60 md:h-60 md:w-120 mx-auto mt-6"
          />
          <p
            className="text-lg md:text-2xl mt-4 max-w-2xl mx-auto px-4"
            style={{ color: 'var(--sea-ink-soft)' }}
          >
            Instant API mocks in seconds.
            <br />
            No sign-up, no setup, no cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 md:mt-10">
            <Link
              to="/create"
              className="inline-block px-8 py-3 rounded-xl font-semibold text-lg"
              style={{
                background: 'var(--lagoon)',
                color: '#fff',
              }}
            >
              Start Mocking &rarr;
            </Link>
            <a
              href="#how-it-works"
              className="inline-block px-8 py-3 rounded-xl font-semibold text-lg island-shell"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="page-wrap py-12 md:py-20">
        <h2 className="display-title text-2xl md:text-4xl font-bold text-center px-4">
          How it works
        </h2>
        <p
          className="text-center mt-3 px-4"
          style={{ color: 'var(--sea-ink-soft)' }}
        >
          Three steps to a working mock API.
        </p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
          {steps.map((item) => (
            <div
              key={item.step}
              className="feature-card rounded-2xl p-8 border"
              style={{ borderColor: 'var(--line)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-4"
                style={{ background: 'var(--lagoon)', color: '#fff' }}
              >
                {item.step}
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2" style={{ color: 'var(--sea-ink-soft)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="page-wrap py-12 md:py-20">
        <h2 className="display-title text-2xl md:text-4xl font-bold text-center px-4">
          Everything you need, nothing you don&apos;t
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-12">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="island-shell rounded-xl p-5 border"
                style={{ borderColor: 'var(--line)' }}
              >
                <div className="mb-2" style={{ color: 'var(--lagoon-deep)' }}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold">{feat.title}</h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: 'var(--sea-ink-soft)' }}
                >
                  {feat.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Tutorial */}
      <section className="page-wrap py-12 md:py-20">
        <h2 className="display-title text-2xl md:text-4xl font-bold text-center px-4">
          Try it right now
        </h2>
        <p
          className="text-center mt-3 px-4"
          style={{ color: 'var(--sea-ink-soft)' }}
        >
          Define a route and call it — you&apos;ll get back exactly what you
          set.
        </p>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
          <div
            className="island-shell rounded-2xl p-4 md:p-6 border min-w-0"
            style={{ borderColor: 'var(--line)' }}
          >
            <span className="island-kicker">What you define</span>
            <h3 className="text-base md:text-lg font-bold mt-1">
              A route that returns users
            </h3>
            <div className="mt-3 md:mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold shrink-0"
                  style={{ background: '#dbeafe', color: '#1e40af' }}
                >
                  GET
                </span>
                <code className="text-xs md:text-sm">/users</code>
                <span
                  className="text-xs ml-auto shrink-0"
                  style={{ color: 'var(--sea-ink-soft)' }}
                >
                  200
                </span>
              </div>
              <pre
                className="p-3 rounded-xl text-xs overflow-x-auto max-w-full"
                style={{ background: '#1d2e45', color: '#e8efff' }}
              >
                <code>{`[
  {"id": 1, "name": "Alice"},
  {"id": 2, "name": "Bob"}
]`}</code>
              </pre>
            </div>
            <div
              className="mt-4 pt-4"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold shrink-0"
                  style={{ background: '#fef3c7', color: '#92400e' }}
                >
                  POST
                </span>
                <code className="text-xs md:text-sm">/users</code>
                <span
                  className="text-xs ml-auto shrink-0"
                  style={{ color: 'var(--sea-ink-soft)' }}
                >
                  201 / 500ms
                </span>
              </div>
              <pre
                className="mt-2 p-3 rounded-xl text-xs overflow-x-auto max-w-full"
                style={{ background: '#1d2e45', color: '#e8efff' }}
              >
                <code>{`{"id": 99, "name": "Created"}`}</code>
              </pre>
            </div>
          </div>

          <div
            className="island-shell rounded-2xl p-4 md:p-6 border min-w-0"
            style={{ borderColor: 'var(--line)' }}
          >
            <span className="island-kicker">What you get</span>
            <h3 className="text-base md:text-lg font-bold mt-1">
              Live endpoints you can call
            </h3>
            <pre
              className="mt-3 md:mt-4 p-3 md:p-4 rounded-xl text-xs md:text-sm overflow-x-auto max-w-full"
              style={{ background: '#1d2e45', color: '#e8efff' }}
            >
              <code>{`curl /mock/abc123/users
# → [{"id":1,"name":"Alice"},...]

curl /mock/abc123/users/42
# → {"id":"42","name":"User 42"}

curl -X POST /mock/abc123/users
# → {"id":99,"name":"Created"}`}</code>
            </pre>
            <p
              className="text-xs md:text-sm mt-2 md:mt-3"
              style={{ color: 'var(--sea-ink-soft)' }}
            >
              Path variables like <code>:id</code> substitute into your response
              body automatically.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/create"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-lg"
            style={{
              background: 'var(--lagoon)',
              color: '#fff',
            }}
          >
            Try the visual builder &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="site-footer py-8 text-center text-sm"
        style={{ color: 'var(--sea-ink-soft)' }}
      >
        QuickRoute &mdash; Free and open source API mocking.
      </footer>
    </div>
  )
}
