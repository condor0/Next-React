# Day 13 — SEO and Performance in Next.js

## What changed

### 1. Route-specific metadata with title template

- **Root layout** (`app/layout.tsx`): Converted to a typed `Metadata` export with `title.template: "%s | Research Workspace"`. Every child page that exports a `title` string gets the suffix automatically.
- **Login** (`app/login/layout.tsx`): New thin layout that exports `{ title: "Sign In" }` — needed because the page itself is `"use client"` and cannot export metadata.
- **Dashboard** (`app/(app)/dashboard/layout.tsx`): Same pattern, exports `{ title: "Dashboard" }`.
- **Projects list** (`app/(app)/projects/page.tsx`): Enhanced with a `description` field.
- **Project detail** (`app/(app)/projects/[id]/page.tsx`): Replaced static metadata with `generateMetadata()` that reads the project name from the data store, producing dynamic titles like _"Project Alpha | Research Workspace"_.

### 2. Leftover Vite assets

`public/vite.svg` and `src/assets/react.svg` were already removed in a previous cleanup — no action needed.

### 3. Cache headers on route handlers

Added `Cache-Control` response headers to every GET route handler:

| Route                | `s-maxage` | `stale-while-revalidate` |
| -------------------- | ---------- | ------------------------ |
| `/api/projects`      | 60 s       | 300 s                    |
| `/api/projects/[id]` | 60 s       | 300 s                    |
| `/api/tasks`         | 30 s       | 120 s                    |
| `/api/tasks/[id]`    | 30 s       | 120 s                    |

Tasks use shorter windows because task status changes more frequently than project metadata.

### 4. Client component audit

All 7 `"use client"` files were reviewed. Each one legitimately requires client-side execution:

| File                                               | Reason                                            |
| -------------------------------------------------- | ------------------------------------------------- |
| `app/providers.tsx`                                | QueryClientProvider context                       |
| `app/(app)/layout.tsx`                             | useRouter, usePathname, useAuth, useAuthGuard     |
| `app/(app)/dashboard/page.tsx`                     | useState, useMemo, useToast, window.setTimeout    |
| `app/(app)/projects/ProjectsContent.tsx`           | useQuery, useMutation, useRouter, useSearchParams |
| `app/(app)/projects/[id]/ProjectDetailContent.tsx` | useQuery, useMutation, useRouter, useSearchParams |
| `app/login/page.tsx`                               | useForm, useRouter, useSearchParams               |
| `app/hooks/useAuthGuard.ts`                        | useRouter, useEffect, useAuth                     |

No components were unnecessarily marked as client — no changes required.

## Files added

- `app/login/layout.tsx`
- `app/(app)/dashboard/layout.tsx`

## Files modified

- `app/layout.tsx` — title template
- `app/(app)/projects/page.tsx` — metadata description
- `app/(app)/projects/[id]/page.tsx` — `generateMetadata()`
- `app/api/projects/route.ts` — Cache-Control header
- `app/api/projects/[id]/route.ts` — Cache-Control header
- `app/api/tasks/route.ts` — Cache-Control header
- `app/api/tasks/[id]/route.ts` — Cache-Control header
