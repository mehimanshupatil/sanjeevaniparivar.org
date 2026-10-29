// Sample content for the `lectures` template (gallery + try-out editor).
// Near the template's limits: three lectures with roles and topic notes, an ओवी, an intro,
// two contacts. Speakers, topics and numbers are made up.
import type { EditionData, Entry, ProgrammeData } from '../../edition';

const photo = '/publicity/assets/people/namuna.svg';

export const programme: Entry<ProgrammeData> = {
  id: 'namuna-vyakhyanmala',
  data: {
    title: { main: 'संजीवनी व्याख्यानमाला', sub: 'वर्ष {{ editionNo }} वे' },
    type: 'lectures',
    kshetra: 'prabodhana',
    theme: 'prabodhan',
    formats: ['whatsapp', 'instagram', 'wide'],
    logos: { left: 'sanjeevani' },
    startedYear: 2003,
    invite: '॥ सस्नेह निमंत्रण ॥',
    quote: { text: 'हें सारस्वताचें गोड । तुम्हींचि लाविलें जी झाड ।\nतरी आतां अवधानामृतें वाड । सिंपोनि कीजे ॥' },
    intro: 'विविध क्षेत्रांतील नामांकित वक्ते नानाविध विषयांद्वारे जगाचा अंतर्बाह्य वेध घेणारे व्यासपीठ म्हणजे संजीवनी व्याख्यानमाला.',
    closing: [
      { text: 'आपणा सर्वांना मनःपूर्वक आमंत्रण!', emphasis: true },
      { text: 'अवश्य या! विचारांचे नाते जपू या, थोडेसे अंतर्मुख होऊ या!' },
    ],
    contactsHeading: 'संपर्क',
    contacts: [
      { name: 'प्रतिनिधी एक', phone: '9000000001' },
      { name: 'प्रतिनिधी दोन', phone: '9000000002' },
    ],
    footer: '॥ संजीवनी परिवार ॥',
  },
};

export const edition: Entry<EditionData> = {
  id: 'sample',
  data: {
    programme: { collection: 'programmes', id: programme.id },
    days: [
      { date: '2027-04-25', at: '18:00' },
      { date: '2027-05-01', at: '18:00' },
      { date: '2027-05-02', at: '18:00' },
    ],
    venue: ['संजीवनी सभागृह पटांगण,', 'वसई (पश्चिम)'],
    sessions: [
      {
        speaker: { name: 'प्रा. डॉ. वक्ता एक', role: 'ज्येष्ठ लेखक व संशोधक', photo },
        topic: 'वाचनाचा आनंद',
        topicNote: '(पुस्तके, लेखक आणि वाचकांचे नाते — निवडक उताऱ्यांसह)',
        bio: 'प्रा. डॉ. वक्ता एक गेली तीस वर्षे मराठी साहित्याचे अध्यापन करत असून त्यांची पंधरा पुस्तके प्रकाशित झाली आहेत. विविध दैनिकांमधून त्यांनी सातत्याने लेखन केले असून अनेक राज्यस्तरीय पुरस्कारांनी त्यांना गौरवण्यात आले आहे.',
        closing: 'साहित्य आणि विचारांची ही मैफिल अनुभवण्यासाठी अवश्य उपस्थित राहावे, ही नम्र विनंती.',
      },
      { speaker: { name: 'श्री. वक्ता दोन', role: 'ज्येष्ठ संपादक', photo }, topic: 'इतिहासाच्या पाऊलखुणा' },
      { speaker: { name: 'श्री. वक्ता तीन', role: 'संस्थापक, एक सामाजिक संस्था', photo }, topic: 'चांगल्या समाजासाठी!' },
    ],
  },
};
