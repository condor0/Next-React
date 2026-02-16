# Day 2 - UI Primitives + State Drills

## Focus
- Build reusable UI primitives: Button, Input, Card, Modal shell.
- Add state drills: derived state, controlled inputs, lists with keys.
- Add toast system and loading skeleton demo.

## Implementation notes
- Primitives live in src/components and accept standard HTML props.
- State is derived via useMemo (filtered notes, counts) instead of duplication.
- Toast context is split into provider and hook for Fast Refresh safety.

## Demo checklist
- Toast buttons trigger success/neutral/error messages.
- Skeleton toggles with a loading flag.
- Lists render with stable keys (collections, notes).
