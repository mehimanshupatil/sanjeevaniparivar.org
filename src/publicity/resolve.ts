// Loads editions + programmes from the content collections (build time only).
import { getCollection, getEntry } from 'astro:content';
import { resolveEdition, type ResolvedEdition } from './edition';
import { FORMATS } from './formats';

/** Every edition, resolved — for getStaticPaths. */
export async function allEditions(): Promise<ResolvedEdition[]> {
  // Draft editions (unconfirmed details) are shown in `pnpm dev` only, never published.
  const editions = await getCollection('editions', (e) => import.meta.env.DEV || !e.data.draft);
  return Promise.all(editions.map(async (e) => {
    const programme = await getEntry(e.data.programme);
    if (!programme) throw new Error(`${e.id}: unknown programme "${e.data.programme.id}"`);
    return resolveEdition(e, programme);
  }));
}

/** Editions with invitation cards (every one but the `cards: false` records) — for the card pages. */
export async function cardEditions(): Promise<ResolvedEdition[]> {
  return (await allEditions()).filter((e) => e.cards);
}

export { FORMATS, resolveEdition };
export type { ResolvedEdition };
