import { diwali } from './diwali';
import type { BannerTheme } from './types';

/** Add a theme: create themes/<name>.ts and register it here. */
export const THEMES = { diwali } satisfies Record<string, BannerTheme>;

export type ThemeId = keyof typeof THEMES;
export type { BannerTheme, ThemeColors, ThemeDecor } from './types';
