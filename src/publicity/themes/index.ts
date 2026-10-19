import { diwali } from './diwali';
import { kalaDalan } from './kalaDalan';
import { paryavaran } from './paryavaran';
import { swachhata } from './swachhata';
import { sahitya } from './sahitya';
import { prabodhan } from './prabodhan';
import { spardha } from './spardha';
import { ganeshotsav } from './ganeshotsav';
import type { Theme } from './types';

/** Add a theme: create themes/<name>.ts and register it here. */
export const THEMES = { diwali, kalaDalan, paryavaran, swachhata, sahitya, prabodhan, spardha, ganeshotsav } satisfies Record<string, Theme>;

export type ThemeId = keyof typeof THEMES;
export type { Theme, ThemeColors, ThemeDecor, ThemeFonts } from './types';
