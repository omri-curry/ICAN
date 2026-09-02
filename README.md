# ICAN Financing Portal

A Hebrew-first web portal for financing offices that participate in ICAN's wholesale financing activity. This repository currently contains the application foundation only; business screens, authentication, and external integrations are intentionally out of scope.

## Technology

- Next.js 16 with the App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Webpack for deterministic production builds (`next build --webpack`)
- ESLint with the Next.js Core Web Vitals and TypeScript rules
- Hebrew (`lang="he"`) and right-to-left (`dir="rtl"`) defaults

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development server reloads when source files change.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

To run the production build locally after `npm run build`:

```bash
npm run start
```

## Project structure

```text
src/
├── app/                         # App Router layouts, pages, and future route handlers
├── components/
│   └── layout/                  # Shared application chrome
├── data/
│   └── mocks/                   # Fictional development fixtures only
└── server/
    └── services/
        └── origami/             # Server-only boundary for future Origami access
```

## Architecture boundaries

The browser must never communicate with Origami directly. When integration work begins, UI code will call server-side route handlers or server actions; those server entry points will use the dedicated service layer under `src/server/services/origami`. Credentials, transport details, Origami-specific models, mapping, and error handling must remain inside that boundary.

There is currently no Origami connection and no authentication. All development data must be fictional and live under `src/data/mocks`; never commit real ICAN, financing-office, customer, or transaction information.

## Interface conventions

The root document is Hebrew and RTL by default. New screens should preserve logical reading order, use CSS logical properties where custom CSS is necessary, and be designed mobile-first. Shared styling tokens are defined in `src/app/globals.css` and exposed through Tailwind utilities.

See [AGENTS.md](./AGENTS.md) for the full engineering conventions.
