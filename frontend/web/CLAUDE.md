# CLAUDE.md — Web App (`frontend/web/`)

Rules specific to the Next.js web application.
Also read: [`../../CLAUDE.md`](../../CLAUDE.md) (global) and [`../_common/CLAUDE.md`](../_common/CLAUDE.md) (shared frontend).

---

## Structure

```
frontend/web/
├── app/          # Next.js App Router — layouts, pages, loading, error, route handlers
├── components/   # Thin, web-only React components (NOT shared with mobile)
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

### Forbidden folders

These must never exist inside `frontend/web/`:

| Folder | Reason |
|---|---|
| `contexts/` | Replaced by `@common/stores` — no React Context needed |
| `services/` | Lives in `frontend/_common/services/` |
| `hooks/` | Lives in `frontend/_common/hooks/` |
| `stores/` | Lives in `frontend/_common/stores/` |
| `types/` | Lives in `frontend/_common/types/` |
| `utils/` | Lives in `frontend/_common/utils/` |

---

## Rule — Layer Responsibilities

```
app/page.tsx
  └── components/
        ├── @common/stores    ← read state directly (currentUser, isLoading, etc.)
        └── @common/hooks     ← call actions (login, logout, fetchUsers, etc.)
              └── @common/services  ← raw Supabase / fetch calls
                    └── Entity.ApiResponse<T>
```

Zustand stores are global — React Context is not needed and must not be used.

### `app/`

- Contains only `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, and `route.ts` files
- No business logic, no direct API calls

### `components/`

- Web-only thin components not shared with mobile
- Read state via `useXxxStore()` from `@common/stores`
- Trigger actions via hooks from `@common/hooks` — inject the service client at this boundary
- May render `@common/ui-kit` components without wrapping
- Must be wrapped in `React.memo`

```tsx
// ✅ Correct — store for state, hook for actions
import { useAuthenticationStore } from '@common/stores';
import { useAuthentication } from '@common/hooks';
import { signInWithEmailAndPassword, signOut, getActiveSession } from '@common/services/authentication-service';

const authClient = {
  signIn: signInWithEmailAndPassword,
  signOut,
  getSession: getActiveSession,
};

const LoginPage = React.memo(function LoginPage() {
  const { currentUser, isAuthenticating, authenticationError } = useAuthenticationStore();
  const { login, logout } = useAuthentication(authClient);

  const handleLogin = useCallback(async () => {
    await login({ email, password });
  }, [login, email, password]);

  return <LoginForm onSubmit={handleLogin} isLoading={isAuthenticating} error={authenticationError} />;
});
```

---

## Rule — Thin Components

Components contain **zero** business logic.

| Allowed | Not allowed |
|---|---|
| Render JSX from props | Call `fetch` or import from `@common/services` directly |
| Read state from `useXxxStore()` | Use React Context (`createContext`, `useContext`) |
| Call actions from `@common/hooks` | Transform or filter API data |
| `useMemo` / `useCallback` for render perf | Business `if/else` conditions |
| Apply local Tailwind classes | Define derived state from raw API data |

---

## Rule — React Performance

Mandatory in every component:

| API | When |
|---|---|
| `React.memo` | Every component that receives props |
| `useMemo` | Every value derived from props or state |
| `useCallback` | Every function passed down to a child |

---

## Web Pre-PR Checklist

- [ ] `frontend/web/` has no `contexts/`, `services/`, `hooks/`, `stores/`, `types/`, or `utils/` folders
- [ ] Every component is wrapped in `React.memo`
- [ ] All `useMemo` and `useCallback` applied where required
- [ ] No component calls `fetch` or imports from `@common/services` directly
- [ ] No `createContext` or `useContext` — use `@common/stores` instead
- [ ] Service clients are instantiated in components and injected into hooks
