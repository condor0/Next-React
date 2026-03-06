# Day 09 - Accessibility + UX polish

## Focus
- Keyboard navigation sweep for modals, forms, and menus.
- Focus management with escape-to-close and focus return.
- A11y notes covering headings, landmarks, and contrast.

## Implementation notes
- Modal now traps focus, sets initial focus, and restores focus on close.
- Dialog triggers declare aria-haspopup and aria-controls for clarity.
- Errors announce via live regions for form fields and error states.
- Navigation landmarks include labeled nav regions.

## A11y checklist
- Headings follow a clear hierarchy (page H2s under the app H1).
- Landmarks present: header, primary nav, main content, sidebar nav.
- Contrast is checked for labels, status tags, and error messaging.
- Keyboard only: no traps, modal cycles within controls, escape closes.
- Errors are announced and readable for validation and API states.

## How to test
- Open a modal, tab through controls, press Escape, and confirm focus returns.
- Use only keyboard to navigate header and sidebar menus.
- Trigger form errors and confirm they are read by screen readers.
