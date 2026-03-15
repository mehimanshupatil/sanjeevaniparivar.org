export type Bilingual = { mr: string; en: string };

export interface Event {
  id: string;
  title: Bilingual;
  date: string;          // ISO date string
  time?: string;
  venue: Bilingual;
  desc: Bilingual;
  kshetra: 'shikshan' | 'paryavaran' | 'aarogya' | 'prabodhana' | 'general';
  upcoming: boolean;
}

export const EVENTS: Event[] = [
  {
    id: 'ev-01',
    title:   { mr: '२२वी संजीवनी व्याख्यानमाला', en: '22nd Sanjeevani Vyakhyanmala' },
    date:    '2025-04-01',
    time:    '6:00 PM',
    venue:   { mr: 'साने गुरुजी सभागृह, वसई', en: 'Sane Guruji Sabhagruh, Vasai' },
    desc:    { mr: 'वार्षिक व्याख्यानमाला — विविध विषयांवर तज्ज्ञांची व्याख्याने', en: 'Annual lecture series — expert talks on diverse topics' },
    kshetra: 'prabodhana',
    upcoming: true,
  },
  {
    id: 'ev-02',
    title:   { mr: 'वृक्षवाढदिवस उत्सव २०२५', en: 'Tree Birthday Celebration 2025' },
    date:    '2025-06-05',
    time:    '8:00 AM',
    venue:   { mr: 'वसई परिसर', en: 'Vasai Region' },
    desc:    { mr: '२१वा वृक्षवाढदिवस उत्सव — वृक्षारोपण आणि पूजन', en: '21st tree birthday celebration — planting and reverence ceremony' },
    kshetra: 'paryavaran',
    upcoming: true,
  },
  {
    id: 'ev-03',
    title:   { mr: 'आरोग्य शिबीर — मोफत तपासणी', en: 'Free Health Camp' },
    date:    '2025-05-15',
    time:    '9:00 AM',
    venue:   { mr: 'वाघोली, वसई', en: 'Wagholi, Vasai' },
    desc:    { mr: 'रक्तदाब, मधुमेह आणि सामान्य आरोग्य तपासणी', en: 'Blood pressure, diabetes and general health screening' },
    kshetra: 'aarogya',
    upcoming: true,
  },
  {
    id: 'ev-04',
    title:   { mr: 'कर्करोग निदान शिबीर २०२४', en: 'Cancer Detection Camp 2024' },
    date:    '2024-11-10',
    venue:   { mr: 'वसई', en: 'Vasai' },
    desc:    { mr: 'Indian Cancer Society सहकार्याने मोफत कर्करोग तपासणी', en: 'Free cancer screening in collaboration with Indian Cancer Society' },
    kshetra: 'aarogya',
    upcoming: false,
  },
  {
    id: 'ev-05',
    title:   { mr: 'वक्तृत्व स्पर्धा २०२४', en: 'Elocution Competition 2024' },
    date:    '2024-09-20',
    venue:   { mr: 'वसई', en: 'Vasai' },
    desc:    { mr: 'वार्षिक वक्तृत्व स्पर्धा — शाळकरी विद्यार्थ्यांसाठी', en: 'Annual elocution competition for school students' },
    kshetra: 'shikshan',
    upcoming: false,
  },
];

export const UPCOMING_EVENTS = EVENTS.filter((e) => e.upcoming).sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);
