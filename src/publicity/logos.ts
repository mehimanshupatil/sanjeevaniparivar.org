export interface Logo {
  /** Public URL of the image. Reuse the site's own files where they exist. */
  src: string;
  caption: string;
  /** Round seals read smaller than square logos, so they get a little more room. */
  shape: 'square' | 'seal';
}

/**
 * Add a partner: put a transparent PNG in public/publicity/assets/logos/ (or reuse
 * an existing public file) and register it here.
 */
export const LOGOS = {
  sanjeevani: { src: '/assets/brand/sanjeevani-parivar-symbol.png', caption: 'संजीवनी परिवार', shape: 'square' },
  jaimuni: { src: '/publicity/assets/logos/jaimuni-seal.png', caption: 'जैमुनी सहकारी पतपेढी', shape: 'seal' },
} satisfies Record<string, Logo>;

export type LogoId = keyof typeof LOGOS;
