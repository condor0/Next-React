# Day 1 - Setup + Tailwind + Baseline Layout

## Setup steps
- Vite + React + TypeScript scaffolded at repo root.
- Tailwind CSS wired with PostCSS and base styles in src/index.css.
- ESLint configured with TypeScript + React hooks + Prettier.
- Prettier config added with a lightweight rule set.

## Decisions
- Keep app as a single SPA entry with a basic shell layout (header, sidebar, main).
- Use Tailwind utility classes for layout and a few CSS variables for theming.
- Provide a skip link and focus styles for keyboard navigation.

## Scripts
- dev: start Vite dev server.
- build: typecheck + build.
- lint: run ESLint.
- test: placeholder until tests are added.
- format: Prettier check.
