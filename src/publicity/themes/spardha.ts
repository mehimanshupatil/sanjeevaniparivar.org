import type { Theme } from './types';

/**
 * Students' competitions (वक्तृत्व स्पर्धा): bright paper with faint stars, शिक्षण blue with
 * trophy gold, a चषक either side of the title and microphones + stars along the bottom,
 * the condensed Khand for titles, and a colour per group.
 */
export const spardha: Theme = {
  colors: {
    ground: '#F7FAFF',
    ink: '#14213D',
    inkSoft: '#3D4F6E',
    primary: '#1565C0',
    deep: '#0D3C7A',
    gold: '#D99A00',
    bandText: '#FFFFFF',
    bandSoft: '#D6E4F7',
    bandAccent: '#FFD54F',
    marigold: '#FFC107',
    marigoldEdge: '#B28704',
  },
  decor: {
    pattern: 'pattern-stars.svg',
    titleSides: 'chashak.svg',
    bottomRow: ['mic.svg', 'tara.svg'],
  },
  fonts: { display: 'Khand', displayWeight: 700 },
  palette: ['#1565C0', '#C2185B', '#2E7D32', '#6A1B9A', '#E65100'],
};
