import { createFileRoute, Link } from '@tanstack/react-router'
import { features, steps } from '#/lib/landing'
import { CodeWindow } from '#/components/ui/code-window'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="page-wrap pt-20 md:pt-32 pb-16 md:pb-24 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-125 bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="rise-in relative z-10">
          <span className="island-kicker mb-6 inline-block font-medium tracking-wide shadow-sm">
            Free &bull; No login &bull; Open source
          </span>
          <img
            src="/main-logo.svg"
            alt="QuickRoute"
            className="h-32 w-64 md:h-48 md:w-96 mx-auto drop-shadow-xl"
          />
          <p
            className="text-lg md:text-2xl mt-6 max-w-2xl mx-auto px-4 font-medium"
            style={{ color: 'var(--sea-ink-soft)' }}
          >
            Instant API mocks in seconds.
            <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 font-bold">
              No sign-up, no setup, no cost.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 md:mt-12">
            <Link
              to="/create"
              className="group inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-lg glow-button transition-transform active:scale-95"
            >
              Start Mocking
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-lg island-shell transition-all hover:bg-white/60 dark:hover:bg-slate-800/60 active:scale-95"
            >
              Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="page-wrap py-16 md:py-24 relative z-10">
        <div className="text-center">
          <h2 className="display-title text-3xl md:text-5xl font-bold px-4">
            How it works
          </h2>
          <p
            className="mt-4 px-4 text-lg font-medium"
            style={{ color: 'var(--sea-ink-soft)' }}
          >
            Three steps to a working mock API.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 relative">
          <div className="absolute top-24 left-10 right-10 h-0.5 bg-linear-to-r from-transparent via-blue-500/20 to-transparent hidden md:block -z-10" />
          {steps.map((item) => (
            <div
              key={item.step}
              className="feature-card p-8 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 cursor-default bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'var(--lagoon)', color: '#fff' }}
              >
                {item.step}
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-sm font-medium" style={{ color: 'var(--sea-ink-soft)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="page-wrap py-16 md:py-24 relative z-10">
        <div className="text-center">
          <h2 className="display-title text-3xl md:text-5xl font-bold px-4">
            Everything you need
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="island-shell p-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 cursor-default"
              >
                <div className="mb-4 p-3 rounded-xl inline-block transition-transform duration-300 group-hover:scale-110" style={{ background: 'color-mix(in srgb, var(--lagoon) 10%, transparent)', color: 'var(--lagoon)' }}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg">{feat.title}</h3>
                <p
                  className="text-sm mt-2 leading-relaxed font-medium"
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
      <section className="page-wrap py-16 md:py-24 relative z-10">
        <div className="text-center">
          <h2 className="display-title text-3xl md:text-5xl font-bold px-4">
            Try it right now
          </h2>
          <p
            className="mt-4 px-4 text-lg font-medium"
            style={{ color: 'var(--sea-ink-soft)' }}
          >
            Define a route and call it — you&apos;ll get back exactly what you
            set.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 mt-12 md:mt-16">
          <div className="island-shell p-6 md:p-8 min-w-0 flex flex-col hover:border-blue-500/30 transition-colors duration-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="island-kicker mb-0!">What you define</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold mt-1">
              A route that returns users
            </h3>

            <div className="mt-6 space-y-5 flex-1">
              <CodeWindow
                title={
                  <>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">GET</span>
                    <span>/users</span>
                    <span className="ml-2 opacity-70">200 OK</span>
                  </>
                }
              >
                <pre><code>{`[
  {"id": 1, "name": "Alice"},
  {"id": 2, "name": "Bob"}
]`}</code></pre>
              </CodeWindow>

              <CodeWindow
                title={
                  <>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold">POST</span>
                    <span>/users</span>
                    <span className="ml-2 opacity-70">201 Created (500ms)</span>
                  </>
                }
              >
                <pre><code>{`{"id": 99, "name": "Created"}`}</code></pre>
              </CodeWindow>
            </div>
          </div>

          <div className="island-shell p-6 md:p-8 min-w-0 flex flex-col hover:border-indigo-500/30 transition-colors duration-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="island-kicker mb-0! bg-indigo-500/10! text-indigo-500!">What you get</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold mt-1">
              Live endpoints you can call
            </h3>

            <div className="mt-6 flex-1 flex flex-col">
              <CodeWindow title={<span className="opacity-70">Terminal</span>} className="flex-1">
                <pre className="flex-1 whitespace-pre-wrap">
                  <code style={{ color: 'var(--lagoon)' }}>{`$ curl `}</code><code style={{ color: 'var(--kicker)' }}>/mock/abc123/users</code>
                  <br />
                  <code className="opacity-70">{`→ [{"id":1,"name":"Alice"},...]`}</code>
                  <br /><br />
                  <code style={{ color: 'var(--lagoon)' }}>{`$ curl `}</code><code style={{ color: 'var(--kicker)' }}>/mock/abc123/users/42</code>
                  <br />
                  <code className="opacity-70">{`→ {"id":"42","name":"User 42"}`}</code>
                  <br /><br />
                  <code style={{ color: 'var(--lagoon)' }}>{`$ curl -X POST `}</code><code style={{ color: 'var(--kicker)' }}>/mock/abc123/users</code>
                  <br />
                  <code className="opacity-70">{`→ {"id":99,"name":"Created"}`}</code>
                </pre>
              </CodeWindow>
              <p
                className="text-sm mt-5 leading-relaxed font-medium"
                style={{ color: 'var(--sea-ink-soft)' }}
              >
                Path variables like <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold">:id</code> substitute into your response
                body automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 md:mt-20">
          <Link
            to="/create"
            className="group inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-lg glow-button transition-transform active:scale-95"
          >
            Try the visual builder
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="site-footer py-10 mt-10 text-center text-sm border-t border-black/5 dark:border-white/5"
        style={{ color: 'var(--sea-ink-soft)' }}
      >
        <p className="font-medium">QuickRoute &mdash; Free and open source API mocking.</p>
      </footer>
    </div>
  )
}
