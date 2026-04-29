# CLAUDE.md — Mobile App (`frontend/mobile/`)

Rules specific to the Ionic + React mobile application.
Also read: [`../../CLAUDE.md`](../../CLAUDE.md) (global) and [`../_common/CLAUDE.md`](../_common/CLAUDE.md) (shared frontend).

---

## Structure

```
frontend/mobile/
├── src/
│   ├── pages/       # Ionic page components (one per route)
│   └── components/  # Thin, mobile-only React components
├── public/
└── package.json
```

### Forbidden folders

These must never exist inside `frontend/mobile/`:

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
pages/ (IonPage)
  └── components/
        ├── @common/stores    ← read state directly
        └── @common/hooks     ← call actions, inject service client here
              └── @common/services  ← raw Supabase / fetch calls
                    └── Entity.ApiResponse<T>
```

Zustand stores are global — React Context is not needed and must not be used.

---

## Rule — Ionic Wrapping

Every `@common/ui-kit` list element rendered in a mobile page **must** be wrapped in `IonCard`.

```tsx
// ✅ Correct
import { IonCard, IonContent, IonPage } from '@ionic/react';
import { UserCard } from '@common/ui-kit/molecules/UserCard';
import { useAuthenticationStore } from '@common/stores';

const UserListPage = React.memo(function UserListPage() {
  const { userList } = useAuthenticationStore();
  return (
    <IonPage>
      <IonContent>
        {userList.map((user) => (
          <IonCard key={user.id}>
            <UserCard user={user} onSelect={handleSelect} />
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
});

// ❌ Wrong — naked ui-kit component without IonCard
{userList.map((user) => <UserCard key={user.id} user={user} />)}
```

---

## Rule — Thin Components

| Allowed | Not allowed |
|---|---|
| Render JSX from props | Call `fetch` or import from `@common/services` directly |
| Read state from `useXxxStore()` | Use React Context (`createContext`, `useContext`) |
| Call actions from `@common/hooks` | Transform or filter API data |
| Use Ionic layout components (`IonPage`, `IonContent`) | Business `if/else` conditions |
| Wrap `ui-kit` items in `IonCard` | Define derived state from raw API data |
| `useMemo` / `useCallback` for render perf | |

---

## Rule — React Performance

Mandatory in every component:

| API | When |
|---|---|
| `React.memo` | Every component that receives props |
| `useMemo` | Every value derived from props or state |
| `useCallback` | Every function passed down to a child |

---

## Mobile Pre-PR Checklist

- [ ] `frontend/mobile/` has no `contexts/`, `services/`, `hooks/`, `stores/`, `types/`, or `utils/` folders
- [ ] Every `ui-kit` list item is wrapped in `IonCard`
- [ ] Every component is wrapped in `React.memo`
- [ ] All `useMemo` and `useCallback` applied where required
- [ ] No component calls `fetch` or imports from `@common/services` directly
- [ ] No `createContext` or `useContext` — use `@common/stores` instead
- [ ] Service clients are injected into hooks from the component boundary
