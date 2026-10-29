export interface Format {
  label: string;
  /** Where to share it — shown on the download and template pages */
  use: string;
  width: number;
  height: number;
  /** Also rendered in the Styles (poster, rail, pass) — portrait formats only */
  styles: boolean;
}

/**
 * Output formats (sizes), one per shape the platforms show without cropping:
 * - whatsapp 9:16 — full-screen stories (WhatsApp status, Instagram and Facebook stories)
 * - instagram 4:5 — feed posts (Instagram, Facebook) and images sent in WhatsApp chats
 *   and groups: the chat bubble shows 4:5 whole, a 9:16 card gets cut off until tapped
 * - wide 1.91:1 — the image header of a WhatsApp API template message (WhatsApp crops
 *   the header to about 1.91:1), a Facebook event cover and a link preview
 * The layout for each lives per programme type in src/publicity/templates/<type>/<Format>.tsx
 * (wide: one shared layout in templates/wide/) and is registered in templates/index.ts.
 */
export const FORMATS = {
  whatsapp: { label: 'स्टेटस / स्टोरी', use: 'WhatsApp स्टेटस, Instagram व Facebook स्टोरी', width: 1080, height: 1920, styles: true },
  instagram: { label: 'पोस्ट / संदेश', use: 'WhatsApp गट व वैयक्तिक संदेश, Instagram व Facebook पोस्ट', width: 1080, height: 1350, styles: true },
  wide: { label: 'API संदेश / इव्हेंट कव्हर', use: 'WhatsApp API संदेशाचे चित्र (template header), Facebook इव्हेंट कव्हर, लिंक प्रिव्ह्यू', width: 1200, height: 628, styles: false },
} satisfies Record<string, Format>;

export type FormatId = keyof typeof FORMATS;
