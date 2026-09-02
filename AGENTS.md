<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ICAN financing portal conventions

## Product scope

- This application serves financing offices participating in ICAN's wholesale financing activity.
- The interface is Hebrew-first, right-to-left, and responsive from mobile through desktop.
- Never add real ICAN, office, customer, application, or transaction data. Use obviously fictional fixtures from `src/data/mocks`.
- Authentication and business screens are not part of the initialization phase.

## Architecture

- Use Next.js App Router and React Server Components by default. Add `"use client"` only when browser state, effects, or browser APIs require it.
- The frontend must never communicate with Origami directly.
- All future Origami calls must originate on the server and pass through `src/server/services/origami`.
- Keep Origami credentials, transport code, vendor-shaped types, mapping, and error normalization inside that service boundary.
- UI code should consume application-owned types rather than Origami response shapes.
- Route handlers and server actions validate inputs at the server boundary and must not expose secrets or raw upstream errors.

## Source organization

- `src/app`: routes, layouts, loading/error states, route handlers, and server actions.
- `src/components`: reusable UI; group components by feature and reserve `layout` for shared chrome.
- `src/data/mocks`: fictional fixtures used for local development and tests.
- `src/server/services`: server-only external-service boundaries.
- Use the `@/*` alias for imports from `src`.

## TypeScript and React

- Keep TypeScript strict; do not use `any` when `unknown`, a generic, or a concrete type is appropriate.
- Prefer named exports for reusable modules and components. App Router route files may use the required default export.
- Keep components focused, accessible, and server-rendered unless interactivity requires otherwise.
- Do not access environment variables from client components. Public variables must be explicitly prefixed with `NEXT_PUBLIC_` and reviewed before use.

## Hebrew, RTL, and responsive UI

- Preserve `lang="he"` and `dir="rtl"` on the root `<html>` element.
- Write user-facing copy in Hebrew unless the product requirement says otherwise.
- Prefer CSS logical behavior and Tailwind utilities that remain correct in RTL; avoid hard-coded left/right assumptions.
- Build mobile-first and verify common mobile and desktop widths.
- Meet semantic HTML, keyboard, focus, label, and color-contrast accessibility requirements.

## Styling

- Use Tailwind utilities and the design tokens in `src/app/globals.css`.
- Add reusable components or tokens instead of repeating long style patterns.
- Do not introduce another styling system without an explicit architectural decision.

## Quality and security

- Before handing off a change, run `npm run lint`, `npm run typecheck`, and `npm run build`.
- Add tests alongside business behavior once a test stack is introduced.
- Never commit secrets, credentials, production payloads, or personal data.
- Keep dependencies minimal and explain additions that affect architecture or the client bundle.
- Update this file and the README when conventions or setup steps change.
