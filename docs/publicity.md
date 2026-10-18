# Publicity: invitations and banners

Every programme's Publicity (its WhatsApp and Instagram invitations, and later its printed flex banners) is built from the same templates, so each year is a content edit, not a redesign. Terms are defined in `GLOSSARY.md`.

## Make next year's Publicity

1. Copy last year's edition, e.g. `src/content/editions/2026/grahak-peth.yaml` → `src/content/editions/2027/grahak-peth.yaml`.
2. Change `days` and `venue`. Dates are `2027-10-23`, times are 24-hour in quotes: `"16:00"`.
3. `pnpm dev` and open `http://localhost:4321/publicity/2027/grahak-peth/whatsapp/`. It reloads as you edit.
4. Push to `main`. The deploy renders the images and publishes them at
   `sanjeevaniparivar.org/publicity/2027/grahak-peth/whatsapp.png` (also `@2x.png` for print, and `.pdf`).

The same works for every programme (e.g. `editions/2025/akashkandil-karyashala.yaml`). If the date isn't fixed yet, add `draft: true` to the new edition: it shows in `pnpm dev` but isn't published until you remove the line.

Preview and download every format of an edition at `/publicity/2027/grahak-peth/`; `/publicity/` lists all editions. In `pnpm dev` the images don't exist yet, so the live page is shown instead.

Render locally: `pnpm build && pnpm publicity` (writes into `dist/publicity/…`). First time only: `pnpm exec playwright install chromium`.

Weekdays, Marathi numerals, the year and "सकाळी / दुपारी / रात्री" are generated; never type them. The build fails with a clear message if a date or time is malformed, the programme name is misspelt, or the dates don't match the year folder. Rendering fails if text overflows the image.

## Templates and formats

Each programme has a `type`, and every programme of that type uses the same template, every year. Only the YAML changes. ग्राहक पेठ is a `fair`.

| Type | Programmes | Middle section | Template |
|---|---|---|---|
| `fair` | ग्राहक पेठ | list of attractions (`items`) | `src/publicity/templates/fair/` |
| `workshop` | आकाशकंदील कार्यशाळा (also suits शाडूमाती गणेशमूर्ती) | numbered terms (`rules`), a highlighted `note`, `contacts` for registration | `src/publicity/templates/workshop/` |
| `drive` | स्वच्छता अभियान (also suits वृक्षारोपण, समुद्र किनारा स्वच्छता) | none: a large intro and the call to join (`closing`, the `emphasis` line set large); optional `items` and `contacts` | `src/publicity/templates/drive/` |

A template has one layout per format:

| Format | Size | Use | Layout file in each type folder |
|---|---|---|---|
| `whatsapp` | 1080×1920 (9:16) | WhatsApp card; also works as an Instagram or WhatsApp story | `Whatsapp.tsx`, every section |
| `instagram` | 1080×1350 (4:5) | Instagram feed post | `Instagram.tsx`, compact sizes; leaves out long paragraphs for the post caption (fair: intro + closing; workshop: intro + the registration sentence) |

A programme lists the formats it needs: `formats: [whatsapp, instagram]`. The build fails if its type has no layout for one of them.

## Template gallery and try-out editor (for trust members)

- `/publicity/templates/` shows every template in every format, filled with sample content. Share this link; it isn't linked from the site or indexed.
- `/publicity/templates/<type>/` ("वापरून पहा") lets a member type their programme's details into a Marathi form and see every format update live, with a warning if text doesn't fit. Nothing is saved on the site (the draft stays in their browser). "कॉपी करा" / "WhatsApp वर पाठवा" sends you the programme + edition YAML to add to `src/content/`.
- Each type's sample lives in `src/publicity/templates/<type>/sample.ts`, deliberately near the template's limits. Sample pages are rendered in CI too, so a template change that makes the sample overflow fails the build.
- Long titles shrink to fit between the side ornaments (`src/publicity/fit.ts`, marked `data-fit`); render waits for `html[data-publicity-ready]`.

## How it fits together

| File | What it holds | Changes |
|---|---|---|
| `src/content/programmes/<name>.yaml` | Title, organisers, logos, theme, formats, all standard wording | Rarely |
| `src/content/editions/<year>/<name>.yaml` | Dates, venue, and any wording that differs this year | Every year |
| `src/publicity/themes/*.ts` | Colours and which decoration goes in which slot | New theme |
| `src/publicity/logos.ts` + `public/publicity/assets/logos/` | Partner logos by id | New partner |
| `src/publicity/templates/<type>/` + `templates/index.ts` | One React layout per format (`Whatsapp.tsx`, …) + `sample.ts` for each programme type | New type or format |
| `src/publicity/formats.ts` | Format sizes and labels | New format |
| `src/publicity/blocks/` | Shared React pieces: `Frame`, `HeaderLogos`, `Organisers`, `TitleBlock`, `WhenWhere` (date band), `ItemsList`, `NumberedList`, `NoteBox`, `Contacts`, `Closing`, `FooterLine`, `DecorRow` | Rarely |
| `src/publicity/edition.ts`, `draft.ts` | Merging programme + edition into a `ResolvedEdition`; the editor's form ↔ YAML (tested) | Rarely |
| `src/publicity/fit.ts` | Shrinks long titles to fit between the side ornaments | Rarely |
| `src/publicity/LivePublicity.tsx`, `src/components/publicity/TemplateEditor.tsx` | Live preview on sample pages; the try-out editor form | New type's fields |
| `src/lib/marathi.ts` | Dates, times, numerals, list joining (tested: `pnpm test`) | Rarely |

