import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { Renderer } from 'takumi-js/node';

const FONT_CACHE = resolve(process.cwd(), 'node_modules/.cache/og-fonts');

// Fetch full TTFs from Google Fonts at build time. Non-browser user agents get
// one unsubsetted .ttf per weight instead of unicode-range woff2 slices.
// Cached on disk after the first download, and retried, because a single
// flaky request otherwise fails the whole build.
async function loadGoogleFont(family: string, weight: number): Promise<Uint8Array> {
  const cached = join(FONT_CACHE, `${family.replace(/ /g, '-')}-${weight}.ttf`);
  if (existsSync(cached)) return readFileSync(cached);

  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}`;
  for (let attempt = 1; ; attempt++) {
    try {
      const css = await (await fetch(cssUrl)).text();
      const fontUrl = css.match(/src: url\((.+?)\)/)?.[1];
      if (!fontUrl) throw new Error(`No font URL for ${family} ${weight} in ${cssUrl}`);
      const res = await fetch(fontUrl);
      if (!res.ok) throw new Error(`${res.status} for ${fontUrl}`);
      const data = new Uint8Array(await res.arrayBuffer());
      mkdirSync(FONT_CACHE, { recursive: true });
      writeFileSync(cached, data);
      return data;
    } catch (err) {
      if (attempt === 3) throw new Error(`Could not download ${family} ${weight} from Google Fonts: ${err}`);
      await sleep(1000 * attempt);
    }
  }
}

const [deva400, deva700, inter400, inter700] = await Promise.all([
  loadGoogleFont('Noto Sans Devanagari', 400),
  loadGoogleFont('Noto Sans Devanagari', 700),
  loadGoogleFont('Inter', 400),
  loadGoogleFont('Inter', 700),
]);

// One shared renderer, fonts registered once. Distinct family names so CSS
// font-family fallback ('Deva', 'Inter') picks the right font per script.
export const renderer = new Renderer();
await Promise.all([
  renderer.registerFont({ name: 'Deva', data: deva400, weight: 400, style: 'normal' }),
  renderer.registerFont({ name: 'Deva', data: deva700, weight: 700, style: 'normal' }),
  renderer.registerFont({ name: 'Inter', data: inter400, weight: 400, style: 'normal' }),
  renderer.registerFont({ name: 'Inter', data: inter700, weight: 700, style: 'normal' }),
]);
