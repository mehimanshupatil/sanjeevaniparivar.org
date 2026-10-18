import type { Theme } from './types';

/**
 * Lecture series (संजीवनी व्याख्यानमाला, प्रबोधन): warm paper with faint florets, the प्रबोधन
 * purple with crimson and brass, a marigold-and-jasmine garland on top, a lit समई either side
 * of the title and flowers (each lecture is a पुष्प) along the bottom.
 */
export const prabodhan: Theme = {
  colors: {
    ground: '#FFF9F0',
    ink: '#24182E',
    inkSoft: '#4E3D5C',
    primary: '#B0173A',
    deep: '#4A148C',
    gold: '#B7861F',
    bandText: '#FFF9F0',
    bandSoft: '#E6D9F2',
    bandAccent: '#FFC94D',
    marigold: '#FF9F1C',
    marigoldEdge: '#C25E00',
  },
  decor: {
    pattern: 'pattern-florets.svg',
    top: 'phulmala.svg',
    titleSides: 'samai.svg',
    bottomRow: 'phool.svg',
  },
};
