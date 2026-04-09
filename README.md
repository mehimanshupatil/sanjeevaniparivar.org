# सanjeevaniparivar.org

Official website of **Sanjeevani Parivar (संजीवनी परिवार)** — a leading social organisation from Vasai, Maharashtra, working since 1994 in Education, Environment, Health & Enlightenment.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | [Astro 6](https://astro.build) (static site, React islands) |
| UI | [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com) |
| Typography | [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) |
| Icons | [lucide-react](https://lucide.dev) + [@icons-pack/react-simple-icons](https://github.com/icons-pack/react-simple-icons) |
| Content | MDX blog collection via `astro:content` |
| Package manager | [pnpm](https://pnpm.io) |

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # production build → dist/
pnpm preview    # preview the build locally
```

## Project Structure

```
src/
├── components/       # React components (Navbar, Footer, sections, pages)
├── content/
│   ├── blog/         # MDX blog posts (bilingual)
│   ├── kshetras.ts   # Kshetra definitions — single source of truth
│   ├── events.ts     # Upcoming & past events
│   ├── gallery.ts    # Gallery items
│   ├── team.ts       # Team members
│   └── vyakhyanmala.ts  # 65 lecture series entries
├── i18n/
│   └── translations.ts  # Marathi + English string dictionary
├── layouts/
│   └── Layout.astro  # Base HTML layout with SEO tags
├── lib/
│   └── social.ts     # Social media links
├── pages/            # Astro file-based routes
└── styles/
    └── global.css    # Tailwind v4 @theme tokens + global styles
public/
└── assets/
    └── uploads/      # Migrated WordPress media
scripts/
├── import-wp-posts.mjs   # Import WordPress posts CSV → MDX
└── import-wp-pages.mjs   # Import WordPress pages CSV → MDX
```

## Bilingual System

The site supports **Marathi (`mr`)** (default) and **English (`en`)**. All user-facing strings use the shape `{ mr: string; en: string }`. Language is toggled via `LangProvider` + `useT()` hook in `src/components/LangContext.tsx`.

## Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#C41E3A` | Crimson — primary brand |
| `--color-secondary` | `#1B7A1B` | Forest green |
| `--color-accent` | `#F5C518` | Gold |
| `--color-education` | `#1565C0` | Shikshan kshetra |
| `--color-environment` | `#1B7A1B` | Paryavaran kshetra |
| `--color-health` | `#C41E3A` | Aarogya kshetra |
| `--color-enlightenment` | `#6A1B9A` | Prabodhana kshetra |

## Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/shikshan` `/paryavaran` `/aarogya` `/prabodhana` | Kshetra overview pages |
| `/[kshetra]/[upakram]` | Individual activity pages (21 total) |
| `/blog` | Blog listing with kshetra filters |
| `/blog/[slug]` | Individual blog post |
| `/gallery` | Photo gallery |
| `/events` | Events (upcoming + past) |
| `/team` | Team members |
| `/donate` | Donation info (bank + UPI) |

## Adding Blog Posts

Place an `.mdx` file in `src/content/blog/` with this frontmatter:

```yaml
---
title: "Post title"
excerpt: "Short description"
author: संजीवनी परिवार
date: "2024-03-15"
kshetra: aarogya          # shikshan | paryavaran | aarogya | prabodhana | general
image: /assets/uploads/2024/03/photo.jpg   # optional
draft: false
---
```

To bulk-import from WordPress CSV exports, use the scripts in `scripts/`.

## About Sanjeevani Parivar

Sanjeevani Parivar is a social organisation founded in 1994 by Samavedis Brahmin youth of Vasai, serving the community spread across twelve villages from Bhuigaon to Agashi. Its four core kshetras (areas of work) are:

- **शिक्षण (Shikshan)** — Student guidance, competitions, reading campaigns
- **पर्यावरण (Paryavaran)** — Tree plantation & conservation since 2005
- **आरोग्य (Aarogya)** — Medical fund & health camps
- **प्रबोधन (Prabodhana)** — Sanjeevani Vyakhyanmala lecture series since 2003

Website: [sanjeevaniparivar.org](https://sanjeevaniparivar.org)
