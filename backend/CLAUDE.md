# CLAUDE.md — Backend (`backend/`)

Rules specific to the NestJS + Supabase API server.
Also read: [`../CLAUDE.md`](../CLAUDE.md) (global rules).

---

## Structure

```
backend/
├── src/
│   ├── interceptors/   # Global NestJS interceptors (ApiResponseInterceptor, etc.)
│   ├── modules/        # Feature modules (one folder per domain)
│   │   └── [domain]/
│   │       ├── [domain].controller.ts
│   │       ├── [domain].service.ts
│   │       ├── [domain].module.ts
│   │       └── dto/
│   └── main.ts
├── Dockerfile
└── package.json
```

---

## Rule — API Response Standard

Every REST endpoint **must** return the unified envelope. No exceptions.

```json
{ "success": true,  "data": { ... }, "error": null }
{ "success": false, "data": null,    "error": "Human-readable message" }
```

Typed as `Entity.ApiResponse<DataType>`.

### Enforcement via interceptor

The `ApiResponseInterceptor` (in `src/interceptors/`) wraps every controller response globally. Register it in `main.ts`:

```typescript
app.useGlobalInterceptors(new ApiResponseInterceptor());
```

- Controllers return the raw data object — the interceptor wraps it
- On exception, the interceptor catches and formats the error envelope
- No controller or service may manually construct `{ success, data, error }` — use the interceptor

### Forbidden response shapes

```typescript
// ❌ Raw array
return users;

// ❌ Raw object
return { id: '...', email: '...' };

// ❌ Plain string
return 'OK';
```

---

## Rule — Module Structure

Each domain is a self-contained NestJS module:

```
src/modules/authentication/
├── authentication.controller.ts   # HTTP layer only — delegates to service
├── authentication.service.ts      # Business logic — calls Supabase or DB
├── authentication.module.ts       # Module definition
└── dto/
    ├── sign-in-request.dto.ts
    └── sign-in-response.dto.ts
```

- Controllers contain **zero** business logic — they validate input and call the service
- Services contain all business logic — no HTTP concerns (`Request`, `Response`)
- DTOs use `class-validator` decorators for input validation

---

## Rule — Migrations

- All migration files live in `../_common/migrations/` (repo root `_common`, not `frontend/_common`)
- Naming: `YYYYMMDDHHMMSS_description_of_change.sql`
- Append-only — never edit a committed migration
- Every forward migration requires a matching rollback migration

---

## Rule — No Types in `backend/`

- `*.d.ts` files are banned from `backend/`
- Shared domain types live in `frontend/_common/types/` — import via `@common/types/`
- DTOs are plain TypeScript classes with decorators, not `*.d.ts` declarations

---

## Rule — Package Manager

- Use **pnpm** exclusively: `pnpm install`, `pnpm add`, `pnpm build`
- Docker installs use `pnpm install --frozen-lockfile`
- `pnpm-lock.yaml` must be committed alongside `package.json`

---

## Backend Pre-PR Checklist

- [ ] All endpoints return `Entity.ApiResponse<T>` via the global interceptor
- [ ] No controller contains business logic — delegates to service
- [ ] No `*.d.ts` files inside `backend/`
- [ ] New migrations use the `YYYYMMDDHHMMSS_` prefix and include a rollback
- [ ] No migration file has been edited after being committed
- [ ] DTOs use `class-validator` decorators for all input fields
- [ ] `pnpm-lock.yaml` is committed
- [ ] No `npm` or `yarn` commands used
