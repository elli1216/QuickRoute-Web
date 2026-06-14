import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'QuickRoute - Free API Mock Server',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <nav
          className="page-wrap flex items-center gap-4 md:gap-6 py-3 md:py-4 px-4 md:px-0"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <Link
            to="/"
            className="nav-link flex items-center gap-2"
            activeProps={{
              className: 'nav-link is-active flex items-center gap-2',
            }}
          >
            <img
              src="/main-logo.svg"
              alt="QuickRoute"
              className="size-10 w-auto"
            />
          </Link>
          <Link
            to="/create"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Create Mock
          </Link>
          <Link
            to="/mocks"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            My Mocks
          </Link>
        </nav>
        <main>{children}</main>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
