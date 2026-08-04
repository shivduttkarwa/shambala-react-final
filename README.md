# Shambala Homes

Static React front-end for Shambala Homes. React 19 + TypeScript + Vite, animated
with GSAP, sliders via Swiper, some 3D via three.js.

All content is authored in-repo — there is no CMS or API backend.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Script              | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Dev server with HMR on port 3000                            |
| `npm run build`     | Production build to `build/`                                |
| `npm run build:gh`  | Build for GitHub Pages (base `/shamb-react-wag/`)           |
| `npm run build:ftp` | Build for a domain root (base `/`)                          |
| `npm run preview`   | Serve the production build locally                          |
| `npm run lint`      | ESLint over the repo                                        |

Note: `npm run build` picks its base path from `VITE_BASE`, falling back to
`/shamb-react-wag/` when `NODE_ENV=production`. Use `build:ftp` if you are
deploying to the root of a domain.

## Layout

```
index.html            Vite entry
src/
  main.tsx            App bootstrap
  App.tsx             Router and route table
  pages/              One component per route
  components/
    Layout/           Header, Footer, overlay menu
    Home/ About/ Projects/ Services/ Contact/
    Reusable/ UI/     Shared presentational pieces
  data/               Static content (blog posts)
  lib/                GSAP helpers
  styles/             Global stylesheet
public/               Static assets copied verbatim (images, fonts, favicon)
```

## Content

Editable content lives in `src/data/` and directly in the page components.
Images and video are served from `public/images/`.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which runs
`npm ci && npm run build` and publishes `build/` to GitHub Pages.
