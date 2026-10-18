import type { Theme } from './types';

/**
 * पर्यावरण drives (स्वच्छता अभियान, वृक्षारोपण): pale green paper with faint leaves,
 * a leaf vine along the top, trees beside the title and saplings in clay pots
 * along the bottom. The site's पर्यावरण green with the brand gold.
 */
export const paryavaran: Theme = {
  colors: {
    ground: '#F8FBF2',
    ink: '#1E2A1A',
    inkSoft: '#3E4F38',
    primary: '#1B7A1B',
    deep: '#14532D',
    gold: '#A16207',
    bandText: '#F8FBF2',
    bandSoft: '#D9EBD3',
    bandAccent: '#F5C518',
    marigold: '#F5C518',
    marigoldEdge: '#A16207',
  },
  decor: {
    pattern: 'pattern-leaves.svg',
    top: 'vine.svg',
    titleSides: 'tree.svg',
    bottomRow: 'ropa.svg',
  },
};
