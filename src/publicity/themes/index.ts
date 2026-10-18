import { diwali } from './diwali';
import { kalaDalan } from './kalaDalan';
import type { Theme } from './types';

/** Add a theme: create themes/<name>.ts and register it here. */
export const THEMES = { diwali, kalaDalan } satisfies Record<string, Theme>;

export type ThemeId = keyof typeof THEMES;
export type { Theme, ThemeColors, ThemeDecor, ThemeFonts } from './types';
