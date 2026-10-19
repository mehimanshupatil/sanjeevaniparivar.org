import type { Theme } from './types';

/**
 * Ganeshotsav (शाडूमाती गणेशमूर्ती कार्यशाळा): warm paper with faint जास्वंद, शेंदूर red and
 * clay brown, a दूर्वा-and-जास्वंद string on top, hanging जास्वंद strings beside the title and
 * मोदक + जास्वंद along the bottom. No Ganesh image (see docs/publicity.md).
 */
export const ganeshotsav: Theme = {
  colors: {
    ground: '#FFF8EE',
    ink: '#2B1B12',
    inkSoft: '#5A3A28',
    primary: '#C62828',
    deep: '#6D2E1B',
    gold: '#C77700',
    bandText: '#FFF8EE',
    bandSoft: '#F3DCCB',
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
  palette: ['#C62828', '#2E7D32', '#C77700', '#6D2E1B'],
};
