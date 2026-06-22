# 004 — Structured Content in TypeScript Files

## Context

The site has structured content: 4 kshetras, 21 activities, 65 lecture entries, 16 gallery items, events, team members. Options considered: a headless CMS, MDX files, JSON files, or TypeScript files.

## Decision

Structured content lives in **TypeScript files** under `src/content/` (`kshetras.ts`, `vyakhyanmala.ts`, `gallery.ts`, `events.ts`, `team.ts`).

Blog posts are the exception — they use **MDX** via `astro:content` because they have long-form body content and benefit from frontmatter schema validation.

## Consequences

- TypeScript gives compile-time type safety on content — a missing field is a build error, not a runtime 404.
- No CMS dependency, no API calls, no auth tokens. Content is version-controlled alongside code.
- Non-technical NGO members cannot edit content without a developer. This is acceptable for now — content changes are infrequent and go through the maintainer.
- If content editing frequency increases, migrate structured content to a Git-based CMS (Decap, Keystatic) that writes to the same files.
