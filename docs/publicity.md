# Publicity: invitations and banners

Every programme's Publicity (its WhatsApp and Instagram invitations, and later its printed flex banners) is built from the same templates, so each year is a content edit, not a redesign. Terms are defined in `GLOSSARY.md`.

## Make next year's Publicity

1. Copy last year's edition, e.g. `src/content/editions/2026/grahak-peth.yaml` → `src/content/editions/2027/grahak-peth.yaml`.
2. Change `days` and `venue`. Dates are `2027-10-23`, times are 24-hour in quotes: `"16:00"`. A day has `from` (and optional `to`: "… ते … वाजेपर्यंत", or without it "… वाजल्यापासून"), or `at` for a start time ("सकाळी ७.३० वाजता").
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
| `workshop` | आकाशकंदील कार्यशाळा, श्री गणेशमूर्ती कार्यशाळा | numbered terms (`rules`), a highlighted `note`, `contacts` for registration | `src/publicity/templates/workshop/` |
| `plantation` | वृक्षवाढदिवस (also suits वृक्षारोपण) | none: a large intro and the call to join (`closing`, the `emphasis` line set large); optional `items` and `contacts` | `src/publicity/templates/plantation/` |
| `cleanup` | स्वच्छता अभियान (also suits मंदिर / समुद्र किनारा स्वच्छता, प्लास्टिकमुक्त) | slogan strip on top, centred logo, a calendar badge for the date (one day; more days fall back to the date band), the call to join in an outlined box; optional `items` and `contacts` | `src/publicity/templates/cleanup/` |
| `celebration` | मराठी भाषा गौरव दिन (also suits वाचन प्रेरणा दिन, विद्यार्थी गौरव) | a letter strip on top (theme `strip`), logo + invite, calligraphic title over a faint book with `title.sub` in a pill, optional `quote` (`{ text, by }`) set large, the intro beside an optional `portrait`, दिनांक व वेळ and स्थळ as two coloured cards with icon badges, the programme (`note`) in a card with a ribbon label, the request to attend, a letter sign-off from `footer` (two lines: `"आपला\nसंजीवनी परिवार"`) | `src/publicity/templates/celebration/` |
| `lectures` | संजीवनी व्याख्यानमाला | **two kinds of card.** The series card: `title.sub` (`वर्ष {{ editionNo }} वे`), an optional `quote` (the ओवी), intro, a row per session (date tile, photo, speaker, topic), वेळ \| स्थळ, closing, contacts. And one card per session (पुष्प) at `/publicity/<year>/<programme>/<n>/<format>`: photo, name, role, topic, date band, the speaker's `bio`, the session's `closing` (or the series' invitation) | `src/publicity/templates/lectures/` (`Whatsapp`, `Instagram`, `SessionWhatsapp`, `SessionInstagram`) |
| `competition` | संजीवनी वक्तृत्व स्पर्धा | a card per group (`groups: [{ name, who, topics }]`, `groupsHeading`) with its numbered topics, the rule(s) in a dashed box, the parents' `note` in a deep band, registration `contacts`, a letter sign-off; `yearStyle: school` shows the school year ("२०२५-२६") | `src/publicity/templates/competition/` |

A template has one layout per format:

| Format | Size | Use | Layout file in each type folder |
|---|---|---|---|
| `whatsapp` (स्टेटस / स्टोरी) | 1080×1920 (9:16) | WhatsApp status, Instagram and Facebook stories | `Whatsapp.tsx`, every section |
| `instagram` (पोस्ट / संदेश) | 1080×1350 (4:5) | Images sent in WhatsApp chats and groups, Instagram and Facebook feed posts. The chat bubble shows 4:5 whole; a 9:16 card is cut off until tapped | `Instagram.tsx`, compact sizes; leaves out long paragraphs for the post caption (fair: intro + closing; workshop: intro + the registration sentence) |
| `wide` (API संदेश / इव्हेंट कव्हर) | 1200×628 (1.91:1) | The image header of a WhatsApp API template message (`/publicity/whatsapp/`: WhatsApp crops the header to about 1.91:1, so a portrait card loses its top and bottom), a Facebook event cover, a link preview | One shared layout for every type, `templates/wide/Wide.tsx` (lecture sessions: `SessionWide.tsx`): logos, invitation, title and year beside a date/venue panel, the call below. The details go in the message text |

A programme lists the formats it needs: `formats: [whatsapp, instagram, wide]`. The build fails if its type has no layout for one of them.

## Styles: every edition in four looks

Besides its type's own Template ("classic"), every edition is rendered in three more Styles, for every portrait format (`wide` has its one layout only: in a chat bubble the styles look alike). Members pick which to share (e.g. the poster first, the pass as a reminder). The edition's download page lists them all.

| Style | URL | Look |
|---|---|---|
| classic | `/publicity/2026/<programme>/whatsapp.png` | the programme type's Template |
| `poster` (पोस्टर) | `/publicity/2026/<programme>/poster/whatsapp.png` | top half one solid colour block with a huge title and a big faint motif (or the portrait); a giant date; then venue, details and the call; contacts in a coloured footer |
| `rail` (बाजूपट्टी) | `…/rail/whatsapp.png` | full-height coloured column on the left with logo, dates (big numbers), time, venue and contacts; left-aligned content on the right |
| `pass` (प्रवेशिका) | `…/pass/whatsapp.png` | an entry pass on a deep background; the ticket holds title and details, a perforated tear-off stub holds दिनांक / वेळ / स्थळ |

Code: `src/publicity/styles/` — one component per style for every type and both formats (Instagram is the compact version), registered in `styles/index.ts`. Each style shows the type's own details through `styles/Details.tsx` (attractions, terms, group cards, lecture rows, programme note) and uses the edition's Theme colours and decorations. Lecture (session) cards come in the classic style only. A new style: add a component, register it; every edition gets it on the next build, and rendering fails if it overflows anywhere.

## Lecture series: sessions

A `lectures` edition lists `days` and, in the same order, `sessions` (one per day; the build fails if the counts differ):

```yaml
sessions:
  - speaker: { name: प्रा. डॉ. मृदुला दाढे, role: प्रथितयश गायिका, photo: /publicity/assets/people/mrudula-dadhe.jpg }
    topic: तरी असेल गीत हे
    topicNote: (…)          # optional, under the topic
    bio: …                  # optional, the speaker's परिचय on their own card
    closing: …              # optional, this lecture's request to attend
```

Each session is numbered and labelled automatically ("पुष्प पहिले", "पुष्प दुसरे"; a programme can change the word with `sessionWord`). Besides the series card, every session gets its own card per format at `/publicity/2026/vyakhyanmala/1/whatsapp.png`; the edition's download page lists them all. Photos: portrait-shaped, at least 480×600, in `public/publicity/assets/people/`. The try-out editor keeps the sample's sessions but doesn't edit them yet.

## Personal invitations (वैयक्तिक निमंत्रण)

A programme with `personal` wording gets a "वैयक्तिक निमंत्रण" section on its edition page (`/publicity/2026/grahak-peth/`). A member types the guest's name and village ("श्री नाव आडनाव, गाव"), sees the card update, and downloads the PNG or shares it (phones). Names are never stored or sent anywhere; the PNG is made in the browser.

- Wording: `personal: { request, inauguration }` in the programme YAML. `request` can use `{{ organisers }}` (the organisers, joined with "आणि"), `{{ title }}` (without the year) and `{{ fullTitle }}`; `inauguration` uses `{{ by }}` and `{{ when }}` ("शनिवार, दिनांक ३१ ऑक्टोबर २०२६ रोजी सायंकाळी ४.०० वाजता").
- The card follows the wording of a written invitation letter: स्थळ first, then each day as "शनिवार, दिनांक ३१ ऑक्टोबर २०२६" with its वेळ, joined by "आणि". Here "दिनांक" before each date is intended.
- Per year: `inauguration: { by, date, at }` in the edition YAML. Without it the उद्घाटन box is left out.
- Card: `src/publicity/personal/PersonalCard.tsx`, 1080×1350 (4:5, the chat-message size: it is sent to one guest in a WhatsApp chat), page `/publicity/<year>/<programme>/vaiyaktik/instagram/`. The build renders it once with the sample name "आपले नाव, गाव", so an overflowing card fails CI. The edition page shows it in an iframe and posts the name in; `personal/client.ts` re-fits the card and makes the PNG with `modern-screenshot`.

## Message text and link preview

Each edition's download page also gives the text to send with the cards, made from the same YAML by `src/publicity/message.ts` (tested): a WhatsApp message (`*bold*` headings, every detail: dates, venue, attractions, rules, groups, lectures, note, closing, contacts) and an Instagram/Facebook caption (the same without `*`, hashtags at the end). The wide and 4:5 cards leave those details out, so send the text with them. Each has a copy button. No emoji, as on the cards.

The download page's link preview (`og:image`) is the edition's `wide.png`, so a shared link shows the invitation.

## Sending on WhatsApp (`/publicity/whatsapp/`)

A page for trust members to send an approved WhatsApp template to the people in a CSV, through Meta's API, straight from the browser (the site has no server; Graph API allows browser calls). Not linked from the site, noindex.

1. Access token (a System User token with only the WhatsApp permissions), phone number ID and WhatsApp Business Account ID. "या उपकरणावर साठवा" keeps them in this browser's localStorage; "विसरा" removes them.
2. "जोडा" checks the number and loads the APPROVED templates. For a marketing template it shows whether Meta's automatic creative optimizations (image filters, text formatting, …) are on, with a button to turn them all off so the invitation goes as designed.
3. A CSV with a header row (e.g. नाव, गाव, फोन). Numbers are normalised (10-digit Indian mobiles get 91); bad numbers and repeats are not selected. The list is never stored.
4. Pick the invitation (an edition, or one lecture of a series). An image header gets its `wide` card (1200×628, the shape WhatsApp shows a header in, uncropped; the same image for everyone; Meta fetches it, so no uploads), and its details are offered for the placeholders: placeholders named `{{title}}`, `{{date}}`, `{{time}}`, `{{venue}}`, `{{speaker}}`, `{{topic}}` are filled from it at once. Any placeholder (`{{1}}`, `{{name}}`, URL-button variables) can instead come from a CSV column or one text for everyone. The values come from `apiFields` in `src/publicity/message.ts`, one line each (the API refuses new lines). Preview and the exact JSON are shown.
5. Send: one message at a time, status per row, stop, re-send the failed ones, download the results as CSV. Marketing templates go to `/marketing_messages` (falls back to Cloud API by itself), others to `/messages`.

"Sent" only means WhatsApp accepted the message. Meta reports delivered / read / failed only to a webhook, so a small Cloudflare Worker (`workers/whatsapp-webhook/`, setup in its README) receives them, and the page asks it for each sent message every 15 s for 30 minutes after the last send, showing पोहोचला / वाचला / पोहोचला नाही (with Meta's reason) per row, in the counts and in the results CSV. Until the Worker is deployed and `WA_STATUS_URL` is set in `src/lib/whatsapp.ts`, the page shows only "sent". Messages people send to the number are not collected: nobody can read them (the number is API-only), so the Worker auto-replies once a day per person asking them to write to the trust's main WhatsApp number, +91 88477 71994 (needs its `ACCESS_TOKEN` secret).

**#131049 "not delivered to maintain healthy ecosystem engagement"** is the most common failure: Meta's per-person limit on marketing messages (India especially), stricter for a new number with no quality rating and for people who have never written to the trust. Don't resend at once (wait a day or more; repeated sends lower the number's quality). What helps: get people to message the number first (a `wa.me/919404701994` link or QR at programmes and in the channel), start with people who know the trust, and keep invitations as MARKETING templates (calling them UTILITY gets templates rejected). Replies and "STOP" should go to the trust's main number, +91 88477 71994 (in the WhatsApp Business app), so say so in the template. Pure logic and tests: `src/lib/whatsapp.ts`.

### Upkeep

- **Templates are owned by trust members in WhatsApp Manager, not by the site.** The page fetches the approved templates live, so changed wording, a new template, a new placeholder or a different header (image, video, document) needs no code change. Only a component the page doesn't know (carousel, flow, location header) needs code in `src/lib/whatsapp.ts`.
- **The Graph API version is pinned** in `GRAPH` (`src/lib/whatsapp.ts`), now **v26.0**, released 2026-07-29, retirement date not yet announced. Each version lives about two years; Meta emails the app admins and warns on the App Dashboard before it's removed. Check the [versions table](https://developers.facebook.com/docs/graph-api/changelog/versions/) once a year.
- **To upgrade:** read the changelog of each version between the old and the new one for the endpoints below, change `GRAPH`, update the version and date here, run `pnpm test`, then send a template to your own number from `/publicity/whatsapp/`.
- Endpoints used: `GET /<phone-id>`, `GET /<waba-id>/message_templates`, `GET`/`POST /<template-id>` (`degrees_of_freedom_spec`), `POST /<phone-id>/messages`, `POST /<phone-id>/marketing_messages`, and `/<business-id>/owned_whatsapp_business_accounts` + `client_whatsapp_business_accounts` (only when a wrong account ID is entered), `GET /<phone-id>?fields=health_status` (to find the right account), and the debug checks (`debug_token`, `/<waba-id>/phone_numbers`, `/<waba-id>/subscribed_apps`). The newest, so the most likely to change: `marketing_messages` and `degrees_of_freedom_spec`.
- No SDK on purpose: Meta's SDKs are for servers or ads, and a wrapper would need the same version upgrades.

## Template gallery and try-out editor (for trust members)

- `/publicity/templates/` shows every template in every format, filled with sample content. It and the editor below exist only under `pnpm dev` (`devOnlyPages` in `astro.config.mjs`, files in `src/dev-pages/`), never on the live site, where anyone could make official-looking cards with them. The sample cards (`/publicity/templates/<type>/<format>/`) are still built, for the CI check below.
- `/publicity/templates/<type>/` ("वापरून पहा") lets a member type their programme's details into a Marathi form and see every format update live, with a warning if text doesn't fit. Nothing is saved on the site (the draft stays in their browser). "कॉपी करा" / "WhatsApp वर पाठवा" sends you the programme + edition YAML to add to `src/content/`.
- Each type's sample lives in `src/publicity/templates/<type>/sample.ts`, deliberately near the template's limits. Sample pages are rendered in CI too, so a template change that makes the sample overflow fails the build.
- Long titles shrink to fit between the side ornaments (`src/publicity/fit.ts`, marked `data-fit`); render waits for `html[data-publicity-ready]`.
- Cards fill their frame (`fillFrame` in `fit.ts`, marked `data-fill`): a card with little text is enlarged evenly (text, photos and blocks, never wider than the card, up to 1.6×) until it fills about 94% of the height, so a 9:16 card isn't a few small blocks with big gaps. It stops before a title would stop fitting or look smaller. Full cards stay at 1×, so the overflow check still sees them.

## How it fits together

| File | What it holds | Changes |
|---|---|---|
| `src/content/programmes/<name>.yaml` | Title, organisers, logos, theme, formats, all standard wording | Rarely |
| `src/content/editions/<year>/<name>.yaml` | Dates, venue, and any wording that differs this year | Every year |
| `src/publicity/themes/*.ts` | Colours and which decoration goes in which slot | New theme |
| `src/publicity/logos.ts` + `public/publicity/assets/logos/` | Partner logos by id | New partner |
| `src/publicity/templates/<type>/` + `templates/index.ts` | One React layout per format (`Whatsapp.tsx`, …) + `sample.ts` for each programme type | New type or format |
| `src/publicity/formats.ts` | Format sizes and labels | New format |
| `src/publicity/styles/` + `styles/index.ts` | The poster, rail and pass Styles (one component each for every type and format) and `Details.tsx`, each type's details for them | New style |
| `src/publicity/blocks/` | Shared React pieces: `Frame`, `HeaderLogos`, `Organisers`, `TitleBlock`, `WhenWhere` (date band), `CalendarBadge`, `DetailsScroll`, `DetailsCards`, `TimeVenue`, `SloganStrip`, `LetterStrip`, `ItemsList`, `NumberedList`, `NoteBox`, `GroupCards`, `SessionList`, `ProgrammeCard`, `Quote`, `Portrait`, `Contacts`, `Closing`, `Signoff`, `FooterLine`, `DecorRow` | Rarely |
| `src/publicity/edition.ts`, `draft.ts` | Merging programme + edition into a `ResolvedEdition`; the editor's form ↔ YAML (tested) | Rarely |
| `src/publicity/fit.ts` | Shrinks long titles to fit between the side ornaments, then grows a card with little text to fill its frame | Rarely |
| `src/publicity/LivePublicity.tsx`, `src/components/publicity/TemplateEditor.tsx` | Live preview on sample pages; the try-out editor form | New type's fields |
| `src/lib/marathi.ts` | Dates, date parts, times (range or "… वाजता"), school year, ordinals, numerals, list joining (tested: `pnpm test`) | Rarely |
| `src/pages/publicity/[year]/[programme]/` | `[format].astro` (classic card), `[sub]/[format].astro` (a Style, or a lecture session), `index.astro` (download page) | Rarely |
| `public/publicity/assets/decor/`, `people/` | Theme decorations (SVG); photos for portraits and speakers | New theme / photo |

An edition can override any programme wording for one year by repeating the field (e.g. `items:`). Lists are replaced whole.

In text, `{{ fullTitle }}` becomes the title plus the Marathi year, `{{ year }}` the Marathi year, `{{ editionNo }}` the edition's number counting `startedYear` as the first ("वर्ष {{ editionNo }} वे" → "वर्ष २४ वे" in 2026 for 2003), and `{{ yearsRunning }}` the number of years since the programme's `startedYear` (e.g. "गेली {{ yearsRunning }} वर्षे" → "गेली ८ वर्षे" in 2025).

Phone numbers in `contacts` are written in ordinary digits (`phone: "9028265426"`, so they stay dialable) and shown in Marathi numerals on the image.

An edition with `draft: true` (e.g. next year's, before the date is fixed) shows in `pnpm dev` but is never built or published. Remove the line once the details are confirmed.

An edition with `cards: false` is a record only: it appears on the events page (e.g. a past programme from the annual report) but gets no invitation cards. Its days may leave out the time and it may leave out the venue; a `summary` says what happened ("सातवी कार्यशाळा — १३० विद्यार्थी"). Remove `cards: false` and fill in the wording to make cards for it.

### Extending

- **New programme of an existing type**: add `programmes/<name>.yaml` + `editions/<year>/<name>.yaml`. No code.
- **Portrait** (`celebration`): put the photo in `public/publicity/assets/people/` (portrait-shaped, at least 480×600) and add to the programme `portrait: { src: /publicity/assets/people/<file>, caption: महाकवी कुसुमाग्रज, garland: true, credit: … }`. `credit` is a small source line under the caption, for a licence that asks for attribution. `garland` adds a marigold हार: for a tribute (जयंती, स्मृती), not for a living guest. Only use a photo the trust has the right to use.
- **New partner logo**: add a transparent PNG to `public/publicity/assets/logos/` (or reuse an existing public file, as the Sanjeevani logo reuses `/assets/brand/sanjeevani-parivar-symbol.png`) and register its path in `src/publicity/logos.ts`.
- **New theme**: add `src/publicity/themes/<name>.ts` (all colour slots, any decoration slots) and register it in `themes/index.ts`. Decoration slots: `pattern`, `top`, `titleBack`, `titleSides`, `bottomRow` (one file, or a list that alternates). Leave a slot out to keep it empty. Optional: `fonts` (a Google Fonts title font + weight, replacing Rozha One), `palette` (colours for numbered-point circles) and `strip` (letters for a decorative strip, used by `celebration`).
- **New format** (square post, flex banner): add its size to `src/publicity/formats.ts`, write `templates/<type>/<Format>.tsx` for each type that needs it (the shared `Frame` draws paper, pattern and border; blocks take `compact` for shorter formats), register it in `templates/index.ts`, then list it in a programme's `formats`. The Styles render every format with one component (compact below 1500px tall): check them in the new size too.
- **New style**: add `src/publicity/styles/<Name>.tsx` (take `TemplateProps`, mark the content `data-fill`, show the type's details with `<Details>`) and register it in `styles/index.ts`. Every edition gets it on the next build, and its download page lists it.
- **New programme type** (e.g. a camp): add `src/publicity/templates/<type>/` with a React layout per format built from the shared blocks plus a block for its middle section, and a `sample.ts`; register it (label, description, layouts, sample, `editorSections`) in `templates/index.ts`; add the type and its fields to the `programmes` schema in `src/content.config.ts`, and to `ResolvedEdition` in `edition.ts`; add its details to `styles/Details.tsx` so the Styles show them. It then appears in the gallery automatically; for fields the editor doesn't know yet, add them to `draft.ts` (and its round-trip test) and a section to `TemplateEditor.tsx`.

### Themes

| Theme | Used by | Look |
|---|---|---|
| `diwali` | ग्राहक पेठ | cream paper, kumkum/maroon/marigold, mango-leaf toran, star akashkandil, diyas, Rozha One |
| `kalaDalan` | आकाशकंदील कार्यशाळा (children) | off-white paper, kshetra colours + marigold, paper-flag bunting (पताका), paper box-lanterns, शिक्षण-blue band, Baloo 2 titles, numbered circles |
| `paryavaran` | वृक्षवाढदिवस, वृक्षारोपण | pale green paper with faint leaves, leaf vine along the top, trees beside the title, dark-green band, saplings in clay pots, Rozha One |
| `swachhata` | स्वच्छता अभियान | white-blue paper with faint bubbles, deep-blue slogan strip and calendar badge, green rules, केरसुणी beside the title, केरसुणी + सूप alternating along the bottom |
| `sahitya` | मराठी भाषा गौरव दिन | parchment paper with faint quills, ink-indigo and saffron, a वर्णमाला strip (अ आ इ … क ख ग घ) across the top, a faint open book behind the title, लेखणी व दौत beside it, books + quills along the bottom, Amita titles |
| `prabodhan` | संजीवनी व्याख्यानमाला | warm paper with faint florets, प्रबोधन purple with crimson and brass, a marigold-and-jasmine garland on top, a lit समई either side of the title (never beside a speaker's photo), flowers (पुष्प) along the bottom |
| `spardha` | वक्तृत्व स्पर्धा | bright paper with faint stars, शिक्षण blue and trophy gold, a चषक either side of the title, microphones + stars along the bottom, a colour per group (`palette`), Khand titles |
| `ganeshotsav` | श्री गणेशमूर्ती कार्यशाळा | pale-yellow paper with faint जास्वंद, bright saffron (शेंदूर) and yellow, a दूर्वा-and-जास्वंद string on top, hanging जास्वंद beside the title, मोदक + जास्वंद along the bottom, Baloo 2 titles; no Ganesh image |

Styling is Tailwind, from `src/publicity/publicity.css`, separate from the site's `global.css`. Theme colours are classes like `bg-ground`, `text-deep`, `text-band-accent`. Fonts: `font-display` (Rozha One, or the theme's own title font, e.g. Baloo 2), `font-ornate` (Tiro Devanagari Marathi), `font-body` (Mukta), loaded from Google Fonts (`PublicityLayout.astro`). Rendering fails if any of them doesn't load, so an image is never drawn in a fallback font.

## Design rules

- Traditional Marathi invitation look, not glossy or "AI-ish": no gradients, glows or emoji, and no Inter/Roboto/Arial.
- Diwali palette: paper cream `#FBF1DC` with a faint paisley pattern, kumkum `#9C1C1C`, maroon `#6A1414`, marigold text `#B8650C`, ink `#2A1810`.
- Children's workshops (`kalaDalan`): playful but still flat and traditional, built from the site's kshetra colours (शिक्षण blue `#1565C0`, crimson `#C2185B`, green `#2E7D32`, purple `#6A1B9A`) plus marigold `#F59E0B` on off-white `#FFFCF5`; Baloo 2 for titles.
- Type: Rozha One for big titles (Baloo 2 in the children's `kalaDalan` theme), Tiro Devanagari Marathi for headings and ornaments, Mukta for body. `<html lang="mr">` so ल and श use Marathi forms.
- Fair WhatsApp layout, top to bottom: toran → logos either side of the deity picture (`deity`, सामवेद) + "॥ सस्नेह निमंत्रण ॥" + tagline → organisers line (names bold) → title with mandala behind and akashkandil either side → intro → maroon दिनांक/स्थळ band → items in two columns with marigold bullets + "आणि बरेच काही…" → closing paragraphs → footer line between gold rules → row of diyas.
- Workshop WhatsApp layout, top to bottom: top border → logo + "॥ संजीवनी कलादालन ॥" → title with lanterns either side → intro → दिनांक/स्थळ band → "महत्त्वाची माहिती" numbered terms → वि. सू. note box → संपर्क (registration line, names + numbers in two columns) → bottom row.
- Samved Jagran Manch (सामवेद जागरण मंच) has no logo, so it appears only in the organisers line. Spell it जैमुनी सहकारी पतपेढी मर्यादित, as on its seal.
- A Ganesh image at the top was considered and declined. Don't add it unless asked.
- Never put lamps (समई, दिवे) or a हार beside a living person's photo: around a portrait they read as a memorial. Those are only for a tribute (e.g. कुसुमाग्रज on his जयंती). Lamps beside a title are fine.

- Display fonts (Rozha One, Khand, Amita) draw Devanagari digits like Latin ones ("२०२६" shows as "2026"). Never set text that can contain numbers in `font-display`: years use `font-ornate`, dates and group names the body font.

## Marathi text standards

- Proofread every Marathi string. Use formal written Marathi, e.g. "बरेच काही" not "बरंच काही".
- Don't repeat the दिनांक heading as "दि." before each date.
- Use "X ते Y वाजेपर्यंत", not "X वाजता ते Y वाजेपर्यंत". Open-ended: "सकाळी ९.०० वाजल्यापासून". If both times share a period, the second period word is dropped.
- Time-of-day words: पहाटे (4–6), सकाळी (6–12), दुपारी (12–16), सायंकाळी (16–20), रात्री (20–4).
- Suggest wording changes to the content owner before applying them; don't silently rewrite content.

## Events page

The events page `/events` is made entirely from the published editions (`src/publicity/events.ts`, at build time): each one is an event with a link to its invitation cards, so an event and its invitation never disagree. To add an event, add an edition; there is no separate events list. The event uses the title and year, the first day's time, the venue, the kshetra and the programme's `summary` (else the intro). For the English site, a programme can give `en: { title, summary }` and an edition `en: { venue }`; whatever is missing shows in Marathi. A multi-day event stays under "upcoming" until its last day.

Each edition also has its own page, `/events/<year>/<programme>/` (`EventDetailPage.tsx`, data from `eventDetails()`): every day with an "Add to Google Calendar" link, `calendar.ics` with all days (`src/lib/calendar.ts`, tested; YAML times are IST), a map link, "share on WhatsApp" with the ready message, the 4:5 card, the details, and schema.org Event data for Google. Its link preview is the wide card. After the event the page says संपन्न and drops the calendar links by itself. The home page shows the next event under the hero, linking here.

**After an event, add its photos.** Pick 10–20 good ones and run:

```sh
pnpm photos ~/Downloads/grahak-peth 2026/grahak-peth
```

It turns each photo upright, shrinks it to at most 1600 px (JPEG, about 200–400 KB), drops its metadata (including the GPS location phones store), saves it in `public/assets/events/2026/grahak-peth/`, and prints the lines to paste into the edition (iPhone HEIC photos are converted on a Mac; existing files are skipped unless `--force`). Then fill in captions if you like and link the full album:

```yaml
photos:
  - src: /assets/events/2026/grahak-peth/udghatan.jpg
    caption: उद्घाटन समारंभ
album: https://photos.app.goo.gl/…
```

Keep the full-size originals in Google Photos/Drive (the `album:` link, shown as "सर्व फोटो पहा →"), not in the repository: git keeps every file forever, and GitHub Pages limits the site to 1 GB.

They appear as क्षणचित्रे on the event's page and at the top of the gallery (filtered by its kshetra and year). Only use photos the trust may publish.

## Archiving

Rendered images are generated on every deploy and never committed. To keep the exact version that was shared, attach the files to a GitHub Release for that programme.
