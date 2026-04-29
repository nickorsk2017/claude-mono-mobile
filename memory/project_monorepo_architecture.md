---
name: Monorepo Architecture
description: Stack, structure, and hard rules for the claude-architecture-ionic monorepo
type: project
---

This project is a full monorepo with the following service layout:

- `/web` — Next.js + React + Tailwind + Zustand + Supabase
- `/mobile` — Ionic (latest) + React
- `/backend` — NestJS + Supabase
- `/mcp` — MCP AI Agent logic
- `/_common` — shared code: ui-kit, stores, types, utils, migrations, .env

**Why:** Architect-level scaffold defined in one session; rules encoded in CLAUDE.md.

**How to apply:** All future code in this repo must follow the 10 rules in CLAUDE.md. Key hard constraints:
1. Max 200 lines per file — decompose if exceeded
2. No abbreviations in any identifier
3. All TypeScript types live in `_common/types/*.d.ts` inside `declare global { namespace Entity {} }`
4. REST responses must use `{ success, data, error }` envelope
5. Shared Zustand stores only from `_common/stores/` — no local stores in web or mobile
6. Every `ui-kit` component must have a `.stories.tsx` file
7. React.memo + useMemo + useCallback are mandatory on all components
