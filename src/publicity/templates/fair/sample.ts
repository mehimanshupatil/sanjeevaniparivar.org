// Sample content for the `fair` template: shown in the template gallery and as the
// starting point of the try-out editor. Deliberately near the template's limits
// (3 days, 8 attractions) so the gallery shows how much fits.
import type { EditionData, Entry, ProgrammeData } from '../../edition';

export const programme: Entry<ProgrammeData> = {
  id: 'namuna-bazar',
  data: {
    title: { top: 'संजीवनी परिवार आयोजित', main: 'दिवाळी बाजार' },
    type: 'fair',
    kshetra: 'general',
    theme: 'diwali',
    formats: ['whatsapp', 'instagram', 'wide'],
    logos: { left: 'sanjeevani', right: 'jaimuni' },
    invite: '॥ सस्नेह निमंत्रण ॥',
    tagline: 'दिवाळीच्या खरेदीचा आनंद, आपल्या माणसांसोबत!',
    organisers: ['संजीवनी परिवार', 'जैमुनी सहकारी पतपेढी मर्यादित'],
    intro: 'स्थानिक उद्योजकांना प्रोत्साहन देण्यासाठी आणि दिवाळीचा आनंद वाढवण्यासाठी आपण सर्वांनी एकत्र येऊया!',
    itemsHeading: 'बाजारातील आकर्षणे',
    items: [
      'आकाशकंदील आणि पणत्या',
      'दिवाळी फराळ',
      'कपडे आणि साड्या',
      'भेटवस्तू',
      'घरगुती खाद्यपदार्थ',
      'रांगोळी साहित्य',
      'पुस्तके',
      'मुलांसाठी खेळ',
    ],
    itemsMore: 'आणि बरेच काही…',
    closing: [
      { text: 'सर्व समाज बंधू-भगिनींना आग्रहाचे निमंत्रण!', emphasis: true },
      { text: 'आपण सहकुटुंब उपस्थित राहून {{ fullTitle }}ची शोभा वाढवावी, ही नम्र विनंती!' },
    ],
    footer: 'नक्की या… आपल्या माणसांसाठी!',
  },
};

export const edition: Entry<EditionData> = {
  id: 'sample',
  data: {
    programme: { collection: 'programmes', id: programme.id },
    days: [
      { date: '2027-10-29', from: '17:00', to: '22:00' },
      { date: '2027-10-30', from: '10:00', to: '22:00' },
      { date: '2027-10-31', from: '10:00', to: '21:00' },
    ],
    venue: ['संजीवनी सभागृह,', 'वसई (पश्चिम)'],
  },
};
