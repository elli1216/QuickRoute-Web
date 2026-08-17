import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '#/components/theme-provider'
import { SiteHeader } from '#/components/site-header'
import { SiteFooter } from '#/components/site-footer'

interface MyRouterContext {
  queryClient: QueryClient
}

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'QuickRoute',
  url: 'https://quick-route.app',
  description:
    'Free instant API mocking server and visual REST endpoint generator. Build dynamic JSON payloads with Faker variables, simulate latency, and enforce auth with zero sign-up.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Instant REST API Mocking without sign-up',
    'Visual JSON schema and field builder',
    'Dynamic Data Generation with Faker variables',
    'Simulated network latency delays',
    'Bearer token and API key authentication enforcement',
    'Dynamic Path Parameter substitution (:id)',
  ],
  author: {
    '@type': 'Person',
    name: 'Eli Floresca',
    url: 'https://eli-floresca.is-pinoy.dev/',
  },
}

import NotFoundComponent from '#/components/not-found/NotFound.tsx';

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
        title:
          'QuickRoute — Free Instant API Mocking Server | REST API Mock Generator',
      },
      {
        name: 'description',
        content:
          'Create instant, free API mocks in seconds with zero signup. Visual route builder, dynamic Faker JSON generation, custom latency delays, and auth support. Try it now! ✓',
      },
      {
        name: 'keywords',
        content:
          'api mocking, mock api server, free mock api, rest api mock, fake json api, mock endpoints, api simulator, faker api generator, test api online, postman mock alternative, mock rest api',
      },
      {
        name: 'author',
        content: 'Eli Floresca',
      },
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'google-site-verification',
        content: 'WPuTqSBd8oq5jvwazVcEg5XAda675GgoM-srkMDCxZE',
      },
      {
        name: 'theme-color',
        content: '#3b82f6',
      },
      // Open Graph
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://quick-route.app',
      },
      {
        property: 'og:site_name',
        content: 'QuickRoute',
      },
      {
        property: 'og:title',
        content: 'QuickRoute — Instant Free API Mocking Server',
      },
      {
        property: 'og:description',
        content:
          'Instant API mocks in seconds — zero sign-up, zero setup, completely free. Visual route builder, simulated delays, dynamic Faker data, and real HTTP endpoints.',
      },
      {
        property: 'og:image',
        content: '/main-logo.png',
      },
      {
        property: 'og:locale',
        content: 'en_US',
      },
      // Twitter Cards
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'QuickRoute — Free Instant API Mocking Server',
      },
      {
        name: 'twitter:description',
        content:
          'Build and test mock REST APIs in seconds with zero sign-up. Free visual route builder with Faker data generation.',
      },
      {
        name: 'twitter:image',
        content: '/main-logo.png',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(jsonLdSchema),
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col justify-between">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
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
        </ThemeProvider>
      </body>
    </html>
  )
}
