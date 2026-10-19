import type { Theme } from './types';

/**
 * Ganeshotsav (शाडूमाती गणेशमूर्ती कार्यशाळा): Ganesh's colours — pale-yellow (हळद) paper with faint
 * जास्वंद, bright saffron (शेंदूर) and yellow (kept clear of the Diwali maroon of ग्राहक पेठ), a
 * दूर्वा-and-जास्वंद string on top, hanging जास्वंद beside the title and मोदक + जास्वंद along
 * the bottom. No Ganesh image (see docs/publicity.md).
 */
export const ganeshotsav: Theme = {
  colors: {
    ground: '#FFF8E1',
    ink: '#3E2410',
    inkSoft: '#6B4423',
    primary: '#D84315',
    deep: '#EF6C00',
    gold: '#C77700',
    bandText: '#FFFFFF',
    bandSoft: '#FFF3D6',
    bandAccent: '#FFEB3B',
    marigold: '#FBC02D',
    marigoldEdge: '#C77700',
  },
  decor: {
    pattern: 'pattern-jaswand.svg',
    top: 'durva-mala.svg',
    titleSides: 'jaswand-mala.svg',
    bottomRow: ['modak.svg', 'jaswand.svg'],
  },
  fonts: { display: 'Baloo 2', displayWeight: 800 },
  palette: ['#E65100', '#2E7D32', '#D84315', '#C77700'],
};
