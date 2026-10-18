/** Colour slots every template uses. Each theme fills all of them. */
export interface ThemeColors {
  ground: string;       // paper / background
  ink: string;          // body text
  inkSoft: string;      // secondary text
  primary: string;      // titles, headings
  deep: string;         // frame, date band, emphasis
  gold: string;         // rules, year
  bandText: string;     // text on the date band
  bandSoft: string;     // softer text on the date band
  bandAccent: string;   // headings and icons on the date band
  marigold: string;     // bullets, dots
  marigoldEdge: string;
}

/**
 * Named places a template can decorate. Each is an SVG file in
 * public/publicity/assets/decor/. A theme leaves a slot out to keep it empty.
 */
export interface ThemeDecor {
  pattern?: string;     // faint background pattern
  top?: string;         // full-width border at the top (toran)
  titleBack?: string;   // large faint ornament behind the title (mandala)
  titleSides?: string;  // hanging ornaments either side of the title (akashkandil)
  bottomRow?: string;   // repeated ornament along the bottom (diya)
}

/** Google Fonts family for big titles (and the venue); default Rozha One. */
export interface ThemeFonts {
  display: string;
  /** Weight to use for the display font, e.g. 800 for Baloo 2 (Rozha One has only 400) */
  displayWeight: number;
}

export interface Theme {
  colors: ThemeColors;
  decor: ThemeDecor;
  fonts?: ThemeFonts;
  /** Colours for numbered-point circles, cycled in order; without it points are "१)" text */
  palette?: string[];
}
