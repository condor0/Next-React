# Day 5 - Client State with Zustand

## Focus
- Replace context state with Zustand stores for auth and UI.
- Keep auth and UI slices small and predictable.
- Remove prop drilling for auth and toast flows.

## State slices
- Auth slice: user, token, login, logout (in-memory only).
- UI slice: toasts list + modal state.

## Implementation notes
- Auth store exposes isAuthed via a selector to drive routing and header UI.
- Toasts render through a single ToastViewport component.
- Login form passes the email to the auth store for a user label.

## Demo checklist
- Login sets user + token, routes into the app.
- Logout clears auth state and returns to login.
- Toasts can be fired anywhere without providers.
