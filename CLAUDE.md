# Sanjeevani Parivar — sanjeevaniparivar.org

Website for Sanjeevani Parivar, a public trust in Vasai, Maharashtra. Founded 1994. Domain terms (public name vs legal name, founding vs registration) in `GLOSSARY.md`. Bilingual (Marathi + English).

## Stack
- **Astro 7** static site, React islands (`client:load`)
- **Tailwind CSS v4** — theme tokens go in `@theme {}` in `src/styles/global.css`, NOT in `tailwind.config.mjs` (plugins only)
- **pnpm** as package manager
- **@phosphor-icons/react** for UI icons; **@icons-pack/react-simple-icons** for brand icons (SiYoutube, SiFacebook, SiInstagram, SiWhatsapp)
- `@/*` aliases to `src/*`

## Base components
- UI primitives (button, input, select, checkbox, accordion, …) come from **shadcn** (`base-vega` style, Base UI): `pnpm dlx shadcn add <name>` — no hand-rolled primitives
- `src/components/ui/` = shadcn files only, kept near stock; project components go in `src/components/common/`
- Brand comes from tokens in `global.css` (`--primary`, `--secondary`, `--ring` = brand colors); restyle per use via `className`
- Class merging uses the `cn` package (shadcn's clsx + tailwind-merge replacement), re-exported from `@/lib/utils`; components may import from either
- See `docs/decisions/006-shadcn-base-ui-primitives.md`

## Bilingual system
- Languages: `'mr'` (Marathi, default) | `'en'`
- All user-facing strings are `{ mr: string; en: string }` objects
- `LangProvider` + `useT()` hook — `src/components/LangContext.tsx`
- Translations dictionary — `src/i18n/translations.ts`

## Brand colors
- Primary (crimson): `#C41E3A`
- Secondary (green): `#1B7A1B`
- Gold: `#F5C518` — token `gold` / `gold-light` / `gold-dark`. NOT `accent`: `accent` is shadcn's neutral hover surface
- Kshetra colors: shikshan `#1565C0`, paryavaran `#1B7A1B`, aarogya `#C41E3A`, prabodhana `#6A1B9A`

## Pages
| Route | Component |
|---|---|
| `/` | `App.tsx` |
| `/shikshan` `/paryavaran` `/aarogya` `/prabodhana` | `KshetraPage.tsx` |
| `/[kshetra]/[upakram]` | `UpakramPage.tsx` (21 pages) |
| `/donate` | `DonatePage.tsx` — bank/UPI still placeholder `—` |
| `/gallery` | `GalleryPage.tsx` |
| `/team` | `TeamPage.tsx` — member names are `[नाव]` placeholders |
| `/brand` | `BrandPage.tsx` — logo downloads, colours, fonts, name rules; data in `src/content/brand.ts`, assets in `/public/assets/brand/` |
| `/publicity/[year]/[programme]/[format]` | Bare Publicity pages rendered to PNG/PDF after build (see Publicity below) |
| `/publicity/`, `/publicity/[year]/[programme]/` | Preview + download pages for rendered Publicity (noindex), `PublicityPreviewLayout.astro` |
| `/publicity/templates/`, `/publicity/templates/[type]/` | Template gallery + try-out editor for trust members (`TemplateEditor.tsx`), sample pages at `/publicity/templates/[type]/[format]/` |

## Homepage section order (App.tsx)
HeroSection → AboutSection → KshetraOverview → EventsSection → GalleryTeaser → SocialSection → ContactSection → Footer + BackToTop

## Content files (src/content/)
- `kshetras.ts` — 4 kshetras, 21 activities with slugs + body text
- `vyakhyanmala.ts` — 65 lectures; fields: `lecture_no, edition, year, speaker, topic, youtubeUrl, date`
- `gallery.ts` — 16 items; images expected at `/public/assets/gallery/`
- `events.ts` — upcoming + past events
- `team.ts` — 6 members (names are placeholders)

## Social links (src/lib/social.ts)
YouTube, Facebook, Instagram, WhatsApp (`https://whatsapp.com/channel/0029Vb7kB180VycBzFxlju1O`)

## Publicity (invitations and banners)
- Publicity for recurring programmes: Invitations (WhatsApp, Instagram) now, printed flex Banners later. Terms in `GLOSSARY.md`. Full guide, design rules and Marathi text standards: `docs/publicity.md`. Decisions: `docs/decisions/007-banners-as-astro-pages.md`, `008-publicity-naming.md`
- Content: `src/content/programmes/*.yaml` (fixed) + `src/content/editions/<year>/*.yaml` (dates, venue, per-year overrides; `draft: true` = dev only, not published). Types: `fair` (ग्राहक पेठ), `workshop` (आकाशकंदील कार्यशाळा), `drive` (स्वच्छता अभियान)
- Code: `src/publicity/` (React templates per programme type with `sample.ts`, shared React blocks, formats, themes, logos, `publicity.css`); route `src/pages/publicity/[year]/[programme]/[format].astro` (noindex, not in sitemap)
- Render: `pnpm build && pnpm publicity` → `dist/publicity/<year>/<programme>/<format>{.png,@2x.png,.pdf}`; CI runs `build:publicity` (strict) before deploy
- Publicity pages never import `global.css`. Publicity Tailwind tokens: `bg-ground`, `text-deep`, `font-display`, etc. Themes: `diwali` (ग्राहक पेठ), `kalaDalan` (children's workshops, Baloo 2), `paryavaran` (drives). Gallery + try-out editor: `/publicity/templates/`
- Dates and times only via `src/lib/marathi.ts` (tested: `pnpm test`); never hand-type weekdays or Marathi numerals
- Type-check with `pnpm check` (astro check, also in CI). TypeScript is pinned to 6 — Astro's tooling doesn't support 7 yet
- Formats: `whatsapp` (1080×1920, also a story) and `instagram` (1080×1350 feed post, compact blocks). Possible next steps (ask before starting): landscape print template with bleed, 1080×1080 square post, more themes (Ganeshotsav, Navratri, Gudi Padwa, Sankranti), event page + WhatsApp text from the same YAML

## Coding preferences
- **mailto links**: use `document.createElement('a'); a.href = ...; a.click()` — not `window.location.href`
- **React event types**: `import type { FormEvent } from 'react'` — not `React.FormEvent` (deprecated in React 19)
- **Contact form** sends to `sanjeevani.parivar@gmail.com` via mailto, no backend
- **SocialSection grid**: 5 links total — fix to `lg:grid-cols-5` or adjust layout if adding/removing links
- Keep changes minimal and focused — don't add unrequested features alongside fixes

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`mehimanshupatil/sanjeevaniparivar.org`), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` + ADRs in `docs/decisions/`. See `docs/agents/domain.md`.
