import type { APIRoute } from 'astro';
import { render } from 'takumi-js';
import { renderer } from '@/og/fonts';
import { publicImage, SYMBOL } from '@/og/assets';
import { OgCard, OG_WIDTH, OG_HEIGHT, type OgCardProps } from '@/og/OgCard';
import { ogEntries } from '@/og/entries';

export async function getStaticPaths() {
  return (await ogEntries()).map(({ slug, card }) => ({ params: { slug }, props: card }));
}

export const GET: APIRoute = async ({ props }) => {
  const card = props as OgCardProps;
  const images = [SYMBOL, card.photo].filter((src): src is string => !!src).map(publicImage);
  const png = await render(OgCard(card), { renderer, images, width: OG_WIDTH, height: OG_HEIGHT });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
