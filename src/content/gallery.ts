import type { Bilingual } from '@/i18n/translations';

export interface GalleryItem {
  id: string;
  /** Path under /public/ */
  src: string;
  alt: Bilingual;
  caption?: Bilingual;
  /** kshetra slug or 'general' */
  kshetra: 'shikshan' | 'paryavaran' | 'aarogya' | 'prabodhana' | 'general';
  year: number;
}

export const GALLERY: GalleryItem[] = [
  // ── Shikshan ──────────────────────────────────────────────
  {
    id: 'sh-01',
    src: '/assets/uploads/2016/07/vakrutva_spardha.jpg',
    alt: { mr: 'वक्तृत्व स्पर्धा', en: 'Elocution Competition' },
    caption: { mr: 'वार्षिक वक्तृत्व स्पर्धा — विद्यार्थ्यांनी उत्साहाने सहभाग घेतला', en: 'Annual elocution competition — students participated enthusiastically' },
    kshetra: 'shikshan',
    year: 2016,
  },
  {
    id: 'sh-02',
    src: '/assets/uploads/2016/07/kautuk_samarambha_2016_1.jpg',
    alt: { mr: 'कौतुक समारंभ २०१६', en: 'Student Felicitation 2016' },
    caption: { mr: 'गुणवंत विद्यार्थ्यांचा सन्मान — कौतुक समारंभ', en: 'Honouring meritorious students — felicitation ceremony' },
    kshetra: 'shikshan',
    year: 2016,
  },
  {
    id: 'sh-03',
    src: '/assets/uploads/2016/06/Vidyarthi-melawa2.jpg',
    alt: { mr: 'विद्यार्थी मेळावा', en: 'Student Gathering' },
    caption: { mr: 'विद्यार्थी मेळावा — शिक्षण क्षेत्रातील कार्यक्रम', en: 'Student gathering — education program' },
    kshetra: 'shikshan',
    year: 2016,
  },
  {
    id: 'sh-04',
    src: '/assets/uploads/2016/07/futurpathshala.jpg',
    alt: { mr: 'भविष्यपाठशाळा', en: 'Future Pathshala' },
    caption: { mr: 'भविष्यपाठशाळा — विद्यार्थ्यांसाठी करिअर मार्गदर्शन', en: 'Future Pathshala — career guidance for students' },
    kshetra: 'shikshan',
    year: 2016,
  },
  {
    id: 'sh-05',
    src: '/assets/uploads/2016/08/PALAK-SHIBIR-1.jpg',
    alt: { mr: 'पालक शिबीर', en: 'Parents Camp' },
    caption: { mr: 'पालक शिबीर — पालकांसाठी विशेष मार्गदर्शन शिबीर', en: 'Parents camp — special guidance camp for parents' },
    kshetra: 'shikshan',
    year: 2016,
  },
  {
    id: 'sh-06',
    src: '/assets/uploads/2016/07/atmavishvas01.jpg',
    alt: { mr: 'आत्मविश्वास शिबीर', en: 'Self-Confidence Workshop' },
    caption: { mr: 'आत्मविश्वास वर्ग — विद्यार्थ्यांचा व्यक्तिमत्व विकास', en: 'Self-confidence workshop — personality development for students' },
    kshetra: 'shikshan',
    year: 2016,
  },
  // ── Paryavaran ────────────────────────────────────────────
  {
    id: 'pa-01',
    src: '/assets/uploads/2016/07/tree_birthday.jpg',
    alt: { mr: 'वृक्षवाढदिवस', en: 'Tree Birthday Celebration' },
    caption: { mr: 'वृक्षवाढदिवस उत्सव — झाडांचा वाढदिवस साजरा केला', en: 'Tree birthday celebration — celebrating the trees\' anniversary' },
    kshetra: 'paryavaran',
    year: 2016,
  },
  {
    id: 'pa-02',
    src: '/assets/uploads/2016/07/trees_birthday_01.jpg',
    alt: { mr: 'वृक्षवाढदिवस सोहळा', en: 'Tree Birthday Ceremony' },
    caption: { mr: 'वृक्षवाढदिवस सोहळ्यातील क्षण', en: 'Moments from the tree birthday ceremony' },
    kshetra: 'paryavaran',
    year: 2016,
  },
  {
    id: 'pa-03',
    src: '/assets/uploads/2017/07/vrukshancha-vaddivas-17-1.jpg',
    alt: { mr: 'वृक्षांचा वाढदिवस २०१७', en: 'Tree Birthday 2017' },
    caption: { mr: 'वृक्षांचा वाढदिवस — वसईतील वृक्षप्रेमींचा उत्सव', en: 'Tree birthday — celebration by nature lovers of Vasai' },
    kshetra: 'paryavaran',
    year: 2017,
  },
  {
    id: 'pa-04',
    src: '/assets/uploads/2017/04/nim1.jpg',
    alt: { mr: 'लिंब वृक्षारोपण', en: 'Neem Tree Plantation' },
    caption: { mr: 'लिंब वृक्षारोपण अभियान — पर्यावरण संरक्षणासाठी', en: 'Neem tree plantation drive — for environmental conservation' },
    kshetra: 'paryavaran',
    year: 2017,
  },
  // ── Aarogya ───────────────────────────────────────────────
  {
    id: 'aa-01',
    src: '/assets/uploads/2016/07/arogya01.jpg',
    alt: { mr: 'आरोग्य उपक्रम', en: 'Health Initiative' },
    caption: { mr: 'आरोग्य उपक्रम — समाजातील नागरिकांसाठी', en: 'Health initiative — for community members' },
    kshetra: 'aarogya',
    year: 2016,
  },
  {
    id: 'aa-02',
    src: '/assets/uploads/2016/07/arogya02.jpg',
    alt: { mr: 'आरोग्य शिबीर', en: 'Health Camp' },
    caption: { mr: 'आरोग्य शिबीर — वसईतील नागरिकांसाठी मोफत तपासणी', en: 'Health camp — free health check-up for Vasai citizens' },
    kshetra: 'aarogya',
    year: 2016,
  },
  // ── Prabodhana ────────────────────────────────────────────
  {
    id: 'pr-01',
    src: '/assets/uploads/2016/06/SPVyakhyan01_2013.jpg',
    alt: { mr: 'संजीवनी व्याख्यानमाला २०१३', en: 'Sanjeevani Vyakhyanmala 2013' },
    caption: { mr: 'संजीवनी व्याख्यानमाला — विचारवंतांची व्याख्याने', en: 'Sanjeevani Vyakhyanmala — lectures by eminent thinkers' },
    kshetra: 'prabodhana',
    year: 2013,
  },
  {
    id: 'pr-02',
    src: '/assets/uploads/2016/06/vyakhyanmala1_01.jpg',
    alt: { mr: 'व्याख्यानमाला', en: 'Vyakhyanmala Lecture Series' },
    caption: { mr: 'व्याख्यानमाला — समाजप्रबोधनाचा कार्यक्रम', en: 'Vyakhyanmala — community awareness program' },
    kshetra: 'prabodhana',
    year: 2016,
  },
  {
    id: 'pr-03',
    src: '/assets/uploads/2016/08/vakhayan14-1.jpg',
    alt: { mr: 'व्याख्यानमाला १४वी आवृत्ती', en: 'Vyakhyanmala 14th Edition' },
    caption: { mr: '१४वी व्याख्यानमाला — विशेष वक्त्यांची उपस्थिती', en: '14th Vyakhyanmala — special speakers in attendance' },
    kshetra: 'prabodhana',
    year: 2016,
  },
  {
    id: 'pr-04',
    src: '/assets/uploads/2016/08/prabodhan_slider.jpg',
    alt: { mr: 'प्रबोधन कार्यक्रम', en: 'Awareness Program' },
    caption: { mr: 'प्रबोधन — समाजातील जनजागृती कार्यक्रम', en: 'Awareness — community enlightenment program' },
    kshetra: 'prabodhana',
    year: 2016,
  },
  // ── General ───────────────────────────────────────────────
  {
    id: 'gen-01',
    src: '/assets/uploads/2016/07/sanjivanikatta.jpg',
    alt: { mr: 'संजीवनी कट्टा', en: 'Sanjeevani Katta' },
    caption: { mr: 'संजीवनी कट्टा — कार्यकर्त्यांचे अनौपचारिक मेळावे', en: 'Sanjeevani Katta — informal gatherings of volunteers' },
    kshetra: 'general',
    year: 2016,
  },
  {
    id: 'gen-02',
    src: '/assets/uploads/2016/06/melawa1.jpg',
    alt: { mr: 'संजीवनी परिवार मेळावा', en: 'Sanjeevani Parivar Gathering' },
    caption: { mr: 'संजीवनी परिवाराचा वार्षिक मेळावा', en: 'Annual gathering of Sanjeevani Parivar members' },
    kshetra: 'general',
    year: 2016,
  },
];

export const GALLERY_YEARS = [...new Set(GALLERY.map((g) => g.year))].sort((a, b) => b - a);
