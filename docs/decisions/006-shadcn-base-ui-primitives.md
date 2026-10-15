# 006 — shadcn/ui (Base UI) for UI Primitives

## Context

The site already used a handful of shadcn components (`base-vega` style, built on `@base-ui/react` rather than Radix) next to hand-rolled `<button>`/`<input>` elements and project components in the same `ui/` folder. shadcn's semantic color names (`primary`, `secondary`, `accent`) overlapped the brand tokens in `global.css`, and `accent` collided outright: shadcn's grey hover surface silently overrode brand gold, so `text-accent` rendered grey.

## Decision

- **Every UI primitive** (button, input, select, checkbox, accordion, menu, …) comes from shadcn: `pnpm dlx shadcn add <name>`. No hand-rolled interactive primitives.
- **`src/components/ui/` holds only shadcn files.** Project components built from them (`SectionHeader`, `LogoImage`, cards) live in `src/components/common/` or alongside their page.
- **shadcn files stay close to stock.** Brand comes from tokens in `global.css`, so `shadcn add`/`diff` can still pull upstream fixes. Deliberate small edits are fine; restyle per use via `className` first.
- **Brand tokens fill shadcn's semantic slots:** `--primary`/`--ring` = crimson `#C41E3A`, `--secondary` = green `#1B7A1B`, white foregrounds. `accent` keeps shadcn's meaning (neutral hover surface); brand gold is `gold` / `gold-light` / `gold-dark`.

## Considered Options

- **Drop shadcn, plain Tailwind elements** — fewer deps, but select, navigation menu and accordion would need hand-written keyboard and ARIA behaviour.
- **Make shadcn's `accent` gold** — no renames, but every menu/select hover would turn gold.

## Consequences

- Class merging uses the `cn` package (shadcn's replacement for `clsx` + `tailwind-merge`), re-exported from `@/lib/utils`. Per-use `className` overrides on shadcn components rely on its conflict resolution.
- New shadcn components may use animation utilities (`animate-accordion-down`, `animate-in`, …) that need keyframes in `global.css`; this project does not use `tw-animate-css`.
- Use `gold` for brand yellow. `bg-accent`/`text-accent` now mean the neutral shadcn surface.
