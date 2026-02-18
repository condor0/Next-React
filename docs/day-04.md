# Day 4 - Forms + Validation (RHF + Zod)

## Focus
- Build accessible forms with React Hook Form and Zod validation.
- Standardize form fields, labels, and error messaging.
- Persist project data so create/edit flows share the same source.

## Implementation notes
- FormField composes label, hint, and error with aria-describedby wiring.
- ProjectForm is shared between create and edit flows to avoid duplication.
- Project data is stored in localStorage with a small in-memory fallback.

## Demo checklist
- Login form shows validation errors and disables submit while pending.
- Project create adds a new entry and navigates to edit view.
- Project detail loads stored data and updates the snapshot after save.
