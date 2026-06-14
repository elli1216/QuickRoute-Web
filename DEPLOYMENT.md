# Deployment Guide

## Prerequisites

- A GitHub account
- A [Railway](https://railway.app) account (for backend)
- A [Cloudflare](https://dash.cloudflare.com) account (for frontend)
- Your code pushed to a GitHub repository

---

## 1. Backend — Spring Boot on Railway

### 1.1 Push to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
# Create a repo on GitHub, then:
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

### 1.2 Deploy on Railway

1. Go to [railway.app/new](https://railway.app/new)
2. Select **Deploy from GitHub repo**
3. Choose your repo
4. Set the **Root Directory** to `backend`
5. Railway detects the `Dockerfile` automatically and starts building
6. Add a PostgreSQL database:
   - Click **+ New** → **Database** → **Add PostgreSQL**
   - This auto-injects a `DATABASE_URL` environment variable
7. Set **Environment Variables** for the backend service:
   | Variable | Value |
   |----------|-------|
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `PORT` | `8080` |
8. Wait for the build to finish. Your backend is live at `https://<project-name>.railway.app`

> Railway's `PORT` env var maps to the host port. Spring Boot will bind to `8080` inside the container.

### 1.3 (Optional) Custom domain

In Railway dashboard → your backend service → **Settings** → **Domains** → add your domain.

---

## 2. Frontend — TanStack Start on Cloudflare Workers

### 2.1 Configure API URL

Set the production API URL as a Cloudflare secret:

```bash
cd frontend
npx wrangler secret put VITE_API_URL
# When prompted, enter: https://<your-railway-app>.railway.app
```

Or set it in the Cloudflare dashboard: **Workers & Pages** → your project → **Settings** → **Variables**.

### 2.2 Deploy

```bash
cd frontend
pnpm run deploy
```

This runs `build` then `wrangler deploy`. Your frontend is live at `https://<your-project>.workers.dev`.

### 2.3 (Optional) Custom domain

In Cloudflare dashboard → **Workers & Pages** → your project → **Custom Domain** → add your domain.

---

## 3. Update CORS (one-time)

Your backend needs to allow the frontend's production origin. In Railway dashboard → **Variables**, add:

| Variable | Value |
|----------|-------|
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend-domain.com` |

Then update `WebConfig.java` to read it:

```java
@Value("${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
private String allowedOrigins;
```

---

## 4. Verify

1. Open the frontend URL in a browser
2. Create a mock via the visual builder
3. Copy one of the generated `curl` commands
4. Run it in your terminal — you should get the configured response back

---

## Alternative Backend Platforms

| Platform | Notes |
|----------|-------|
| **Render** | Free tier spins down after 15 min idle. Add PostgreSQL via Render dashboard. Set `SPRING_PROFILES_ACTIVE=prod`. |
| **Fly.io** | Needs `fly launch` in the `backend/` dir. Generates its own `fly.toml`. Use their PostgreSQL addon (`fly postgres create`). |
| **Oracle Cloud** | Always free ARM VM. More manual setup (SSH, systemd, nginx or Cloudflare Tunnel). |

For all platforms, the same `Dockerfile` and `application-prod.properties` are used.
