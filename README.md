# QuickRoute-Web

**Instant API mocks in seconds — no sign-up, no setup, no cost.**

QuickRoute lets you define API routes via a visual builder, upload them to a live mock server, and get back real HTTP endpoints you can use immediately. Built with Spring Boot (backend) and TanStack Start (frontend).

## How it works

1. **Define your routes** — choose HTTP method, path, status code, delay, and response body
2. **Upload & get your ID** — one click upload, you get a unique mock ID
3. **Call your endpoints** — use any HTTP client against `https://your-server/mock/{mockId}/your/path`

## Features

- No login, completely free, open source
- Visual route builder with up to 5 methods (GET, POST, PUT, DELETE, PATCH)
- Simulated response delays for testing loading states
- JSON validation and formatting in the builder
- Path variable support (`:id` routes substitute into response bodies)
- Automatic mock expiry (configurable, default 7 days)
- Per-IP rate limiting to prevent abuse
- Mobile responsive UI

## Architecture

```
┌──────────────────┐          ┌──────────────────────────────────────┐
│  TanStack Start  │  HTTP    │  Spring Boot (backend/)              │
│  (frontend/)     │◄────────►│  JPA + PostgreSQL (prod) / H2 (dev)  │
│  Cloudflare      │          │  Dynamic route registration          │
│  Workers         │          │  Rate limiting filter                │
└──────────────────┘          └──────────────────────────────────────┘
```

## Prerequisites

- **Backend**: Java 26 + Maven (or Docker)
- **Frontend**: pnpm 10+
- **Database**: PostgreSQL (prod) or H2 in-memory (dev, default)

## Quick start (local dev)

```bash
# Terminal 1 — Backend
cd backend
./mvnw spring-boot:run

# Terminal 2 — Frontend
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser.

## Commands

| Package | Command | Description |
|---------|---------|-------------|
| Backend | `./mvnw spring-boot:run` | Start server on `:8080` |
| Backend | `./mvnw test -Dtest=ClassName` | Run a specific test |
| Backend | `./mvnw package -DskipTests` | Build executable JAR |
| Frontend | `pnpm dev` | Start dev server on `:3000` |
| Frontend | `pnpm build` | Production build |
| Frontend | `pnpm test` | Run vitest |
| Frontend | `pnpm run deploy` | Build + deploy to Cloudflare Workers |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step guides:
- **Backend**: Render (free tier), Railway, Fly.io, or Oracle Cloud
- **Frontend**: Cloudflare Workers

Both packages share the same `Dockerfile` and `application-prod.properties` for containerized deployment.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | TanStack Start (React), TypeScript, Tailwind CSS, shadcn/ui, Lucide icons |
| Backend | Spring Boot 4.0.6, Java 26, JPA, Hibernate |
| Database | PostgreSQL (prod), H2 (dev) |
| Frontend host | Cloudflare Workers |
| Build | pnpm, Maven Wrapper |
