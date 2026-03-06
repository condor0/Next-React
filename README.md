# Research Workspace

A project management app built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS**. Tracks research projects and tasks with a Kanban-style workflow.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/login` — use any credentials to simulate authentication.

## Scripts

| Script                  | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start the Next.js dev server |
| `npm run build`         | Production build             |
| `npm start`             | Serve the production build   |
| `npm run lint`          | Run ESLint                   |
| `npm run format`        | Prettier check               |
| `npm test`              | Run Vitest in watch mode     |
| `npm run test:coverage` | Run Vitest with coverage     |

## Architecture

```
app/
├── (app)/                  # Authenticated route group
│   ├── layout.tsx          # App shell (nav, sidebar)
│   ├── dashboard/          # Dashboard overview
│   └── projects/           # Project list & detail
│       └── [id]/           # Dynamic project page
├── api/                    # Route Handlers (REST)
│   ├── projects/           # CRUD for projects
│   └── tasks/              # CRUD for tasks
├── login/                  # Login page
├── layout.tsx              # Root layout (metadata, providers)
└── providers.tsx           # React Query provider

src/
├── api/                    # Client-side fetch wrappers
├── components/             # Reusable UI primitives
├── forms/                  # Zod schemas & form types
├── hooks/                  # Custom React hooks
├── lib/data/               # In-memory data store
├── state/                  # Zustand stores
└── utils/                  # Utility functions
```

### Key decisions

- **Server Components by default** — only 7 files use `"use client"`, each justified by hooks or browser APIs.
- **Route Handlers** serve as the API layer with in-memory data, making back-end replacement straightforward.
- **React Query** (`staleTime: 30s`) handles client-side caching; route handlers add `Cache-Control` headers for CDN caching.
- **Zustand** manages auth state (client-only, session-scoped).
- **Zod** schemas are shared between forms and route handlers for consistent validation.
- **Task status transitions** follow adjacency rules (`todo → doing → done`), enforced in both the UI dropdowns and the API.

### Metadata

Route-specific titles use the Next.js `title.template` pattern:

```
Root:           "Research Workspace"
Login:          "Sign In | Research Workspace"
Dashboard:      "Dashboard | Research Workspace"
Projects:       "Projects | Research Workspace"
Project detail: "<Project Name> | Research Workspace"  (dynamic via generateMetadata)
```

## CI

GitHub Actions runs on every push to `main` and on pull requests:

1. **Lint** — ESLint
2. **Format** — Prettier check
3. **Build** — `next build`
4. **Test** — Vitest (currently `continue-on-error` due to Vitest 4.x runner configuration)

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Deployment

The app is configured for Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

No `vercel.json` is needed — Vercel auto-detects Next.js and applies optimal defaults.

## Tech stack

| Layer        | Technology                         |
| ------------ | ---------------------------------- |
| Framework    | Next.js 16 (App Router)            |
| Language     | TypeScript 5.9 (strict)            |
| UI           | React 19 + Tailwind CSS 3.4        |
| Forms        | React Hook Form + Zod 4            |
| Server state | React Query 5                      |
| Client state | Zustand 5                          |
| Testing      | Vitest 4 + Testing Library + MSW 2 |
| Linting      | ESLint + Prettier                  |

## Docs

Day-by-day development notes are in the `docs/` directory:

| Day                  | Topic                                               |
| -------------------- | --------------------------------------------------- |
| [01](docs/day-01.md) | Setup + Tailwind + baseline layout                  |
| [02](docs/day-02.md) | UI primitives and state drills                      |
| [04](docs/day-04.md) | Forms and validation                                |
| [05](docs/day-05.md) | Client state with Zustand                           |
| [06](docs/day-06.md) | Data fetching patterns                              |
| [07](docs/day-07.md) | Testing setup                                       |
| [08](docs/day-08.md) | Component testing                                   |
| [09](docs/day-09.md) | Integration testing                                 |
| [11](docs/day-11.md) | Next.js migration: routing and layouts              |
| [12](docs/day-12.md) | Next.js data fetching: route handlers + React Query |
| [13](docs/day-13.md) | SEO and performance in Next.js                      |
| [14](docs/day-14.md) | CI, deployment, and handover                        |
