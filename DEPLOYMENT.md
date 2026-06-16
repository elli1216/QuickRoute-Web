# Deployment Guide

## Prerequisites

- A GitHub account
- A [Render](https://render.com) account (for backend)
- A [Cloudflare](https://dash.cloudflare.com) account (for frontend)
- Your code pushed to a GitHub repository

---

## 1. Backend — Spring Boot on Render

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

### 1.2 Deploy on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** → **Web Service**
2. Connect your GitHub repo and select it
3. Configure the service:
   - **Name**: `quickroute-mock-server` (or any name)
   - **Region**: Choose the closest one
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** (Render will detect the `Dockerfile`)
   - **Plan**: **Free**
4. Click **Create Web Service** — Render builds and deploys. The free plan spins down after 15 min of inactivity (expect a ~30s cold start on first request after idle).
5. Add a PostgreSQL database:
   - Go to **New +** → **PostgreSQL**
   - Choose a name, region, and **Free** plan
   - After creation, copy the **Internal Database URL** (looks like `postgres://user:pass@host:port/db`)
6. Go back to your Web Service → **Environment** → **Add Environment Variables**:
   | Variable | Value |
   |----------|-------|
   | `SPRING_DATASOURCE_URL` | `jdbc:` + the Internal Database URL from step 5 (e.g. `jdbc:postgresql://user:pass@host:port/db`) |
   | `SPRING_PROFILES_ACTIVE` | `prod` |
7. Render will auto-deploy after adding env vars. Your backend is live at `https://<service-name>.onrender.com`.

> **Note:** Render's free PostgreSQL expires after 30-90 days. For a personal mock server this is fine — just recreate it when it expires. You can also upgrade to the $7/mo plan for a permanent database.

### 1.3 (Optional) Custom domain

In Render dashboard → your Web Service → **Settings** → **Custom Domain**.

---

## 2. Frontend — TanStack Start on Cloudflare Workers

### 2.1 Configure API URL

Set the production API URL as a Cloudflare secret:

```bash
cd frontend
npx wrangler secret put VITE_API_URL
# When prompted, enter: https://<your-service-name>.onrender.com
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

Your backend needs to allow the frontend's production origin. In Render dashboard → your Web Service → **Environment**, add:

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

| Platform | Cost | Notes |
|----------|------|-------|
| **Railway** | $5/mo after trial | Always-on, no cold starts. One-time $5 trial credit. |
| **Fly.io** | Pay-as-you-go | Needs `fly launch` in `backend/`. Docker-based, global regions. |
| **Oracle Cloud** | $0 (always free) | 4 vCPU, 24 GB RAM ARM VM. Manual setup (SSH, Docker, systemd). |
| **Coolify on Hetzner VPS** | ~€4/mo | Self-hosted PaaS on your own server. Full control, push-to-deploy. |

For all platforms, the same `Dockerfile` and `application-prod.properties` are used.
