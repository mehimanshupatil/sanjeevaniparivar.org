import type { Bilingual } from '@/i18n/translations';

export interface LogoAsset {
  id: string;
  label: Bilingual;
  desc: Bilingual;
  /** Path under /public */
  src: string;
  format: string;
  size: string;
}

export interface BrandColor {
  name: Bilingual;
  hex: string;
  rgb: string;
  /** Contrast ratio against white, for text use */
  contrast: number;
  use: Bilingual;
}

/** Contact for brand questions and logo-use approval */
export const BRAND_EMAIL = 'sanjeevani.parivar@gmail.com';

export const LOGOS: LogoAsset[] = [
  {
    id: 'logo',
    label: { mr: 'पूर्ण लोगो', en: 'Full logo' },
    desc: { mr: 'चिन्ह, नाव व घोषवाक्य — बहुतेक ठिकाणी हाच वापरा', en: 'Symbol, name and tagline — use this by default' },
    src: '/assets/brand/sanjeevani-parivar-logo.png',
    format: 'PNG, transparent',
    size: '1249 × 368',
  },
  {
    id: 'symbol',
    label: { mr: 'चिन्ह', en: 'Symbol' },
    desc: { mr: 'जागा कमी असल्यास — प्रोफाइल फोटो, बॅज, आयकॉन', en: 'Where space is tight — profile photos, badges, icons' },
    src: '/assets/brand/sanjeevani-parivar-symbol.png',
    format: 'PNG, transparent',
    size: '320 × 343',
  },
  {
    id: 'symbol-large',
    label: { mr: 'चिन्ह (मोठे)', en: 'Symbol (large)' },
    desc: { mr: 'छपाईसाठी मोठी प्रत, पांढऱ्या पार्श्वभूमीवर', en: 'Larger copy for print, on white' },
    src: '/assets/brand/sanjeevani-parivar-symbol-large.jpg',
    format: 'JPG, white background',
    size: '701 × 784',
  },
];

/** Colours sampled from the logo artwork. Use for the logo and print. */
export const LOGO_COLORS: BrandColor[] = [
  {
    name: { mr: 'संजीवनी लाल', en: 'Sanjeevani Red' },
    hex: '#EE1D21', rgb: '238, 29, 33', contrast: 4.35,
    use: { mr: '"सं" अक्षर व नाव', en: 'The "सं" letter and the name' },
  },
  {
    name: { mr: 'संजीवनी हिरवा', en: 'Sanjeevani Green' },
    hex: '#00A646', rgb: '0, 166, 70', contrast: 3.21,
    use: { mr: 'ढाल व घोषवाक्य', en: 'The shield and the tagline' },
  },
  {
    name: { mr: 'क्रीम', en: 'Cream' },
    hex: '#FCFBAB', rgb: '252, 251, 171', contrast: 1.08,
    use: { mr: 'ढालीचा आतील भाग', en: 'Inside of the shield' },
  },
];

/** Website palette — darker shades so text stays readable. Source of truth: src/styles/global.css */
export const WEB_COLORS: BrandColor[] = [
  {
    name: { mr: 'प्राथमिक — लाल', en: 'Primary — Crimson' },
    hex: '#C41E3A', rgb: '196, 30, 58', contrast: 5.84,
    use: { mr: 'बटणे, शीर्षके, दुवे', en: 'Buttons, headings, links' },
  },
  {
    name: { mr: 'दुय्यम — हिरवा', en: 'Secondary — Forest Green' },
    hex: '#1B7A1B', rgb: '27, 122, 27', contrast: 5.46,
    use: { mr: 'घोषवाक्य, पूरक घटक', en: 'Tagline, supporting elements' },
  },
  {
    name: { mr: 'सोनेरी', en: 'Gold' },
    hex: '#F5C518', rgb: '245, 197, 24', contrast: 1.63,
    use: { mr: 'गडद पार्श्वभूमीवरील ठळक मजकूर, सजावट', en: 'Highlights on dark backgrounds, decoration' },
  },
];

/** Kshetra colours, keyed by kshetra slug. Source of truth: src/styles/global.css */
export const KSHETRA_COLORS: Record<string, { hex: string; contrast: number }> = {
  shikshan:   { hex: '#1565C0', contrast: 5.75 },
  paryavaran: { hex: '#1B7A1B', contrast: 5.46 },
  aarogya:    { hex: '#C41E3A', contrast: 5.84 },
  prabodhana: { hex: '#6A1B9A', contrast: 9.39 },
};

export const FONTS = [
  {
    name: 'Noto Sans Devanagari',
    use: { mr: 'मराठी मजकूर', en: 'Marathi text' },
    url: 'https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari',
    sample: 'संजीवनी परिवार — ध्यास परिवर्तनाचा',
  },
  {
    name: 'Inter',
    use: { mr: 'इंग्रजी मजकूर', en: 'English text' },
    url: 'https://fonts.google.com/specimen/Inter',
    sample: 'Sanjeevani Parivar — Obsession for Change',
  },
];

export const NAMES: { label: Bilingual; value: string; note: Bilingual }[] = [
  {
    label: { mr: 'नाव', en: 'Name' },
    value: 'संजीवनी परिवार · Sanjeevani Parivar',
    note: { mr: 'सर्वत्र हेच नाव वापरा', en: 'Use this name everywhere' },
  },
  {
    label: { mr: 'घोषवाक्य', en: 'Tagline' },
    value: 'ध्यास परिवर्तनाचा',
    note: { mr: 'इंग्रजीत: Obsession for Change', en: 'In English: Obsession for Change' },
  },
  {
    label: { mr: 'ब्रीदवाक्य', en: 'Motto' },
    value: 'सा नो दधातु सुकृतस्य लोके',
    note: { mr: 'लोगोच्या ढालीखाली', en: 'Beneath the shield in the logo' },
  },
  {
    label: { mr: 'स्थापना', en: 'Founded' },
    value: '१९९४ · वसई',
    note: { mr: 'नोंदणी वर्ष नव्हे — स्थापना वर्ष', en: 'Founding year, not the registration year' },
  },
];
