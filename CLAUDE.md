# Sanjeevani Parivar — sanjeevaniparivar.org

NGO website for Sanjeevani Parivar, Vasai, Maharashtra. Founded 1994. Bilingual (Marathi + English).

## Stack
- **Astro 6** static site, React islands (`client:load`)
- **Tailwind CSS v4** — theme tokens go in `@theme {}` in `src/styles/global.css`, NOT in `tailwind.config.mjs` (plugins only)
- **pnpm** as package manager
- **lucide-react** for UI icons; **@icons-pack/react-simple-icons** for brand icons (SiYoutube, SiFacebook, SiInstagram, SiWhatsapp)
- `@/*` aliases to `src/*`

## Bilingual system
- Languages: `'mr'` (Marathi, default) | `'en'`
- All user-facing strings are `{ mr: string; en: string }` objects
- `LangProvider` + `useT()` hook — `src/components/LangContext.tsx`
- Translations dictionary — `src/i18n/translations.ts`

## Brand colors
- Primary (crimson): `#C41E3A`
- Secondary (green): `#1B7A1B`
- Accent (gold): `#F5C518`
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

## Coding preferences
- **mailto links**: use `document.createElement('a'); a.href = ...; a.click()` — not `window.location.href`
- **React event types**: `import type { FormEvent } from 'react'` — not `React.FormEvent` (deprecated in React 19)
- **Contact form** sends to `sanjeevani.parivar@gmail.com` via mailto, no backend
- **SocialSection grid**: 5 links total — fix to `lg:grid-cols-5` or adjust layout if adding/removing links
- Keep changes minimal and focused — don't add unrequested features alongside fixes
