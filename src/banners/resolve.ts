// Loads editions + programmes from the content collections (build time only).
import { getCollection, getEntry } from 'astro:content';
import { resolveBanner, type Banner } from './banner';
import { FORMATS } from './formats';

/** Every edition, resolved — for getStaticPaths. */
export async function allBanners(): Promise<Banner[]> {
  // Draft editions (unconfirmed details) are shown in `pnpm dev` only, never published.
  const editions = await getCollection('editions', (e) => import.meta.env.DEV || !e.data.draft);
  return Promise.all(editions.map(async (e) => {
    const programme = await getEntry(e.data.programme);
    if (!programme) throw new Error(`${e.id}: unknown programme "${e.data.programme.id}"`);
    return resolveBanner(e, programme);
  }));
}

export { FORMATS, resolveBanner };
export type { Banner };
