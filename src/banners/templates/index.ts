import type { ComponentType } from 'react';
import type { FormatId } from '../formats';
import type { EditionData, Entry, ProgrammeData } from '../banner';
import type { TemplateProps } from './types';
import FairWhatsapp from './fair/Whatsapp';
import FairInstagram from './fair/Instagram';
import * as fairSample from './fair/sample';
import WorkshopWhatsapp from './workshop/Whatsapp';
import WorkshopInstagram from './workshop/Instagram';
import * as workshopSample from './workshop/sample';

export interface Template {
  /** Marathi name shown in the template gallery */
  label: string;
  /** One line: what kind of programme this suits */
  description: string;
  /** One layout per format this type supports */
  layouts: Partial<Record<FormatId, ComponentType<TemplateProps>>>;
  /** Sample programme + edition for the gallery and the try-out editor */
  sample: { programme: Entry<ProgrammeData>; edition: Entry<EditionData> };
  /** Which type-specific sections the try-out editor shows (title, dates and venue always show) */
  editorSections: EditorSection[];
}

export type EditorSection = 'items' | 'closing' | 'rules' | 'note' | 'contacts';

/**
 * One template per programme type. Every programme of a type (and every year's
 * edition) uses the same template — only the YAML changes.
 *
 * Add a type: create templates/<type>/ with a layout per format (built from the
 * shared blocks) and a sample.ts, register it here, and add the type and its
 * fields to the programmes schema in content.config.ts.
 */
export const TEMPLATES = {
  fair: {
    label: 'बाजार / जत्रा',
    description: 'ग्राहक पेठेसारखे कार्यक्रम: तारखा, स्थळ आणि आकर्षणांची यादी',
    layouts: { whatsapp: FairWhatsapp, instagram: FairInstagram },
    sample: fairSample,
    editorSections: ['items', 'closing'],
  },
  workshop: {
    label: 'कार्यशाळा',
    description: 'आकाशकंदील, शाडूमाती गणेशमूर्ती यांसारख्या कार्यशाळा: नियम, सूचना आणि नोंदणीसाठी संपर्क',
    layouts: { whatsapp: WorkshopWhatsapp, instagram: WorkshopInstagram },
    sample: workshopSample,
    editorSections: ['rules', 'note', 'contacts'],
  },
} satisfies Record<string, Template>;

export type ProgrammeType = keyof typeof TEMPLATES;
export type { TemplateProps };
