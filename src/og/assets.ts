import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const SYMBOL = '/assets/brand/sanjeevani-parivar-symbol.png';

const publicPath = (src: string) => resolve(process.cwd(), 'public', src.replace(/^\//, ''));

/** `src` if the file exists under /public; otherwise warns and returns undefined so the card
 *  falls back to the plain variant. */
export function existingPhoto(src: string | undefined, owner: string) {
  if (!src) return undefined;
  if (existsSync(publicPath(src))) return src;
  console.warn(`[og] ${owner}: image not found in public/: ${src}`);
  return undefined;
}

const cache = new Map<string, Uint8Array>();

/** Bytes of a file under /public, read once per build. Takumi matches an <img src> to an
 *  image source with the same `src`, so cards reference images by their public path. */
export function publicImage(src: string) {
  let data = cache.get(src);
  if (!data) {
    data = readFileSync(publicPath(src));
    cache.set(src, data);
  }
  return { src, data };
}
