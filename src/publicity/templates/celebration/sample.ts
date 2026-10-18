// Sample content for the `celebration` template (gallery + try-out editor).
// Near the template's limits: a long intro and note. Wording is made up.
import type { EditionData, Entry, ProgrammeData } from '../../edition';

export const programme: Entry<ProgrammeData> = {
  id: 'namuna-din',
  data: {
    title: { main: 'वाचन प्रेरणा दिन', sub: '(डॉ. ए. पी. जे. अब्दुल कलाम जयंती)' },
    type: 'celebration',
    kshetra: 'shikshan',
    theme: 'sahitya',
    formats: ['whatsapp', 'instagram'],
    logos: { left: 'sanjeevani' },
    invite: '॥ संजीवनी परिवार ॥',
    intro: 'वाचनाची आवड जोपासण्यासाठी तसेच डॉ. ए. पी. जे. अब्दुल कलाम यांच्या स्मृतीस अभिवादन करण्यासाठी संजीवनी परिवाराच्या वाचन अभियानांतर्गत “वाचन प्रेरणा दिन” साजरा करण्यात येणार आहे.',
    note: { label: 'कार्यक्रम', text: 'वाचन अभियान केंद्रातील विद्यार्थी आपल्या आवडत्या पुस्तकांवर मनोगत व्यक्त करणार असून निवडक उताऱ्यांचे अभिवाचन सादर करणार आहेत.' },
    closing: [{ text: 'आपली उपस्थिती विद्यार्थ्यांचा उत्साह वाढवणारी ठरेल.', emphasis: true }],
    footer: 'आपला\nसंजीवनी परिवार',
    portrait: { src: '/publicity/assets/people/namuna.svg', caption: 'डॉ. ए. पी. जे. अब्दुल कलाम', garland: true },
  },
};

export const edition: Entry<EditionData> = {
  id: 'sample',
  data: {
    programme: { collection: 'programmes', id: programme.id },
    days: [{ date: '2027-10-15', at: '18:30' }],
    venue: ['संजीवनी विद्यालय सभागृह,', 'वसई (पश्चिम)'],
  },
};
