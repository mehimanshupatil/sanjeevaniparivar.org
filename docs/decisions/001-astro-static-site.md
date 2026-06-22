# 001 — Astro Static Site with React Islands

## Context

The site is a public-facing NGO website with bilingual content (Marathi + English). It needs fast load times, good SEO, and low hosting cost. Content changes infrequently. The team has React familiarity but no need for a full SPA.

## Decision

Use **Astro 6** as the framework, generating a fully static site (`output: 'static'`). Interactive components (Navbar, GalleryPage, VyakhyanmalaTable, etc.) are React islands with `client:load`. Everything else is zero-JS server-rendered HTML.

## Consequences

- Pages load fast — no JS bundle for static content.
- SEO is straightforward — full HTML in response, no hydration race.
- Adding a truly dynamic feature (user accounts, form submissions) would require either an API route or an external service.
- React islands must be explicitly opted in; forgetting `client:load` on an interactive component silently breaks it.
