# 008 — Publicity, not Banners

## Context

"Banner" named three things: the whole system (`src/banners/`, `/banners/`), one rendered image (the `Banner` type), and a printed flex hung at the venue. Every output so far is an invitation (WhatsApp card, Instagram post), and a print flex Format is coming, so the word would soon mean both the system and one of its Formats.

## Decision

Use the `GLOSSARY.md` terms everywhere: **Publicity** is everything rendered for an Edition; an **Invitation** is sent to people; a **Banner** is only the printed flex.

- Code, URLs and output move from `banners` to `publicity`: `src/publicity/`, `/publicity/<year>/<programme>/<format>/`, `public/publicity/assets/`, `dist/publicity/`, `pnpm publicity` / `build:publicity`, `docs/publicity.md`.
- The merged programme + edition object is `ResolvedEdition` (`edition.ts`, `resolveEdition`, `allEditions`); it is the same for every Format, so it isn't named after an image.
- Prefixed types lose the prefix: `Format`, `Theme`, `Logo`. Layouts: `PublicityLayout.astro`, `PublicityPreviewLayout.astro`, `LivePublicity.tsx`.
- Marathi labels on the pages ("निमंत्रणे व बॅनर") are content, not code, and are unchanged.

## Considered Options

- **Keep `/banners/` URLs, rename only code**: no broken links, but a URL and code that disagree. Rejected: the site is in alpha, so breaking the few links already shared is acceptable.
- **Glossary and docs only**: cheapest, but leaves `Banner` meaning one thing in the code and another in the glossary.

## Consequences

- Links to `/banners/...` (including PNGs shared on WhatsApp) return 404; GitHub Pages can't redirect.
- Drafts saved in the try-out editor under the old `banner-draft:` key are not picked up.
- ADR 007's paths predate this rename.
