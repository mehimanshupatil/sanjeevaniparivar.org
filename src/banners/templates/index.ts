import type { FormatId } from '@/banners/formats';
import FairWhatsapp from './fair/Whatsapp.astro';
import FairInstagram from './fair/Instagram.astro';

/**
 * One template per programme type, one layout per format. Every programme of a type
 * (and every year's edition) uses the same template — only the YAML changes.
 *
 * Add a type: create templates/<type>/<Format>.astro from the shared blocks, register
 * it here, and add the type (and its fields) to the programmes schema in content.config.ts.
 */
export const TEMPLATES = {
  fair: { whatsapp: FairWhatsapp, instagram: FairInstagram },
} satisfies Record<string, Partial<Record<FormatId, unknown>>>;

export type ProgrammeType = keyof typeof TEMPLATES;
