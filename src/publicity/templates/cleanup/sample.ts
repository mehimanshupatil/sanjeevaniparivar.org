// Sample content for the `cleanup` template (gallery + try-out editor).
// Near the template's limits: a long intro, two closing paragraphs, 4 contacts. Names and numbers are made up.
import type { EditionData, Entry, ProgrammeData } from '../../edition';

export const programme: Entry<ProgrammeData> = {
  id: 'namuna-swachhata',
  data: {
    title: { top: 'संजीवनी परिवार आयोजित', main: 'समुद्र किनारा स्वच्छता' },
    type: 'cleanup',
    kshetra: 'paryavaran',
    theme: 'swachhata',
    formats: ['whatsapp', 'instagram'],
    logos: { left: 'sanjeevani' },
    invite: '॥ स्वच्छ किनारा, सुंदर किनारा ॥',
    intro: 'संजीवनी परिवारातर्फे दरवर्षीप्रमाणे समुद्र किनाऱ्यावरील प्लास्टिक व कचरा गोळा करून किनारा स्वच्छ करण्यात येणार आहे. हातमोजे व पिशव्या आयोजकांतर्फे दिल्या जातील.',
    closing: [
      { text: 'समाजबांधवांनी सदर अभियानात मोठ्या संख्येने सहभागी होऊन ते यशस्वी करावे.' },
      { text: 'चला, आपण सर्वजण एकत्र येऊन आपला किनारा स्वच्छ ठेवण्याच्या दिशेने एक पाऊल पुढे टाकूया.', emphasis: true },
    ],
    contactsHeading: 'संपर्क',
    contacts: [
      { name: 'प्रतिनिधी एक', phone: '9000000001' },
      { name: 'प्रतिनिधी दोन', phone: '9000000002' },
      { name: 'प्रतिनिधी तीन', phone: '9000000003' },
      { name: 'प्रतिनिधी चार', phone: '9000000004' },
    ],
    footer: '॥ संजीवनी परिवार ॥',
  },
};

export const edition: Entry<EditionData> = {
  id: 'sample',
  data: {
    programme: { collection: 'programmes', id: programme.id },
    days: [{ date: '2027-01-24', from: '07:00', to: '09:30' }],
    venue: ['भुईगाव समुद्र किनारा,', 'वसई (पश्चिम)'],
  },
};
