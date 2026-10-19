import type { Theme } from './types';

/**
 * Ganeshotsav (शाडूमाती गणेशमूर्ती कार्यशाळा): pale-yellow paper with faint जास्वंद, दूर्वा green
 * and saffron (kept clear of the Diwali maroon so it doesn't look like ग्राहक पेठ), a दूर्वा-and-जास्वंद string on top, hanging जास्वंद strings beside the title and
 * मोदक + जास्वंद along the bottom. No Ganesh image (see docs/publicity.md).
 */
export const ganeshotsav: Theme = {
  colors: {
    ground: '#FFFBEA',
    ink: '#1F2A14',
    inkSoft: '#4A5530',
    primary: '#E65100',
    deep: '#1B5E20',
    gold: '#C77700',
    bandText: '#FFFBEA',
    bandSoft: '#DCEFD0',
    bandAccent: '#FFC94D',
    marigold: '#F59E0B',
    marigoldEdge: '#B45309',
  },
  decor: {
    pattern: 'pattern-jaswand.svg',
    top: 'durva-mala.svg',
    titleSides: 'jaswand-mala.svg',
    bottomRow: ['modak.svg', 'jaswand.svg'],
  },
  fonts: { display: 'Baloo 2', displayWeight: 800 },
  palette: ['#E65100', '#1B5E20', '#C62828', '#C77700'],
};
