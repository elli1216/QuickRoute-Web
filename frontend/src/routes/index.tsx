import { createFileRoute, Link } from '@tanstack/react-router'
import { features, steps } from '#/lib/landing'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="page-wrap pt-20 md:pt-32 pb-16 md:pb-24 text-center">
        <div className="rise-in">
          <span className="island-kicker mb-6 inline-block">
            Free &bull; No login &bull; Open source
          </span>
          <img
            src="/main-logo.svg"
            alt="QuickRoute"
            className="h-32 w-64 md:h-48 md:w-96 mx-auto"
          />
          <p
            className="text-lg md:text-2xl mt-6 max-w-2xl mx-auto px-4 font-medium"
            style={{ color: 'var(--sea-ink-soft)' }}
          >
            Instant API mocks in seconds.
            <br />
            No sign-up, no setup, no cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 md:mt-12">
            <Link
              to="/create"
              className="inline-block px-8 py-3.5 rounded-xl font-semibold text-lg glow-button"
            >
              Start Mocking &rarr;
            </Link>
            <Link
              to="/docs"
              className="inline-block px-8 py-3.5 rounded-xl font-semibold text-lg island-shell"
            >
              Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="page-wrap py-16 md:py-24 relative">
        <h2 className="display-title text-3xl md:text-5xl font-bold text-center px-4">
          How it works
        </h2>
        <p
          className="text-center mt-4 px-4 text-lg"
          style={{ color: 'var(--sea-ink-soft)' }}
        >
          Three steps to a working mock API.
        </p>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
          {steps.map((item) => (
            <div
              key={item.step}
              className="feature-card p-8"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-6 shadow-md"
                style={{ background: 'var(--lagoon)', color: '#fff' }}
              >
                {item.step}
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-relaxed" style={{ color: 'var(--sea-ink-soft)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="page-wrap py-16 md:py-24">
        <h2 className="display-title text-3xl md:text-5xl font-bold text-center px-4">
          Everything you need
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="island-shell p-6"
              >
                <div className="mb-4" style={{ color: 'var(--lagoon)' }}>
                  <Icon size={28} />
                </div>
                <h3 className="font-bold text-lg">{feat.title}</h3>
                <p
                  className="text-sm mt-2 leading-relaxed"
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
      <section className="page-wrap py-16 md:py-24">
        <h2 className="display-title text-3xl md:text-5xl font-bold text-center px-4">
          Try it right now
        </h2>
        <p
          className="text-center mt-4 px-4 text-lg"
          style={{ color: 'var(--sea-ink-soft)' }}
        >
          Define a route and call it — you&apos;ll get back exactly what you
          set.
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mt-12 md:mt-16">
          <div className="island-shell p-6 md:p-8 min-w-0">
            <span className="island-kicker">What you define</span>
            <h3 className="text-lg md:text-xl font-bold mt-3">
              A route that returns users
            </h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-md text-xs font-bold shrink-0"
                  style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--lagoon-deep)' }}
                >
                  GET
                </span>
                <code className="text-sm md:text-base font-semibold">/users</code>
                <span
                  className="text-xs ml-auto shrink-0 font-medium"
                  style={{ color: 'var(--sea-ink-soft)' }}
                >
                  200
                </span>
              </div>
              <pre
                className="p-4 rounded-xl text-sm overflow-x-auto shadow-inner"
              >
                <code>{`[
  {"id": 1, "name": "Alice"},
  {"id": 2, "name": "Bob"}
]`}</code>
              </pre>
            </div>
            <div
              className="mt-6 pt-6"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-md text-xs font-bold shrink-0"
                  style={{ background: 'rgba(234,179,8,0.15)', color: '#854d0e' }}
                >
                  POST
                </span>
                <code className="text-sm md:text-base font-semibold">/users</code>
                <span
                  className="text-xs ml-auto shrink-0 font-medium"
                  style={{ color: 'var(--sea-ink-soft)' }}
                >
                  201 / 500ms
                </span>
              </div>
              <pre
                className="mt-4 p-4 rounded-xl text-sm overflow-x-auto shadow-inner"
              >
                <code>{`{"id": 99, "name": "Created"}`}</code>
              </pre>
            </div>
          </div>

          <div className="island-shell p-6 md:p-8 min-w-0">
            <span className="island-kicker">What you get</span>
            <h3 className="text-lg md:text-xl font-bold mt-3">
              Live endpoints you can call
            </h3>
            <pre
              className="mt-5 p-4 md:p-5 rounded-xl text-sm overflow-x-auto shadow-inner"
            >
              <code>{`curl /mock/abc123/users
# → [{"id":1,"name":"Alice"},...]

curl /mock/abc123/users/42
# → {"id":"42","name":"User 42"}

curl -X POST /mock/abc123/users
# → {"id":99,"name":"Created"}`}</code>
            </pre>
            <p
              className="text-sm mt-4 leading-relaxed font-medium"
              style={{ color: 'var(--sea-ink-soft)' }}
            >
              Path variables like <code className="bg-white/40">:id</code> substitute into your response
              body automatically.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/create"
            className="inline-block px-8 py-3.5 rounded-xl font-semibold text-lg glow-button"
          >
            Try the visual builder &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="site-footer py-10 mt-10 text-center text-sm"
        style={{ color: 'var(--sea-ink-soft)' }}
      >
        <p className="font-medium">QuickRoute &mdash; Free and open source API mocking.</p>
      </footer>
    </div>
  )
}
