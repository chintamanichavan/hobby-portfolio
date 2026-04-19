# hobby-portfolio

A personal site for the non-engineering parts of life — photography, poetry, travel, cooking, guitar. Built as a single-page React app, deployed statically.

## Stack

React 19, TypeScript, Vite, React Router 7. Image gallery uses `yet-another-react-lightbox`. CSS modules; no UI framework.

## Run locally

```sh
pnpm install
pnpm dev
```

## Build

```sh
pnpm build       # outputs to dist/
pnpm preview     # serve the built bundle
```

## Structure

- `src/pages/` — one route per hobby (Photography, Poetry, Travel, Cooking, Guitar, Home)
- `src/data/` — content lives here, not in components (poems, recipes, travel logs)
- `src/components/` — shared UI (Nav, VideoModal)

## Status

Personal site; content updated as the hobbies evolve.
