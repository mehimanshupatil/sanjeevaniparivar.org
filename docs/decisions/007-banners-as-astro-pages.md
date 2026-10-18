# 007 — Banners as Astro Pages, Rendered in the Deploy

> Renamed to Publicity by [008](008-publicity-naming.md): read `banners` paths below as `publicity`.

## Context

Each programme needs a WhatsApp invitation and printed banners every year. A first version lived in a separate `banners/` folder: Nunjucks templates, its own `package.json`, a file:// render through Playwright, and a separate CI workflow. Its output couldn't be viewed on the site, and every new format meant copying a whole template.

## Decision

Banners are Astro pages in this site: `/banners/<year>/<programme>/<format>/`.

- Content is two YAML collections: `programmes` (fixed) and `editions` (one per year), validated by schemas in `src/content.config.ts`.
- Layouts are React components built from shared blocks in `src/banners/blocks/`, styled with Tailwind from a separate `src/banners/banner.css`. Astro renders them to static HTML for real banners; the template try-out editor renders the same components live in the browser (that's why they're React, not `.astro`).
- After `astro build`, `scripts/render-banners.mjs` screenshots each page with Playwright into `dist/banners/` (PNG 1×, PNG 2×, PDF), so images deploy with the site. Playwright is a pinned dev dependency.

## Considered Options

- **Keep the separate Nunjucks tool, copy its images into the site**: no browser in the site build, but two template systems and no live preview.

## Consequences

- The deploy installs Chromium (about a minute) and fails if a banner's text overflows.
- Banner pages must not import `src/styles/global.css`; site fonts, the 18px base size and brand colours would shift the layout. `global.css` excludes `src/banners` from its Tailwind scan.
- Banner fonts load from Google Fonts like the site's (the first version committed TTFs; switched to the CDN to keep binaries out of the repo). Rendering needs network access, and `render-banners.mjs` fails if any banner font doesn't load. Google may update font files, so renders can shift slightly between years; check overflow warnings.
- Banner pages are `noindex` and excluded from the sitemap; they're render targets, not site pages.
- Banner pages carry one small script (`fit.ts`) that shrinks long titles to fit; rendering waits for it.
