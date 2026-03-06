# Day 12 - Data fetching patterns

## Focus
- Port data fetching from direct localStorage calls to Next.js Route Handlers.
- Decide server vs client boundary for every route.
- Structure data flow: server-side store, route handlers, fetch-based API client, React Query.

## Server vs client decisions

| Component | Type | Why |
|-----------|------|-----|
| `app/layout.tsx` | Server | Static HTML shell, no hooks. |
| `app/(app)/layout.tsx` | Client | Needs `useAuth`, `usePathname`, `useRouter` for auth guard and nav highlighting. |
| `app/login/page.tsx` | Client | Needs `useForm`, `useAuth`, `useSearchParams`. |
| `app/(app)/dashboard/page.tsx` | Client | Uses `useState`, `useMemo` for local filtering. |
| `app/(app)/projects/page.tsx` | **Server** | Exports `metadata`; renders the client island below. |
| `app/(app)/projects/ProjectsContent.tsx` | **Client** | `useQuery`, `useMutation`, `useSearchParams`, debounce, pagination. |
| `app/(app)/projects/[id]/page.tsx` | **Server** | Exports `metadata`; awaits `params` Promise and passes `id` to client island. |
| `app/(app)/projects/[id]/ProjectDetailContent.tsx` | **Client** | Two `useQuery` calls, four `useMutation` calls with optimistic updates, modal state. |

**Rule of thumb**: Server by default. Mark `"use client"` only when the component needs hooks (`useState`, `useEffect`, `useQuery`, event handlers) or browser-only APIs.

## Data fetching flow

```
Browser (client component)
  │  useQuery / useMutation
  ▼
src/api/projects.ts / tasks.ts      ← fetch('/api/...')
  │
  ▼
app/api/projects/route.ts           ← Next.js Route Handler (server)
app/api/tasks/route.ts
  │
  ▼
src/lib/data/projects.ts            ← In-memory Map store (server)
src/lib/data/tasks.ts
```

React Query still owns caching, stale-while-revalidate, and optimistic updates on the client. The route handlers own validation and persistence on the server.

## Route handler inventory

| Method | Path | Action |
|--------|------|--------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project (validated via Zod) |
| GET | `/api/projects/[id]` | Get single project |
| PATCH | `/api/projects/[id]` | Update project |
| GET | `/api/tasks?projectId=` | List tasks for a project |
| POST | `/api/tasks?projectId=` | Create task |
| GET | `/api/tasks/[id]` | Get single task |
| PATCH | `/api/tasks/[id]` | Update task or move status (`{ action: "move", status }`) |

## Implementation notes
- Server-side data stores (`src/lib/data/`) replace localStorage with in-memory Maps seeded with default data. Data lives for the lifetime of the server process.
- API client (`src/api/client.ts`) now exposes `fetchJson<T>(url, options)` which handles response parsing, error normalization, and maps non-OK responses to `ApiClientError`.
- Route handlers validate request bodies using the same Zod schemas (`projectSchema`, `taskSchema`) that the forms use, ensuring a single source of truth for validation.
- Task status transitions are validated server-side using the same adjacency rule (only +-1 step allowed).
- Project page wrappers are server components that export `metadata` and render client islands inside `<Suspense>`.

## How to test
- Run `npm run build` and confirm zero errors with all routes listed.
- Run `npm run dev` and visit `/login`, sign in, navigate to `/projects`.
- Create a project, open it, create tasks, move task statuses.
- Open browser DevTools Network tab and confirm fetch calls go to `/api/projects` and `/api/tasks`.
