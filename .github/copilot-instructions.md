# QuickRoute-Web Copilot Instructions

## Repository structure

This is a monorepo with two independently runnable packages:

- `backend/`: Spring Boot 4.0.6 MVC application using Java 25, Maven, JPA, and Caffeine.
- `frontend/`: TanStack Start/React application using TypeScript, Vite, pnpm, and Cloudflare Workers.

The backend listens on port `8080`; the frontend dev server listens on port `3000`.

## Build, test, and development commands

Run backend commands from `backend/`. The Maven wrapper is not executable in this checkout, so invoke it through Bash:

```bash
bash mvnw spring-boot:run
bash mvnw compile
bash mvnw test
bash mvnw test -Dtest=MockRegistryServiceTest
bash mvnw package -DskipTests
```

The default backend profile is `dev`, which uses an in-memory H2 database and `create-drop` schema generation. Use `SPRING_PROFILES_ACTIVE=prod` for PostgreSQL deployments; production expects `DATABASE_URL` and validates an existing schema.

Run frontend commands from `frontend/`:

```bash
pnpm install
pnpm dev
pnpm test
pnpm test -- path/to/test-file.test.ts
pnpm build
pnpm lint
pnpm check
pnpm format
pnpm run generate-routes
pnpm run deploy
```

`pnpm run generate-routes` regenerates `frontend/src/routeTree.gen.ts`; do not edit that generated file manually.

## Architecture

The frontend route builder stores editable routes in the Zustand `useCreateStore`. `frontend/src/lib/api.ts` converts each route into the backend upload shape: keys are `"METHOD /path"` and values contain status, delay, response body, and optional authentication settings. The frontend calls the backend management API using the base URL in `frontend/src/lib/constants.ts`.

The backend exposes management endpoints through `MockManagementController`, including upload, list, detail, delete, and request-log retrieval. `MockRegistryService` persists `MockConfiguration` and `RouteDefinition` entities through JPA repositories, caches mock lookups, removes expired mocks on a schedule, and re-registers persisted routes at application startup.

Uploaded routes become live HTTP endpoints through `DynamicRouteRegistrar`, which registers mappings with Spring's `RequestMappingHandlerMapping` under `/mock/{mockId}/...`. Route patterns use frontend-style `:id` variables and are converted to Spring `{id}` patterns. The `requestMappingHandlerMapping` qualifier is required because Actuator exposes another handler-mapping bean.

`MockRequestHandler` resolves the matching route, applies configured delay and authentication, substitutes path variables, resolves Datafaker templates, writes the configured JSON response, increments statistics, and records recent request logs. `TemplateResolutionService` handles mustache-like dynamic response values. `StatisticsService` and `StatisticsController` provide aggregate request/mock metrics.

Development uses H2 in-memory storage; production uses PostgreSQL. There is currently no migration tool, so a production database must already contain the schema required by JPA validation.

## Codebase-specific conventions

### Backend

- Use package `com.elli.mockserver`; do not use the package name shown in older README examples.
- Keep the existing layering: controllers handle HTTP DTOs, services contain business logic, repositories contain JPA access, and models represent persisted entities.
- There is no Lombok. Add explicit constructors, getters, and setters following the existing model classes.
- Use JPA repositories for persistence. Mock lookups go through `MockRegistryService`, which also owns cache invalidation and route lifecycle coordination.
- Dynamic route registration and unregistration must use the same path conversion and HTTP method mapping.
- Preserve the configured mock lifecycle: deleting or expiring a mock must unregister all dynamic routes and remove its request logs.
- Backend JSON support is explicitly provided by `jackson-databind`; do not assume `spring-boot-starter-webmvc` supplies it transitively in this Boot 4 setup.
- Keep local/test behavior on the default `dev` profile and avoid requiring PostgreSQL for ordinary tests.

### Frontend

- TypeScript is strict and uses `verbatimModuleSyntax`; use `import type` for type-only imports.
- Prefer the `#/` or `@/` aliases for `frontend/src` imports.
- Keep API payload and response types in `frontend/src/lib/api.ts`; keep create-form state in `useCreateStore`.
- Preserve the existing response-builder flow: routes can switch between field-builder and raw JSON modes, and invalid JSON must not silently switch modes.
- CSS is imported with the `?url` suffix where required by the TanStack Start setup.
- Use the existing shadcn/ui style and add components with `pnpm dlx shadcn@latest add <component>`.
- TanStack Router route files live in `frontend/src/routes`; regenerate the route tree after adding or renaming routes.
- Frontend deployment targets Cloudflare Workers. Public configuration belongs in `wrangler.jsonc`; deployment secrets should be supplied with Wrangler secrets rather than committed.

## Documentation and deployment references

- `README.md`: product overview, local startup, package commands, and high-level architecture.
- `DEPLOYMENT.md`: Render/PostgreSQL backend and Cloudflare Workers frontend deployment.
- `backend/AGENTS.md`: backend-specific implementation details and operational gotchas.
- `frontend/.cursorrules`: existing shadcn component installation instruction.
