import type { ComponentType } from 'react';
import type { FormatId } from '../formats';
import type { EditionData, Entry, ProgrammeData } from '../edition';
import type { TemplateProps } from './types';
import FairWhatsapp from './fair/Whatsapp';
import FairInstagram from './fair/Instagram';
import * as fairSample from './fair/sample';
import WorkshopWhatsapp from './workshop/Whatsapp';
import WorkshopInstagram from './workshop/Instagram';
import * as workshopSample from './workshop/sample';
import PlantationWhatsapp from './plantation/Whatsapp';
import PlantationInstagram from './plantation/Instagram';
import * as plantationSample from './plantation/sample';
import CleanupWhatsapp from './cleanup/Whatsapp';
import CleanupInstagram from './cleanup/Instagram';
import * as cleanupSample from './cleanup/sample';
import CelebrationWhatsapp from './celebration/Whatsapp';
import CelebrationInstagram from './celebration/Instagram';
import * as celebrationSample from './celebration/sample';

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
  plantation: {
    label: 'वृक्षारोपण',
    description: 'वृक्षवाढदिवस, वृक्षारोपण यांसारखे उपक्रम: घोषवाक्य, तारीख, स्थळ आणि सहभागाचे आवाहन',
    layouts: { whatsapp: PlantationWhatsapp, instagram: PlantationInstagram },
    sample: plantationSample,
    editorSections: ['closing', 'contacts'],
  },
  cleanup: {
    label: 'स्वच्छता अभियान',
    description: 'मंदिर, शाळा, समुद्र किनारा स्वच्छता: घोषवाक्य, दिनदर्शिकेसारखी तारीख, स्थळ आणि सहभागाचे आवाहन',
    layouts: { whatsapp: CleanupWhatsapp, instagram: CleanupInstagram },
    sample: cleanupSample,
    editorSections: ['closing', 'contacts'],
  },
  celebration: {
    label: 'दिन / सोहळा',
    description: 'मराठी भाषा गौरव दिन, वाचन प्रेरणा दिन, विद्यार्थी गौरव यांसारखे कार्यक्रम: उद्देश, दिनांक-वेळ-स्थळ, कार्यक्रमाचे स्वरूप आणि उपस्थितीचे आवाहन',
    layouts: { whatsapp: CelebrationWhatsapp, instagram: CelebrationInstagram },
    sample: celebrationSample,
    editorSections: ['note', 'closing'],
  },
} satisfies Record<string, Template>;

export type ProgrammeType = keyof typeof TEMPLATES;
export type { TemplateProps };
