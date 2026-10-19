import type { Bilingual } from '@/i18n/translations';

// कार्यकारी मंडळ (Executive Committee), from the trust's 17th annual report (2025–26).
// Update when a new committee is elected.

export const TEAM_TERM: Bilingual = { mr: '२०२४ – २०२९', en: '2024 – 2029' };

export interface TeamMember {
  id: string;
  /** Without "श्री.", which the page adds in Marathi */
  name: Bilingual;
  role: Bilingual;
  /** Path under /public/assets/team/ — optional */
  photo?: string;
}

/** Office bearers, in the order of the report */
export const TEAM: TeamMember[] = [
  { id: 'adhyaksha', name: { mr: 'आनंद गजानन पाटील', en: 'Anand Gajanan Patil' }, role: { mr: 'अध्यक्ष', en: 'President' } },
  { id: 'upadhyaksha', name: { mr: 'नरेश विष्णू जोशी', en: 'Naresh Vishnu Joshi' }, role: { mr: 'उपाध्यक्ष', en: 'Vice President' } },
  { id: 'sachiv', name: { mr: 'किशोर वासुदेव वझे', en: 'Kishor Vasudev Vaze' }, role: { mr: 'सचिव', en: 'Secretary' } },
  { id: 'khajindar', name: { mr: 'चंद्रकांत दत्तात्रेय नाईक', en: 'Chandrakant Dattatray Naik' }, role: { mr: 'खजिनदार', en: 'Treasurer' } },
  { id: 'sahasachiv', name: { mr: 'रोहन अशोक नाईक', en: 'Rohan Ashok Naik' }, role: { mr: 'सहसचिव', en: 'Joint Secretary' } },
  { id: 'sahakhajindar', name: { mr: 'चिराग सुरेश पाटील', en: 'Chirag Suresh Patil' }, role: { mr: 'सहखजिनदार', en: 'Joint Treasurer' } },
  { id: 'margadarshak', name: { mr: 'राजू बळवंत नाईक', en: 'Raju Balwant Naik' }, role: { mr: 'मार्गदर्शक', en: 'Mentor' } },
];

/** Members (सदस्य), in the order of the report */
export const MEMBERS: Bilingual[] = [
  { mr: 'कमळाकर काशिनाथ पाटील', en: 'Kamalakar Kashinath Patil' },
  { mr: 'अरविंद केशव पाटील', en: 'Arvind Keshav Patil' },
  { mr: 'हेमंत महादेव नाईक', en: 'Hemant Mahadev Naik' },
  { mr: 'मनोज भालचंद्र पाटील', en: 'Manoj Bhalchandra Patil' },
  { mr: 'विलास भास्कर नाईक', en: 'Vilas Bhaskar Naik' },
  { mr: 'अनिल परशुराम पाटील', en: 'Anil Parshuram Patil' },
  { mr: 'अविनाश सदानंद नाईक', en: 'Avinash Sadanand Naik' },
  { mr: 'दिलीप भाऊ जोशी', en: 'Dilip Bhau Joshi' },
  { mr: 'अनंत दत्तात्रय नाईक', en: 'Anant Dattatray Naik' },
  { mr: 'सुभाष सखाराम नाईक', en: 'Subhash Sakharam Naik' },
  { mr: 'हिमांशू विलास पाटील', en: 'Himanshu Vilas Patil' },
  { mr: 'प्रलोभ गजानन म्हात्रे', en: 'Pralobh Gajanan Mhatre' },
  { mr: 'अक्षय नरेश म्हात्रे', en: 'Akshay Naresh Mhatre' },
  { mr: 'सुनील विनायक म्हात्रे', en: 'Sunil Vinayak Mhatre' },
];
