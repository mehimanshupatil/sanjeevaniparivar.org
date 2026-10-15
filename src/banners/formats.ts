export interface BannerFormat {
  label: string;
  width: number;
  height: number;
}

/**
 * Output formats (sizes). The layout for each lives per programme type in
 * src/banners/templates/<type>/<Format>.astro and is registered in templates/index.ts.
 */
export const FORMATS = {
  whatsapp: { label: 'WhatsApp निमंत्रण', width: 1080, height: 1920 },
  instagram: { label: 'Instagram पोस्ट', width: 1080, height: 1350 },
} satisfies Record<string, BannerFormat>;

export type FormatId = keyof typeof FORMATS;
