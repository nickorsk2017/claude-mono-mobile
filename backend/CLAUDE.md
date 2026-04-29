# CLAUDE.md — Backend Microservices

NestJS microservices architecture. Single public entry point via Gateway; internal services are isolated from direct external traffic.

---

## Services & Ports

| Service | Internal Port | Publicly Exposed | Purpose |
|---|---|---|---|
| `gateway` | 4000 | Yes (→ 4000) | Routing, CORS, Supabase JWT guard |
| `auth-service` | 4001 | No | Sign-in, sign-up, sign-out via Supabase Auth |
| `user-service` | 4002 | No | User profile CRUD via Supabase DB |

---

## Communication Flow

```
Web / Mobile
    │
    ▼  HTTP :4000
┌──────────────────────────────┐
│           Gateway            │
│  SupabaseAuthenticationGuard │  validates JWT, injects x-user-id header
└──────┬──────────────┬────────┘
       │              │  HTTP (Docker internal network only)
       ▼              ▼
 auth-service    user-service
   :4001            :4002
```

**Public routes** — no JWT required:
- `POST /auth/sign-in`
- `POST /auth/sign-up`

**Protected routes** — valid Supabase JWT required:
- `POST /auth/sign-out`
- `GET  /users/me`
- `PATCH /users/me`

---

## Request Lifecycle

1. Client sends request with `Authorization: Bearer <jwt>` (protected routes).
2. Gateway receives on port 4000.
3. `SupabaseAuthenticationGuard` calls `supabase.auth.getUser(token)` using the service role key.
4. On success, guard injects `x-user-id` and `x-user-email` headers into the forwarded request.
5. `ProxyService` strips the original `Authorization` header and forwards only safe headers.
6. Internal service processes the request and returns `{ success, data, error }`.
7. Gateway returns the internal service's response to the client (HTTP 200; errors carried in body).

---

## Standard Response Envelope

Every endpoint returns:

```typescript
{
  success: boolean;
  data: T | null;
  error: string | null;
}
```

---

## Supabase Client Strategy

| Service | Key Used | Reason |
|---|---|---|
| `gateway` | `SUPABASE_SERVICE_ROLE_KEY` | `getUser()` requires elevated access |
| `auth-service` | `SUPABASE_ANON_KEY` | Auth operations use the public client |
| `user-service` | `SUPABASE_SERVICE_ROLE_KEY` | DB queries bypass RLS; user ID trusted from gateway |

---

## Environment Variables

Loaded from `/_common/.env` via Docker `env_file`. For local dev, copy `_common/.env.example` → `_common/.env`.

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GATEWAY_PORT=4000
GATEWAY_CORS_ORIGIN=http://localhost:3000
AUTH_SERVICE_PORT=4001
AUTH_SERVICE_URL=http://auth-service:4001
USER_SERVICE_PORT=4002
USER_SERVICE_URL=http://user-service:4002
```

For local dev, set `AUTH_SERVICE_URL=http://localhost:4001` and `USER_SERVICE_URL=http://localhost:4002`.

---

## Development

### First-time setup (generates pnpm-lock.yaml — commit it)

```bash
cd backend/gateway      && pnpm install
cd backend/auth-service && pnpm install
cd backend/user-service && pnpm install
```

### Run a service locally

```bash
cd backend/gateway      && pnpm dev   # :4000
cd backend/auth-service && pnpm dev   # :4001
cd backend/user-service && pnpm dev   # :4002
```

### Run all backend services via Docker Compose

```bash
docker compose up --build gateway auth-service user-service
```

---

## Adding a New Microservice

1. Create `backend/<name>-service/` with `package.json`, `tsconfig.json`, `Dockerfile`, `src/`.
2. Follow the `auth-service` structure: `health/`, `supabase/`, `response/`, domain module.
3. Add new proxy controller in `backend/gateway/src/proxy/`.
4. Register the new controller in `backend/gateway/src/proxy/proxy.module.ts`.
5. Add service to `docker-compose.yml` with a `healthcheck` block. Do not expose internal port.
6. Document new env vars in `_common/.env.example` and this file.
7. Run `pnpm install` in the new service directory and commit `pnpm-lock.yaml`.

---

## File Structure

```
backend/
├── gateway/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── health/               GET /health
│       ├── authentication/       SupabaseAuthenticationGuard
│       └── proxy/                ProxyService, auth & user proxy controllers
├── auth-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── health/               GET /health
│       ├── supabase/             SupabaseService (anon key)
│       ├── response/             response.builder.ts
│       └── authentication/       sign-in, sign-up, sign-out
└── user-service/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── health/               GET /health
        ├── supabase/             SupabaseService (service role key)
        ├── response/             response.builder.ts
        └── user/                 GET /users/me, PATCH /users/me
```
