export interface BannerLogo {
  /** File in public/banners/assets/logos/ */
  file: string;
  caption: string;
  /** Round seals read smaller than square logos, so they get a little more room. */
  shape: 'square' | 'seal';
}

/** Add a partner: drop the file in public/banners/assets/logos/ and register it here. */
export const LOGOS = {
  sanjeevani: { file: 'sanjeevani.png', caption: 'संजीवनी परिवार', shape: 'square' },
  jaimuni: { file: 'jaimuni-seal.png', caption: 'जैमुनी सहकारी पतपेढी', shape: 'seal' },
} satisfies Record<string, BannerLogo>;

export type LogoId = keyof typeof LOGOS;
