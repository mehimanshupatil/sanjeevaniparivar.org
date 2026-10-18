import type { ComponentType } from 'react';
import type { TemplateProps } from '../templates/types';
import Poster from './Poster';
import Rail from './Rail';
import Pass from './Pass';

/**
 * Styles: looks every edition is also rendered in, besides its type's own Template
 * ("classic", at /publicity/<year>/<programme>/<format>). Each style is one component for
 * every programme type and both formats (Instagram is the compact version), published at
 * /publicity/<year>/<programme>/<style>/<format>. Members pick which one to share.
 */
export const STYLES = {
  poster: { label: 'पोस्टर', description: 'वर रंगीत मोठे शीर्षक, खाली मोठी तारीख', layout: Poster },
  rail: { label: 'बाजूपट्टी', description: 'डावीकडे रंगीत पट्टीत तारीख, स्थळ व संपर्क', layout: Rail },
  pass: { label: 'प्रवेशिका', description: 'तिकिटासारखी पत्रिका, खाली फाडता येणाऱ्या भागात तारीख-वेळ-स्थळ', layout: Pass },
} satisfies Record<string, { label: string; description: string; layout: ComponentType<TemplateProps> }>;

export type StyleId = keyof typeof STYLES;
