import type { Theme } from './types';

/**
 * Cleanliness drives (स्वच्छता अभियान): clean white-blue paper with faint bubbles,
 * deep-blue slogan strip and calendar badge, green accents, केरसुणी beside the title
 * and केरसुणी + सूप alternating along the bottom.
 */
export const swachhata: Theme = {
  colors: {
    ground: '#F5FAFE',
    ink: '#13283A',
    inkSoft: '#3A5168',
    primary: '#0B5394',
    deep: '#0D3B66',
    gold: '#2E7D32',
    bandText: '#FFFFFF',
    bandSoft: '#D6E6F5',
    bandAccent: '#8FD0F5',
    marigold: '#4FC3F7',
    marigoldEdge: '#0277BD',
  },
  decor: {
    pattern: 'pattern-bubbles.svg',
    titleSides: 'kersuni.svg',
    bottomRow: ['kersuni-small.svg', 'soop.svg'],
  },
};
