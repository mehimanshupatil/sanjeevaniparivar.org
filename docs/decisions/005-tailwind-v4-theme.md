# 005 — Tailwind v4 Theme Tokens in CSS, Not Config

## Context

Tailwind CSS v4 changes how design tokens are configured. In v3, custom colors, spacing, and fonts were defined in `tailwind.config.mjs` under `theme.extend`. In v4, the canonical approach is a `@theme {}` block in CSS.

## Decision

All design tokens (brand colors, kshetra colors, custom spacing) are defined in **`src/styles/global.css`** inside a `@theme {}` block. The `tailwind.config.mjs` file exists only to register plugins and contains a comment explaining this.

## Consequences

- Tokens defined in `@theme {}` become CSS custom properties automatically (`--color-primary`, etc.) and are available in both Tailwind utilities and inline `style={{}}` props.
- Adding tokens to `tailwind.config.mjs` under `theme` will appear to work locally in some cases but is the wrong pattern for v4 — changes belong in `global.css`.
- A developer familiar with Tailwind v3 will instinctively reach for the config file. The comment in `tailwind.config.mjs` exists to redirect them.
