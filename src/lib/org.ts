// Counts that grow every year, computed at build time instead of typed into text.
// Sources: the trust's 17th annual report (2025–26).
import { mrNum } from './marathi';

const year = new Date().getFullYear();

/** संजीवनी परिवार began its work in 1994 (Founding, not Registration — see GLOSSARY.md) */
export const FOUNDED = 1994;
/** संजीवनी व्याख्यानमाला: first series in 2003 */
export const VYAKHYANMALA_FROM = 2003;
/** वृक्षवाढदिवस: trees planted from 2005, their birthday celebrated every year since 2006 */
export const VRIKSHA_VADHADIWAS_FROM = 2006;

/** 32 in 2026 */
export const yearsOfService = year - FOUNDED;
/** The current व्याख्यानमाला is its 24th in 2026 (2003 = 1st) */
export const vyakhyanmalaEdition = year - VYAKHYANMALA_FROM + 1;
/** 20 in 2026 */
export const vrikshaYears = year - VRIKSHA_VADHADIWAS_FROM;

export const mr = (n: number) => mrNum(n);
