// Sample content for the `workshop` template (gallery + try-out editor).
// Near the template's limits: 5 terms, a note, 6 contacts. Names and numbers are made up.
import type { EditionData, Entry, ProgrammeData } from '../../edition';

export const programme: Entry<ProgrammeData> = {
  id: 'namuna-karyashala',
  data: {
    title: { top: 'संजीवनी परिवार आयोजित', main: 'चित्रकला कार्यशाळा' },
    type: 'workshop',
    kshetra: 'shikshan',
    theme: 'kalaDalan',
    formats: ['whatsapp', 'instagram', 'wide'],
    logos: { left: 'sanjeevani' },
    startedYear: 2020,
    invite: '॥ संजीवनी कलादालन ॥',
    intro: 'विद्यार्थ्यांच्या सुप्त कलागुणांना वाव मिळावा यासाठी गेली {{ yearsRunning }} वर्षे संजीवनी परिवार विविध कार्यशाळांचे आयोजन करत आहे.',
    rulesHeading: 'महत्त्वाची माहिती',
    rules: [
      'कार्यशाळेतील सहभागासाठी ₹१००/- प्रवेश शुल्क आकारले जाईल.',
      'चित्रकलेसाठी आवश्यक ते सर्व साहित्य पुरविले जाईल.',
      'सहभागी विद्यार्थ्यांना चहा/नाश्ता जागेवर दिला जाईल.',
      'कार्यशाळेसाठी ८ वर्षांवरील विद्यार्थ्यांना सहभाग घेता येईल.',
      'कार्यशाळेच्या शेवटी सर्व सहभागी विद्यार्थ्यांना प्रमाणपत्र दिले जाईल.',
    ],
    note: { label: 'वि. सू.', text: 'जागा मर्यादित असल्याने नावे लवकरात लवकर नोंदवावीत.' },
    contactsHeading: 'संपर्क',
    contactsIntro: 'आपली नावे खालील क्रमांकांवर फोन करून, मेसेज करून किंवा आपल्या गावातील संजीवनी प्रतिनिधीकडे नोंदवावीत.',
    contacts: [
      { name: 'प्रतिनिधी एक', phone: '9000000001' },
      { name: 'प्रतिनिधी दोन', phone: '9000000002' },
      { name: 'प्रतिनिधी तीन', phone: '9000000003' },
      { name: 'प्रतिनिधी चार', phone: '9000000004' },
      { name: 'प्रतिनिधी पाच', phone: '9000000005' },
      { name: 'प्रतिनिधी सहा', phone: '9000000006' },
    ],
  },
};

export const edition: Entry<EditionData> = {
  id: 'sample',
  data: {
    programme: { collection: 'programmes', id: programme.id },
    days: [{ date: '2027-10-17', from: '08:30', to: '13:00' }],
    venue: ['संजीवनी सभागृह,', 'वसई (पश्चिम)'],
  },
};