An edition can override any programme wording for one year by repeating the field (e.g. `items:`). Lists are replaced whole.

In text, `{{ fullTitle }}` becomes the title plus the Marathi year, `{{ year }}` the Marathi year, and `{{ yearsRunning }}` the number of years since the programme's `startedYear` (e.g. "गेली {{ yearsRunning }} वर्षे" → "गेली ८ वर्षे" in 2025).

Phone numbers in `contacts` are written in ordinary digits (`phone: "9028265426"`, so they stay dialable) and shown in Marathi numerals on the image.

An edition with `draft: true` (e.g. next year's, before the date is fixed) shows in `pnpm dev` but is never built or published. Remove the line once the details are confirmed.

### Extending

- **New programme of an existing type**: add `programmes/<name>.yaml` + `editions/<year>/<name>.yaml`. No code.
- **New partner logo**: add a transparent PNG to `public/publicity/assets/logos/` (or reuse an existing public file, as the Sanjeevani logo reuses `/assets/brand/sanjeevani-parivar-symbol.png`) and register its path in `src/publicity/logos.ts`.
- **New theme**: add `src/publicity/themes/<name>.ts` (all colour slots, any decoration slots) and register it in `themes/index.ts`. Decoration slots: `pattern`, `top`, `titleBack`, `titleSides`, `bottomRow`. Leave a slot out to keep it empty. Optional: `fonts` (a Google Fonts title font + weight, replacing Rozha One) and `palette` (colours for numbered-point circles).
- **New format** (square post, flex banner): add its size to `src/publicity/formats.ts`, write `templates/<type>/<Format>.tsx` for each type that needs it (the shared `Frame` draws paper, pattern and border; blocks take `compact` for shorter formats), register it in `templates/index.ts`, then list it in a programme's `formats`.
- **New programme type** (lecture series, competition, camp): add `src/publicity/templates/<type>/` with a React layout per format built from the shared blocks plus a block for its middle section, and a `sample.ts`; register it (label, description, layouts, sample, `editorSections`) in `templates/index.ts`; add the type and its fields to the `programmes` schema in `src/content.config.ts`, and to `ResolvedEdition` in `edition.ts`. It then appears in the gallery automatically; for fields the editor doesn't know yet, add them to `draft.ts` (and its round-trip test) and a section to `TemplateEditor.tsx`.

### Themes

| Theme | Used by | Look |
|---|---|---|
| `diwali` | ग्राहक पेठ | cream paper, kumkum/maroon/marigold, mango-leaf toran, star akashkandil, diyas, Rozha One |
| `kalaDalan` | आकाशकंदील कार्यशाळा (children) | off-white paper, kshetra colours + marigold, paper-flag bunting (पताका), paper box-lanterns, शिक्षण-blue band, Baloo 2 titles, numbered circles |
| `paryavaran` | स्वच्छता अभियान, वृक्षारोपण | pale green paper with faint leaves, leaf vine along the top, trees beside the title, dark-green band, saplings in clay pots, Rozha One |

Styling is Tailwind, from `src/publicity/publicity.css`, separate from the site's `global.css`. Theme colours are classes like `bg-ground`, `text-deep`, `text-band-accent`. Fonts: `font-display` (Rozha One, or the theme's own title font, e.g. Baloo 2), `font-ornate` (Tiro Devanagari Marathi), `font-body` (Mukta), loaded from Google Fonts (`PublicityLayout.astro`). Rendering fails if any of them doesn't load, so an image is never drawn in a fallback font.

## Design rules

- Traditional Marathi invitation look, not glossy or "AI-ish": no gradients, glows or emoji, and no Inter/Roboto/Arial.
- Diwali palette: paper cream `#FBF1DC` with a faint paisley pattern, kumkum `#9C1C1C`, maroon `#6A1414`, marigold text `#B8650C`, ink `#2A1810`.
- Children's workshops (`kalaDalan`): playful but still flat and traditional, built from the site's kshetra colours (शिक्षण blue `#1565C0`, crimson `#C2185B`, green `#2E7D32`, purple `#6A1B9A`) plus marigold `#F59E0B` on off-white `#FFFCF5`; Baloo 2 for titles.
- Type: Rozha One for big titles (Baloo 2 in the children's `kalaDalan` theme), Tiro Devanagari Marathi for headings and ornaments, Mukta for body. `<html lang="mr">` so ल and श use Marathi forms.
- Fair WhatsApp layout, top to bottom: toran → logos either side of "॥ सस्नेह निमंत्रण ॥" + tagline → organisers line (names bold) → title with mandala behind and akashkandil either side → intro → maroon दिनांक/स्थळ band → items in two columns with marigold bullets + "आणि बरेच काही…" → closing paragraphs → footer line between gold rules → row of diyas.
- Workshop WhatsApp layout, top to bottom: top border → logo + "॥ संजीवनी कलादालन ॥" → title with lanterns either side → intro → दिनांक/स्थळ band → "महत्त्वाची माहिती" numbered terms → वि. सू. note box → संपर्क (registration line, names + numbers in two columns) → bottom row.
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
