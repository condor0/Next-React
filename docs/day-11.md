# Day 11 - Next.js migration build fixes

## Focus

- Resolve all build and dev-server errors after migrating from Vite + React Router to Next.js App Router.
- Align TypeScript, bundler, and routing configuration for the new framework.

## Implementation notes

- Restructured tsconfig.json so Next.js can resolve the `@/*` path alias (`./src/*`); the previous project-references-only file had no compilerOptions visible to the Next.js compiler.
- Converted next.config.ts from CommonJS (`module.exports`) to ESM (`export default`) with proper NextConfig typing.
- Excluded legacy Vite-era files from the TypeScript include (App.tsx, main.tsx, layouts/, routes/, pages/, page-components/) to avoid errors from missing react-router-dom.
- Replaced Vite-specific `import.meta.env.PROD` with `process.env.NODE_ENV === 'production'` in taskRules.ts.
- Wrapped `useSearchParams()` calls in `<Suspense>` boundaries across login, projects, and project-detail pages as required by Next.js App Router static generation.
- Updated ProjectDetailPage params type from `{ id: string }` to `Promise<{ id: string }>` (Next.js 16 requirement) and unwrapped with `React.use()`.
- Added a root `/` redirect to `/login` in next.config.ts since there is no app/page.tsx.

## How to test

- Run `npm run build` and confirm zero errors with successful static generation.
- Run `npm run dev` and confirm the dev server starts without warnings.
- Visit `/` and verify it redirects to `/login`.
- Sign in and navigate through dashboard, projects, and project detail pages.
