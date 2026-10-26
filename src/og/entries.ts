import { getCollection } from 'astro:content';
import { KSHETRAS } from '@/content/kshetras';
import { GALLERY } from '@/content/gallery';
import { KSHETRA_COLORS } from '@/content/brand';
import { mrNum } from '@/lib/marathi';
import { existingPhoto } from './assets';
import type { OgCardProps } from './OgCard';

const PRIMARY = '#C41E3A';
const kshetraColor = (slug: string) => KSHETRA_COLORS[slug]?.hex ?? PRIMARY;
const kshetraPhoto = (slug: string) =>
  existingPhoto(GALLERY.find((g) => g.kshetra === slug)?.src, `kshetra/${slug}`);

/** Every OG card on the site, keyed by its path under /og/ (without .png). */
export async function ogEntries(): Promise<{ slug: string; card: OgCardProps }[]> {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  const page = (slug: string, title: string, subtitle: string) =>
    ({ slug, card: { title, subtitle, color: PRIMARY } });

  return [
    page('home', 'संजीवनी परिवार', 'ध्यास परिवर्तनाचा · स्थापना १९९४'),
    page('page/donate', 'देणगी', 'परिवर्तनाचा भाग व्हा'),
    page('page/gallery', 'चित्रदालन', 'आमचा फोटो प्रवास'),
    page('page/team', 'आमची टीम', 'संजीवनी परिवार'),
    page('page/brand', 'ब्रँड मार्गदर्शक', 'लोगो, रंग व नाव'),
    page('page/privacy', 'गोपनीयता धोरण', 'संजीवनी परिवार'),
    page('page/terms', 'सेवा अटी', 'संजीवनी परिवार'),
    page('page/events', 'कार्यक्रम', 'आगामी व मागील कार्यक्रम'),
    page('page/blog', 'ब्लॉग', 'आमच्या कार्याच्या कहाण्या'),

    ...KSHETRAS.map((k) => ({
      slug: `kshetra/${k.slug}`,
      card: { title: k.label.mr, subtitle: k.tagline.mr, color: kshetraColor(k.slug), photo: kshetraPhoto(k.slug) },
    })),

    // No photo: the gallery isn't tagged by upakram, and a photo from another activity would mislead.
    ...KSHETRAS.flatMap((k) =>
      k.activities.map((a) => ({
        slug: `upakram/${k.slug}/${a.slug}`,
        card: { title: a.title.mr, subtitle: k.label.mr, color: kshetraColor(k.slug) },
      }))
    ),

    ...posts.map((p) => ({
      slug: `blog/${p.id}`,
      card: {
        title: p.data.title,
        subtitle: `${KSHETRAS.find((k) => k.slug === p.data.kshetra)?.label.mr ?? 'सामान्य'} · ${mrNum(p.data.date.slice(0, 4))}`,
        color: kshetraColor(p.data.kshetra),
        photo: existingPhoto(p.data.image, `blog/${p.id}`),
      },
    })),
  ];
}
