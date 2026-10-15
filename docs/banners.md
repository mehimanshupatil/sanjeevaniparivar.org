# Banners and invitation cards

Every programme's WhatsApp invitation and printed banners are built from the same templates, so each year is a content edit, not a redesign.

## Make next year's banner

1. Copy last year's edition, e.g. `src/content/editions/2026/grahak-peth.yaml` → `src/content/editions/2027/grahak-peth.yaml`.
2. Change `days` and `venue`. Dates are `2027-10-23`, times are 24-hour in quotes: `"16:00"`.
3. `pnpm dev` and open `http://localhost:4321/banners/2027/grahak-peth/whatsapp/`. It reloads as you edit.
4. Push to `main`. The deploy renders the images and publishes them at
   `sanjeevaniparivar.org/banners/2027/grahak-peth/whatsapp.png` (also `@2x.png` for print, and `.pdf`).

Preview and download every format of an edition at `/banners/2027/grahak-peth/`; `/banners/` lists all editions. In `pnpm dev` the images don't exist yet, so the live banner is shown instead.

Render locally: `pnpm build && pnpm banners` (writes into `dist/banners/…`). First time only: `pnpm exec playwright install chromium`.

Weekdays, Marathi numerals, the year and "सकाळी / दुपारी / रात्री" are generated; never type them. The build fails with a clear message if a date or time is malformed, the programme name is misspelt, or the dates don't match the year folder. Rendering fails if text overflows the banner.

## Templates and formats

Each programme has a `type`, and every programme of that type uses the same template, every year. Only the YAML changes. ग्राहक पेठ is a `fair`.

| Type | Programmes | Middle section | Template |
|---|---|---|---|
| `fair` | ग्राहक पेठ | list of attractions (`items`) | `src/banners/templates/fair/` |

A template has one layout per format:

| Format | Size | Use | Fair layout |
|---|---|---|---|
| `whatsapp` | 1080×1920 (9:16) | WhatsApp card; also works as an Instagram or WhatsApp story | `Whatsapp.astro`, every section |
| `instagram` | 1080×1350 (4:5) | Instagram feed post | `Instagram.astro`, compact sizes, no intro or closing paragraphs (put those in the post caption) |

A programme lists the formats it needs: `formats: [whatsapp, instagram]`. The build fails if its type has no layout for one of them.

## How it fits together

| File | What it holds | Changes |
|---|---|---|
| `src/content/programmes/<name>.yaml` | Title, organisers, logos, theme, formats, all standard wording | Rarely |
| `src/content/editions/<year>/<name>.yaml` | Dates, venue, and any wording that differs this year | Every year |
| `src/banners/themes/*.ts` | Colours and which decoration goes in which slot | New theme |
| `src/banners/logos.ts` + `public/banners/assets/logos/` | Partner logos by id | New partner |
| `src/banners/templates/<type>/` + `templates/index.ts` | One layout per format for each programme type | New type or format |
| `src/banners/formats.ts` | Format sizes and labels | New format |
| `src/banners/blocks/` | Shared pieces: frame, logos row, organisers, title, date band, list, closing, footer, decoration row | Rarely |
| `src/lib/marathi.ts` | Dates, times, numerals, list joining (tested: `pnpm test`) | Rarely |

An edition can override any programme wording for one year by repeating the field (e.g. `items:`). Lists are replaced whole.

In text, `{{ fullTitle }}` becomes the title plus the Marathi year, and `{{ year }}` the Marathi year.

### Extending

- **New programme of an existing type**: add `programmes/<name>.yaml` + `editions/<year>/<name>.yaml`. No code.
- **New partner logo**: add a transparent PNG to `public/banners/assets/logos/` (or reuse an existing public file, as the Sanjeevani logo reuses `/assets/brand/sanjeevani-parivar-symbol.png`) and register its path in `src/banners/logos.ts`.
- **New theme**: add `src/banners/themes/<name>.ts` (all colour slots, any decoration slots) and register it in `themes/index.ts`. Decoration slots: `pattern`, `top`, `titleBack`, `titleSides`, `bottomRow`. Leave a slot out to keep it empty.
- **New format** (square post, flex banner): add its size to `src/banners/formats.ts`, write `templates/<type>/<Format>.astro` for each type that needs it (the shared `Frame` draws paper, pattern and border; blocks take `compact` for shorter formats), register it in `templates/index.ts`, then list it in a programme's `formats`.
- **New programme type** (lecture series, competition, camp): add `src/banners/templates/<type>/` with a layout per format built from the shared blocks plus a block for its middle section, register it in `templates/index.ts`, and add the type and its fields to the `programmes` schema in `src/content.config.ts`.

Styling is Tailwind, from `src/banners/banner.css`, separate from the site's `global.css`. Theme colours are classes like `bg-ground`, `text-deep`, `text-band-accent`. Fonts: `font-display` (Rozha One), `font-ornate` (Tiro Devanagari Marathi), `font-body` (Mukta), loaded from Google Fonts (`BannerLayout.astro`). Rendering fails if any of them doesn't load, so a banner is never drawn in a fallback font.

## Design rules

- Traditional Marathi invitation look, not glossy or "AI-ish": no gradients, glows or emoji, and no Inter/Roboto/Arial.
- Diwali palette: paper cream `#FBF1DC` with a faint paisley pattern, kumkum `#9C1C1C`, maroon `#6A1414`, marigold text `#B8650C`, ink `#2A1810`.
- Type: Rozha One for big titles, Tiro Devanagari Marathi for headings and ornaments, Mukta for body. `<html lang="mr">` so ल and श use Marathi forms.
- Fair WhatsApp layout, top to bottom: toran → logos either side of "॥ सस्नेह निमंत्रण ॥" + tagline → organisers line (names bold) → title with mandala behind and akashkandil either side → intro → maroon दिनांक/स्थळ band → items in two columns with marigold bullets + "आणि बरेच काही…" → closing paragraphs → footer line between gold rules → row of diyas.
- Samved Jagran Manch (सामवेद जागरण मंच) has no logo, so it appears only in the organisers line. Spell it जैमुनी सहकारी पतपेढी मर्यादित, as on its seal.
- A Ganesh image at the top was considered and declined. Don't add it unless asked.

## Marathi text standards

- Proofread every Marathi string. Use formal written Marathi, e.g. "बरेच काही" not "बरंच काही".
- Don't repeat the दिनांक heading as "दि." before each date.
- Use "X ते Y वाजेपर्यंत", not "X वाजता ते Y वाजेपर्यंत". Open-ended: "सकाळी ९.०० वाजल्यापासून". If both times share a period, the second period word is dropped.
- Time-of-day words: पहाटे (4–6), सकाळी (6–12), दुपारी (12–17), सायंकाळी (17–20), रात्री (20–4).
- Suggest wording changes to the content owner before applying them; don't silently rewrite content.

## Archiving

Rendered images are generated on every deploy and never committed. To keep the exact version that was shared, attach the files to a GitHub Release for that programme.
