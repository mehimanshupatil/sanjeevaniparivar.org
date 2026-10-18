import type { Theme } from './types';

/**
 * Language and reading programmes (मराठी भाषा गौरव दिन, वाचन प्रेरणा दिन): parchment paper
 * with faint quills, ink-indigo and saffron, a वर्णमाला strip on top, a calligraphic title (Amita) over a faint book,
 * लेखणी व दौत beside the title and open books + quills along the bottom.
 */
export const sahitya: Theme = {
  colors: {
    ground: '#FBF5E6',
    ink: '#2B1D14',
    inkSoft: '#54402F',
    primary: '#B4470C',
    deep: '#1E2A5A',
    gold: '#B7791F',
    bandText: '#FBF5E6',
    bandSoft: '#E4DCC8',
    bandAccent: '#F2B45A',
    marigold: '#E8822A',
    marigoldEdge: '#A04A0C',
  },
  decor: {
    pattern: 'pattern-quills.svg',
    titleBack: 'pustak.svg',
    titleSides: 'lekhani.svg',
    bottomRow: ['pustak.svg', 'lekhani-small.svg'],
  },
  fonts: { display: 'Amita', displayWeight: 700 },
  strip: 'अ आ इ ई उ ऊ ए ऐ ओ औ अं अः क ख ग घ',
};
