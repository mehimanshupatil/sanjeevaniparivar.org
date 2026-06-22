# 002 — Custom Bilingual System (mr/en objects)

## Context

The site is bilingual: Marathi (default) and English. Standard i18n libraries (i18next, react-intl, next-intl) are designed for URL-based locale routing (`/en/about`, `/mr/about`). This site uses a single URL with an in-page language toggle — a pattern those libraries handle poorly.

## Decision

All user-facing strings are plain `{ mr: string; en: string }` objects. A `LangProvider` context holds the active language. The `useT()` hook returns a translator function: `t({ mr: '...', en: '...' })` → the active string.

Translations are colocated with components or centralised in `src/i18n/translations.ts` for shared strings.

## Consequences

- No external i18n dependency, no routing changes, no JSON namespace files.
- Adding a third language means changing the type and every call site — intentionally painful to deter scope creep.
- TypeScript ensures both languages are always provided; a missing translation is a compile error.
- Not suitable if the site ever needs SEO-indexed separate language URLs.
