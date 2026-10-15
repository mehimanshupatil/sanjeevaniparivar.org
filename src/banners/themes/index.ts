import { diwali } from './diwali';
import { kalaDalan } from './kalaDalan';
import type { BannerTheme } from './types';

/** Add a theme: create themes/<name>.ts and register it here. */
export const THEMES = { diwali, kalaDalan } satisfies Record<string, BannerTheme>;

export type ThemeId = keyof typeof THEMES;
export type { BannerTheme, ThemeColors, ThemeDecor, ThemeFonts } from './types';
