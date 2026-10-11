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

## Run in Docker

```sh
docker compose up -d --build   # builds the site and serves it with nginx on :5175
```

The container serves a built copy, so rebuild after changing code.

## Rendered objects

The journal, camera, pen, compass, picks, chai and leaves are modelled and rendered in Blender (4.5 LTS):

```sh
blender -b -P blender/objects.py            # all objects, about two minutes on CPU
blender -b -P blender/objects.py -- compass # just one
```

Images land in `public/media/desk/`. If an object's size changes, copy its new size from `public/media/desk/sizes.json` into `src/data/desk.ts`.

## Structure

- `src/pages/` — one route per hobby (Photography, Poetry, Travel, Cooking, Guitar, Home)
- `src/data/` — content lives here, not in components (poems, recipes, travel logs, photo albums, the desk layout)
- `src/components/` — shared UI (Cover, Spread, Thing, UsMap, Nav, VideoModal)
- `blender/` — the script and fonts that render the objects

## Status

Personal site; content updated as the hobbies evolve.
