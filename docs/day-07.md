# Day 07 - Tasks feature: CRUD + status transitions (Kanban basics)

## Summary
- Implemented tasks list per project, grouped by status (todo/doing/done).
- Created Task Create/Edit form with status transitions.
- Added optimistic UI updates for create/edit/move operations.
- Implemented status transition rules (adjacent moves only).
- Status rules tested with console assertions in dev mode.

## Features
- Task CRUD operations with TanStack Query
- Kanban board view with three columns (Todo, Doing, Done)
- Move tasks between adjacent statuses only
- Optimistic updates keep UI responsive during simulated slow network (700ms delay)
- Task edit modal with restricted status options based on current state

## Status Transition Rules
- Todo ↔ Doing ✓
- Doing ↔ Done ✓
- Todo → Done ✗ (blocked)
- Done → Todo ✗ (blocked)

## How to test
- Navigate to a project detail page
- Create tasks and move them between status columns
- Try editing tasks - status dropdown shows only valid transitions
- Notice UI remains usable during saves (optimistic updates)
