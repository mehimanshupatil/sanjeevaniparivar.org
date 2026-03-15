export type Bilingual = { mr: string; en: string };

export interface GalleryItem {
  id: string;
  /** Path under /public/assets/gallery/ */
  src: string;
  alt: Bilingual;
  caption?: Bilingual;
  /** kshetra slug or 'general' */
  kshetra: 'shikshan' | 'paryavaran' | 'aarogya' | 'prabodhana' | 'general';
  year: number;
}

/**
 * Add photos here.
 * Put image files in /public/assets/gallery/ and reference them as:
 *   src: '/assets/gallery/your-file.jpg'
 */
export const GALLERY: GalleryItem[] = [
  // ── Shikshan ──────────────────────────────────────────────
  {
    id: 'sh-01',
    src: '/assets/gallery/shikshan-vaktrutva-2024.jpg',
    alt:     { mr: 'वक्तृत्व स्पर्धा २०२४', en: 'Elocution Competition 2024' },
    caption: { mr: 'वार्षिक वक्तृत्व स्पर्धा — विद्यार्थ्यांनी उत्साहाने सहभाग घेतला', en: 'Annual elocution competition — students participated enthusiastically' },
    kshetra: 'shikshan',
    year: 2024,
  },
  {
    id: 'sh-02',
    src: '/assets/gallery/shikshan-gaurav-2023.jpg',
    alt:     { mr: 'विद्यार्थी गौरव समारंभ २०२३', en: 'Student Felicitation 2023' },
    caption: { mr: 'गुणवंत विद्यार्थ्यांचा सन्मान', en: 'Honouring meritorious students' },
    kshetra: 'shikshan',
    year: 2023,
  },
  {
    id: 'sh-03',
    src: '/assets/gallery/shikshan-rangoli-2023.jpg',
    alt:     { mr: 'संस्कार भारती रांगोळी २०२३', en: 'Sanskar Bharati Rangoli 2023' },
    caption: { mr: 'रांगोळी स्पर्धेत सहभागी विद्यार्थिनी', en: 'Students participating in rangoli competition' },
    kshetra: 'shikshan',
    year: 2023,
  },
  {
    id: 'sh-04',
    src: '/assets/gallery/shikshan-clay-ganesh-2022.jpg',
    alt:     { mr: 'शाडूमाती गणेश कार्यशाळा २०२२', en: 'Clay Ganesh Workshop 2022' },
    caption: { mr: 'पारंपरिक शिल्पकलेची कार्यशाळा', en: 'Traditional idol-making workshop' },
    kshetra: 'shikshan',
    year: 2022,
  },
  // ── Paryavaran ────────────────────────────────────────────
  {
    id: 'pa-01',
    src: '/assets/gallery/paryavaran-vadhadiws-2024.jpg',
    alt:     { mr: 'वृक्षवाढदिवस उत्सव २०२४', en: 'Tree Birthday Celebration 2024' },
    caption: { mr: '२०वा वृक्षवाढदिवस उत्सव', en: '20th Tree Birthday Celebration' },
    kshetra: 'paryavaran',
    year: 2024,
  },
  {
    id: 'pa-02',
    src: '/assets/gallery/paryavaran-beach-2023.jpg',
    alt:     { mr: 'समुद्र किनारा स्वच्छता २०२३', en: 'Beach Cleanliness Drive 2023' },
    caption: { mr: 'वसई समुद्र किनाऱ्यावर स्वच्छता अभियान', en: 'Cleanliness drive at Vasai beach' },
    kshetra: 'paryavaran',
    year: 2023,
  },
  {
    id: 'pa-03',
    src: '/assets/gallery/paryavaran-ropan-2023.jpg',
    alt:     { mr: 'वृक्षारोपण अभियान २०२३', en: 'Tree Plantation Drive 2023' },
    caption: { mr: 'सामूहिक वृक्षारोपण कार्यक्रम', en: 'Community tree planting program' },
    kshetra: 'paryavaran',
    year: 2023,
  },
  {
    id: 'pa-04',
    src: '/assets/gallery/paryavaran-plastic-2022.jpg',
    alt:     { mr: 'प्लास्टिकमुक्त उपक्रम २०२२', en: 'Plastic-Free Initiative 2022' },
    caption: { mr: 'कापडी पिशव्यांचे वाटप', en: 'Distribution of cloth bags' },
    kshetra: 'paryavaran',
    year: 2022,
  },
  // ── Aarogya ───────────────────────────────────────────────
  {
    id: 'aa-01',
    src: '/assets/gallery/aarogya-cancer-camp-2024.jpg',
    alt:     { mr: 'कर्करोग निदान शिबीर २०२४', en: 'Cancer Detection Camp 2024' },
    caption: { mr: 'Indian Cancer Society सहकार्याने मोफत तपासणी शिबीर', en: 'Free screening camp in collaboration with Indian Cancer Society' },
    kshetra: 'aarogya',
    year: 2024,
  },
  {
    id: 'aa-02',
    src: '/assets/gallery/aarogya-awareness-2023.jpg',
    alt:     { mr: 'आरोग्य जागृती कार्यक्रम २०२३', en: 'Health Awareness Program 2023' },
    caption: { mr: 'समाजात आरोग्यविषयक जनजागृती', en: 'Health awareness in the community' },
    kshetra: 'aarogya',
    year: 2023,
  },
  {
    id: 'aa-03',
    src: '/assets/gallery/aarogya-camp-2022.jpg',
    alt:     { mr: 'आरोग्य शिबीर २०२२', en: 'Health Camp 2022' },
    caption: { mr: 'वसईतील नागरिकांसाठी आरोग्य शिबीर', en: 'Health camp for Vasai citizens' },
    kshetra: 'aarogya',
    year: 2022,
  },
  // ── Prabodhana ────────────────────────────────────────────
  {
    id: 'pr-01',
    src: '/assets/gallery/prabodhana-vyakhyanmala-2025.jpg',
    alt:     { mr: 'संजीवनी व्याख्यानमाला २०२५', en: 'Sanjeevani Vyakhyanmala 2025' },
    caption: { mr: '२२वी संजीवनी व्याख्यानमाला', en: '22nd Sanjeevani Vyakhyanmala' },
    kshetra: 'prabodhana',
    year: 2025,
  },
  {
    id: 'pr-02',
    src: '/assets/gallery/prabodhana-budget-2024.jpg',
    alt:     { mr: 'अर्थसंकल्प विश्लेषण २०२४', en: 'Budget Analysis 2024' },
    caption: { mr: 'केंद्रीय अर्थसंकल्पावर तज्ज्ञांची चर्चा', en: 'Expert discussion on Union Budget' },
    kshetra: 'prabodhana',
    year: 2024,
  },
  {
    id: 'pr-03',
    src: '/assets/gallery/prabodhana-vyakhyanmala-2023.jpg',
    alt:     { mr: 'संजीवनी व्याख्यानमाला २०२३', en: 'Sanjeevani Vyakhyanmala 2023' },
    caption: { mr: '२१वी संजीवनी व्याख्यानमाला', en: '21st Sanjeevani Vyakhyanmala' },
    kshetra: 'prabodhana',
    year: 2023,
  },
  {
    id: 'pr-04',
    src: '/assets/gallery/prabodhana-investment-2022.jpg',
    alt:     { mr: 'गुंतवणूक कार्यशाळा २०२२', en: 'Investment Workshop 2022' },
    caption: { mr: 'शेअर बाजार व गुंतवणूक मार्गदर्शन', en: 'Stock market and investment guidance' },
    kshetra: 'prabodhana',
    year: 2022,
  },
  // ── General ───────────────────────────────────────────────
  {
    id: 'gen-01',
    src: '/assets/gallery/general-31years-2024.jpg',
    alt:     { mr: '३१ वर्षे पूर्ण सोहळा', en: '31 Years Celebration' },
    caption: { mr: 'संजीवनी परिवाराच्या ३१ वर्षांच्या प्रवासाचा सोहळा', en: 'Celebration of 31 years of Sanjeevani Parivar\'s journey' },
    kshetra: 'general',
    year: 2024,
  },
  {
    id: 'gen-02',
    src: '/assets/gallery/general-team-2023.jpg',
    alt:     { mr: 'संजीवनी परिवार कार्यकर्ते', en: 'Sanjeevani Parivar team' },
    caption: { mr: 'समर्पित कार्यकर्त्यांची टीम', en: 'Our dedicated team of volunteers' },
    kshetra: 'general',
    year: 2023,
  },
];

export const GALLERY_YEARS = [...new Set(GALLERY.map((g) => g.year))].sort((a, b) => b - a);
