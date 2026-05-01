# Serene Monorepository

Monorepo for the Serene web app, Ionic mobile app, NestJS backend API, and shared frontend packages.

## Structure

```
.
├── frontend/
│   ├── web/          # Next.js 16 + Tailwind CSS
│   ├── mobile/       # Ionic 8 + Capacitor + Vite
│   └── _common/      # Shared hooks / services / stores / ui-kit / themes / types
├── backend/
│   └── app/          # NestJS API (port 4000)
├── _common/
│   ├── .env          # Environment variables (not committed)
│   └── .env.example  # Template — copy and fill in
└── docker-compose.yml
```

## Requirements

- Node.js 22+
- pnpm 9.15.0
- Docker + Docker Compose (for containerised workflow)

---

## Quick start

### 1. Environment

```bash
cp _common/.env.example _common/.env
# Fill in Supabase keys, URLs, and ports
```

### 2. Install

```bash
make install
```

If the pnpm store is inconsistent, reset cleanly:

```bash
pnpm store prune
rm -rf frontend/node_modules frontend/mobile/node_modules backend/app/node_modules
env -u PNPM_STORE_DIR -u npm_config_store_dir pnpm --dir frontend install --force
env -u PNPM_STORE_DIR -u npm_config_store_dir pnpm --dir frontend/mobile install --force
env -u PNPM_STORE_DIR -u npm_config_store_dir pnpm --dir backend/app install --force
```

---

## Run locally

### Backend + Web

```bash
make fullstack-web
```

| Service | URL |
|---|---|
| Web | http://localhost:3000 |
| API | http://localhost:4000 |

### Backend + Mobile

```bash
make fullstack-mobile
```

| Service | URL |
|---|---|
| Ionic dev server | http://localhost:8100 |
| API | http://localhost:4000 |

### Individual services

```bash
make backend   # API  (:4000)
make web       # Web  (:3000)
make mobile    # Ionic dev server (:8100)
```

---

## Docker

Runs **web** and **api** only. The mobile app runs locally via Vite and is deployed as a native app through Capacitor.

```bash
make docker-build    # Build images
make docker-up       # Build and start
make docker-down     # Stop
make docker-restart  # Stop, rebuild, start
```

---

## Mobile — Capacitor native builds

After building the web bundle (`pnpm --dir frontend/mobile build`):

```bash
cd frontend/mobile
npx cap sync          # Sync bundle to native platforms
npx cap run android   # Run on Android emulator / device
npx cap run ios       # Run on iOS simulator / device
```

---

## Build

```bash
pnpm --dir backend/app build
pnpm --dir frontend --filter web build
pnpm --dir frontend/mobile build
```

---

## Environment variables

| Prefix | Used by |
|---|---|
| `SUPABASE_*` | Backend API (server-side) |
| `NEXT_PUBLIC_*` | Next.js web (client + server) |
| `BACKEND_URL` | Server-side fetch in Next.js — use `http://api:4000` inside Docker |
| `BACKEND_PORT` | API listen port (default `4000`) |

---

## Architecture

```
Browser / Ionic WebView
  └── frontend/_common/services  ← all API calls
        └── frontend/_common/hooks  ← business logic
              └── frontend/_common/stores  ← Zustand global state
```

All non-UI logic lives in `frontend/_common/`. Both the web and mobile apps are thin UI shells that import from `_common` — no business logic is duplicated.
