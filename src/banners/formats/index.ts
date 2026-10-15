export interface BannerFormat {
  label: string;
  width: number;
  height: number;
}

/**
 * Output formats. Each maps to a layout component in src/pages/banners/[...slug].astro.
 * Add a format: register its size here, write formats/<Name>.astro, map it in the route.
 */
export const FORMATS = {
  whatsapp: { label: 'WhatsApp निमंत्रण', width: 1080, height: 1920 },
} satisfies Record<string, BannerFormat>;

export type FormatId = keyof typeof FORMATS;
