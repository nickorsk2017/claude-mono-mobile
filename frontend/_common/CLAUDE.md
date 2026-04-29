# CLAUDE.md — Shared Frontend (`frontend/_common/`)

Rules for the code shared between `frontend/web/` and `frontend/mobile/`.
Also read: [`../../CLAUDE.md`](../../CLAUDE.md) (global rules).

---

## Structure

```
frontend/_common/
├── hooks/      # Business logic hooks (store wiring, derived state, side effects)
├── services/   # Raw async API/Supabase functions — injected into hooks
├── stores/     # Zustand state stores
├── types/      # TypeScript declarations (*.d.ts only)
├── ui-kit/     # Shared UI components (Atomic Design + Storybook)
└── utils/      # Pure helper functions
```

---

## Rule — Services (`services/`)

Services are the **only** place where external APIs or Supabase are called.
Both web and mobile import from `@common/services` — there is no local `services/` in either app.

### Contract

- Plain `async` functions — no React, no hooks, no JSX
- Always return `Entity.ApiResponse<T>` — never throw to callers
- Receive only primitive arguments — no framework objects

```typescript
// ✅ frontend/_common/services/authentication-service.ts
export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<Entity.ApiResponse<{ user: Entity.User; session: Entity.SupabaseSession }>> {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return { success: false, data: null as never, error: error.message };
  return { success: true, data: { user: mapUser(data.user), session: mapSession(data.session) }, error: null };
}
```

### Naming

`[domain]-service.ts` — one file per domain:

| File | Responsibility |
|---|---|
| `authentication-service.ts` | Supabase auth: sign-in, sign-out, session |
| `user-service.ts` | User CRUD via REST or Supabase |

### Import alias

```typescript
import { signInWithEmailAndPassword } from '@common/services/authentication-service';
```

---

## Rule — Hooks (`hooks/`)

Hooks orchestrate services and stores. They contain all business logic.

### What belongs here

Every hook must do at least one of:
- Call a function from `@common/services`
- Read from or write to a Zustand store
- Derive or transform data from store state
- Coordinate async side effects (subscriptions, polling, timers)

### Injection pattern

Hooks receive service functions as arguments — they never import services directly.
This keeps hooks testable and decoupled from Supabase/fetch.

```typescript
// ✅ Correct — service injected, hook is platform-agnostic
export function useAuthentication(
  authClient: {
    signIn: (email: string, password: string) => Promise<Entity.ApiResponse<...>>;
    signOut: () => Promise<Entity.ApiResponse<null>>;
  }
): AuthenticationHookResult { ... }

// ❌ Wrong — hidden import couples hook to Supabase
import { signInWithEmailAndPassword } from '@common/services/authentication-service';
export function useAuthentication() { ... }
```

### No platform imports

`hooks/` must never import from `next/*` or `@ionic/*`.
Hooks run identically in web and mobile.

### Naming

`use-[domain]-[action].ts`

| File | Responsibility |
|---|---|
| `use-authentication.ts` | Login, logout, session restore |
| `use-user-list.ts` | Fetch paginated users, infinite scroll |
| `use-api-fetch.ts` | Generic loading/error wrapper for one-shot requests |

---

## Rule — Stores (`stores/`)

- File pattern: `use-[domain]-store.ts`
- Both `frontend/web/` and `frontend/mobile/` import stores **only** from here
- No local Zustand stores in `web/` or `mobile/`
- Use `persist` middleware only for data that must survive a page refresh

---

## Rule — Types (`types/`)

- Only `*.d.ts` files allowed — no `.ts` or `.tsx`
- Every type lives inside `declare global { namespace Entity {} }`
- No type at the module root or inline in any other file

---

## Rule — UI Kit (`ui-kit/`)

### Atomic Design structure

```
ui-kit/src/
├── atoms/       # Indivisible: Button, Input, Badge, Icon
├── molecules/   # Atom compositions: UserCard, SearchBar
└── organisms/   # Complex sections: NavigationBar, UserList
```

### Styling — inline styles only (cross-platform requirement)

`ui-kit` components **must** use inline styles via `softCalmTheme` tokens — never Tailwind.

**Why:** The ui-kit is consumed by both `frontend/web/` (Tailwind) and `frontend/mobile/` (Ionic CSS). Using Tailwind in the ui-kit would break mobile rendering.

```tsx
// ✅ Correct — inline styles with theme tokens
import { softCalmTheme } from '../../theme';
<div style={{ backgroundColor: softCalmTheme.colors.surface, borderRadius: softCalmTheme.borderRadius.medium }}>

// ❌ Wrong — Tailwind classes inside ui-kit
<div className="bg-white rounded-xl">
```

Platform-specific components (`frontend/web/components/`, `frontend/mobile/src/`) use their platform's own CSS system and must NOT import `softCalmTheme` directly.

### Component contract

Every component must:
- Be mobile-first and adaptive (min viewport 320px)
- Accept a `className` prop for local style extension
- Be wrapped in `React.memo`
- Use `useMemo` for derived display values
- Use `useCallback` for event handlers passed to children
- Have a co-located `*.stories.tsx` file
- Never import from `next/*` or `@ionic/*`

### Storybook

- Stories live next to each component: `atoms/Button/Button.stories.tsx`
- Every story must cover: default, all variants, 375px mobile viewport, disabled/error states
- Run: `cd frontend/_common/ui-kit && npm run storybook`

---

## Rule — Utils (`utils/`)

- Pure functions only — no React, no side effects
- No imports from `hooks/`, `stores/`, or `services/`
- One file per domain: `currency-formatter.ts`, `date-formatter.ts`

---

## Shared Frontend Pre-PR Checklist

- [ ] All external API/Supabase calls are in `services/` — not in hooks or components
- [ ] Services return `Entity.ApiResponse<T>` and never throw
- [ ] No hook imports from `services/` directly — services are injected as arguments
- [ ] No hook imports from `next/*` or `@ionic/*`
- [ ] No Zustand store defined outside `stores/`
- [ ] All types are `*.d.ts` files inside `namespace Entity {}`
- [ ] Every new `ui-kit` component has a `*.stories.tsx` file
- [ ] `ui-kit` components have no platform-specific imports
- [ ] Every `ui-kit` component uses `React.memo`, `useMemo`, `useCallback`
- [ ] `utils/` functions are pure — no side effects, no React
