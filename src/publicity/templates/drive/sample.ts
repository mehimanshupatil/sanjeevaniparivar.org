// Sample content for the `drive` template (gallery + try-out editor).
// Near the template's limits: a long intro, two closing paragraphs, 4 contacts. Names and numbers are made up.
import type { EditionData, Entry, ProgrammeData } from '../../edition';

export const programme: Entry<ProgrammeData> = {
  id: 'namuna-abhiyan',
  data: {
    title: { top: 'संजीवनी परिवार आयोजित', main: 'वृक्षारोपण अभियान' },
    type: 'drive',
    kshetra: 'paryavaran',
    theme: 'paryavaran',
    formats: ['whatsapp', 'instagram'],
    logos: { left: 'sanjeevani' },
    invite: '॥ झाडे लावा, झाडे जगवा ॥',
    intro: 'संजीवनी परिवारातर्फे दरवर्षीप्रमाणे गावातील शाळा, मंदिर व रस्त्यांच्या कडेने देशी झाडांचे वृक्षारोपण करण्यात येणार आहे. लावलेल्या प्रत्येक रोपाची वर्षभर काळजी घेतली जाईल.',
    closing: [
      { text: 'समाजबांधवांनी सदर अभियानात मोठ्या संख्येने सहभागी होऊन ते यशस्वी करावे.' },
      { text: 'चला, आपण सर्वजण एकत्र येऊन आपला परिसर हिरवागार करण्याच्या दिशेने एक पाऊल पुढे टाकूया.', emphasis: true },
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
    days: [{ date: '2027-07-04', from: '07:30', to: '10:00' }],
    venue: ['संजीवनी विद्यालय परिसर,', 'वसई (पश्चिम)'],
  },
};
