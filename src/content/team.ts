export type Bilingual = { mr: string; en: string };

export interface TeamMember {
  id: string;
  name: string;
  role: Bilingual;
  bio: Bilingual;
  /** Path under /public/assets/team/ — optional */
  photo?: string;
}

export const TEAM: TeamMember[] = [
  {
    id: 'tm-01',
    name: 'श्री. [नाव]',
    role: { mr: 'संस्थापक अध्यक्ष', en: 'Founding President' },
    bio: {
      mr: '१९९४ पासून संजीवनी परिवाराची स्थापना करून सामाजिक कार्याला वाहून घेतलेले.',
      en: 'Founded Sanjeevani Parivar in 1994 and dedicated to social service since.',
    },
  },
  {
    id: 'tm-02',
    name: 'श्री. [नाव]',
    role: { mr: 'कार्याध्यक्ष', en: 'Working President' },
    bio: {
      mr: 'शिक्षण आणि प्रबोधना क्षेत्रात अग्रणी कार्यकर्ते.',
      en: 'Leading activist in Education and Enlightenment initiatives.',
    },
  },
  {
    id: 'tm-03',
    name: 'श्री. [नाव]',
    role: { mr: 'सचिव', en: 'Secretary' },
    bio: {
      mr: 'पर्यावरण उपक्रमांचे समन्वयक. वृक्षवाढदिवस उत्सवाचे प्रमुख आयोजक.',
      en: 'Coordinator of environment initiatives. Chief organiser of Tree Birthday Celebrations.',
    },
  },
  {
    id: 'tm-04',
    name: 'श्री. [नाव]',
    role: { mr: 'खजिनदार', en: 'Treasurer' },
    bio: {
      mr: 'आर्थिक नियोजन आणि पारदर्शकतेसाठी जबाबदार.',
      en: 'Responsible for financial planning and transparency.',
    },
  },
  {
    id: 'tm-05',
    name: 'डॉ. [नाव]',
    role: { mr: 'आरोग्य विभाग प्रमुख', en: 'Health Wing Head' },
    bio: {
      mr: 'आरोग्य शिबिरे आणि जनजागृती कार्यक्रमांचे आयोजन.',
      en: 'Organises health camps and awareness programmes.',
    },
  },
  {
    id: 'tm-06',
    name: 'श्री. [नाव]',
    role: { mr: 'शिक्षण विभाग प्रमुख', en: 'Education Wing Head' },
    bio: {
      mr: 'विद्यार्थी उपक्रम, स्पर्धा आणि शिष्यवृत्ती कार्यक्रमांचे प्रमुख.',
      en: 'Leads student initiatives, competitions and scholarship programmes.',
    },
  },
];
