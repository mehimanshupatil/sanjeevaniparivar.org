import type { Theme } from './types';

/**
 * Children's craft workshops (संजीवनी कलादालन): off-white paper, paper-flag bunting,
 * paper lanterns, the site's kshetra colours (शिक्षण blue band, crimson, green, purple)
 * plus marigold, and the rounded Baloo 2 for titles.
 */
export const kalaDalan: Theme = {
  colors: {
    ground: '#FFFCF5',
    ink: '#23201A',
    inkSoft: '#4B4538',
    primary: '#C2185B',
    deep: '#1565C0',
    gold: '#E08E0B',
    bandText: '#FFFFFF',
    bandSoft: '#DCE9F9',
    bandAccent: '#FFD54F',
    marigold: '#F59E0B',
    marigoldEdge: '#B45309',
  },
  decor: {
    pattern: 'pattern-confetti.svg',
    top: 'pataka.svg',
    titleSides: 'kandil-paper.svg',
    bottomRow: 'kandil-small.svg',
  },
  fonts: { display: 'Baloo 2', displayWeight: 800 },
  palette: ['#C2185B', '#F59E0B', '#2E7D32', '#1565C0', '#6A1B9A'],
};
