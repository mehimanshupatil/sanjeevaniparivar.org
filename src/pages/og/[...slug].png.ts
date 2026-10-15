import type { APIRoute } from 'astro';
import { render } from 'takumi-js';
import { Renderer } from 'takumi-js/node';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { getCollection } from 'astro:content';
import { KSHETRAS } from '@/content/kshetras';

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

const [fontDeva400, fontDeva700, fontInter400, fontInter700] = await Promise.all([
  loadGoogleFont('Noto Sans Devanagari', 400),
  loadGoogleFont('Noto Sans Devanagari', 700),
  loadGoogleFont('Inter', 400),
  loadGoogleFont('Inter', 700),
]);
const logoData = readFileSync(resolve(process.cwd(), 'public/assets/logo.jpg'));
const logoDataUri = `data:image/png;base64,${logoData.toString('base64')}`;

// Load fonts once into a shared renderer with distinct family names so CSS
// font-family fallback ('Deva', 'Inter') picks the right font per script
const renderer = new Renderer();
await Promise.all([
  renderer.registerFont({ name: 'Deva', data: fontDeva400, weight: 400, style: 'normal' }),
  renderer.registerFont({ name: 'Deva', data: fontDeva700, weight: 700, style: 'normal' }),
  renderer.registerFont({ name: 'Inter', data: fontInter400, weight: 400, style: 'normal' }),
  renderer.registerFont({ name: 'Inter', data: fontInter700, weight: 700, style: 'normal' }),
]);

const KSHETRA_HEX: Record<string, string> = {
  shikshan: '#1565C0',
  paryavaran: '#1B7A1B',
  aarogya: '#C41E3A',
  prabodhana: '#6A1B9A',
};
const PRIMARY = '#C41E3A';

interface OgProps {
  title: string;
  subtitle: string;
  color: string;
}

export async function getStaticPaths() {
  const posts = await getCollection('blog', (p) => !p.data.draft);

  return [
    { params: { slug: 'home' }, props: { title: 'संजीवनी परिवार', subtitle: 'ध्यास परिवर्तनाचा · स्थापना १९९४', color: PRIMARY } },
    { params: { slug: 'page/donate' }, props: { title: 'देणगी', subtitle: 'परिवर्तनाचा भाग व्हा', color: PRIMARY } },
    { params: { slug: 'page/gallery' }, props: { title: 'चित्रदालन', subtitle: 'आमचा फोटो प्रवास', color: PRIMARY } },
    { params: { slug: 'page/team' }, props: { title: 'आमची टीम', subtitle: 'संजीवनी परिवार', color: PRIMARY } },
    { params: { slug: 'page/brand' }, props: { title: 'ब्रँड मार्गदर्शक', subtitle: 'लोगो, रंग व नाव', color: PRIMARY } },
    { params: { slug: 'page/events' }, props: { title: 'कार्यक्रम', subtitle: 'आगामी व मागील कार्यक्रम', color: PRIMARY } },
    { params: { slug: 'page/blog' }, props: { title: 'ब्लॉग', subtitle: 'आमच्या कार्याच्या कहाण्या', color: PRIMARY } },

    ...KSHETRAS.map((k) => ({
      params: { slug: `kshetra/${k.slug}` },
      props: { title: k.label.mr, subtitle: k.tagline.mr, color: KSHETRA_HEX[k.slug] ?? PRIMARY },
    })),

    ...KSHETRAS.flatMap((k) =>
      k.activities.map((a) => ({
        params: { slug: `upakram/${k.slug}/${a.slug}` },
        props: { title: a.title.mr, subtitle: k.label.mr, color: KSHETRA_HEX[k.slug] ?? PRIMARY },
      }))
    ),

    ...posts.map((p) => ({
      params: { slug: `blog/${p.id}` },
      props: {
        title: p.data.title,
        subtitle: `${KSHETRAS.find((k) => k.slug === p.data.kshetra)?.label.mr ?? 'सामान्य'} · ${p.data.date.slice(0, 4)}`,
        color: KSHETRA_HEX[p.data.kshetra] ?? PRIMARY,
      },
    })),
  ];
}

async function generateOgImage({ title, subtitle, color }: OgProps): Promise<Uint8Array<ArrayBuffer>> {
  const fontSize = title.length > 18 ? 48 : title.length > 10 ? 58 : 68;

  const html = `<div style="width:1200px;height:630px;background:${color};display:flex;flex-direction:column;padding:64px 80px;font-family:'Deva','Inter';">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:15px;color:rgba(255,255,255,0.5);letter-spacing:4px;text-transform:uppercase;">संजीवनी परिवार · sanjeevaniparivar.org</span>
      <img src="${logoDataUri}" style="width:52px;height:52px;object-fit:contain;opacity:0.9;" />
    </div>
    <div style="flex:1;"></div>
    <div style="font-size:${fontSize}px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:20px;">${title}</div>
    <div style="font-size:26px;color:rgba(255,255,255,0.65);margin-bottom:64px;">${subtitle}</div>
    <div style="display:flex;justify-content:flex-end;">
      <span style="font-size:14px;color:rgba(255,255,255,0.35);">स्थापना १९९४ · वसई, महाराष्ट्र</span>
    </div>
  </div>`;

  return render(html, { renderer, width: 1200, height: 630 });
}

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props as OgProps);
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
