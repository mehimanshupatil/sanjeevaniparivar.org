// Sample content for the `competition` template (gallery + try-out editor).
// Near the template's limits: four groups with three topics each, a rule, a parents' note,
// four contacts. Groups, topics, names and numbers are made up.
import type { EditionData, Entry, ProgrammeData } from '../../edition';

export const programme: Entry<ProgrammeData> = {
  id: 'namuna-spardha',
  data: {
    title: { top: 'संजीवनी', main: 'वक्तृत्व स्पर्धा' },
    type: 'competition',
    kshetra: 'shikshan',
    theme: 'spardha',
    formats: ['whatsapp', 'instagram'],
    logos: { left: 'sanjeevani' },
    yearStyle: 'school',
    invite: '॥ विद्यार्थ्यांसाठी हक्काचे व्यासपीठ ॥',
    intro: 'विद्यार्थ्यांमध्ये संवाद कौशल्य, सभाधीटपणा आणि प्रभावी अभिव्यक्तीची क्षमता विकसित व्हावी यासाठी संजीवनी परिवारातर्फे वक्तृत्व स्पर्धेचे आयोजन करण्यात आले आहे.',
    groupsHeading: 'गट व विषय',
    groups: [
      { name: 'गट १', who: 'इयत्ता १ ली ते ४ थी', topics: ['माझी शाळा', 'माझा आवडता सण', 'पाणी वाचवा'] },
      { name: 'गट २', who: 'इयत्ता ५ वी ते ७ वी', topics: ['मोबाईल : शाप की वरदान', 'माझा आवडता खेळ', 'स्वच्छतेचे महत्त्व'] },
      { name: 'गट ३', who: 'इयत्ता ८ वी ते १० वी', topics: ['वाचनाचे महत्त्व', 'आजचा तरुण', 'पर्यावरण व आपण'] },
      { name: 'गट ४', who: 'खुला गट', topics: ['माझ्या स्वप्नातील भारत', 'शिक्षण आणि मूल्ये', 'समाजमाध्यमांचा प्रभाव'] },
    ],
    rulesHeading: 'नियम',
    rules: ['विद्यार्थ्यांनी आपल्या गटासाठी दिलेल्या कोणत्याही एका विषयावर ५ मिनिटे विचार व्यक्त करावेत.'],
    note: { label: 'पालकांना नम्र निवेदन', text: 'आपला पाल्य स्पर्धेत भाग घेईल असे पहा आणि त्याचे विचार ऐकण्यासाठी अवश्य या!' },
    contactsHeading: 'नावनोंदणी',
    contactsIntro: 'स्पर्धेत सहभागी होणाऱ्या विद्यार्थ्यांनी आपली नावे संजीवनी प्रतिनिधीकडे नोंदवावीत.',
    contacts: [
      { name: 'प्रतिनिधी एक', phone: '9000000001' },
      { name: 'प्रतिनिधी दोन', phone: '9000000002' },
      { name: 'प्रतिनिधी तीन', phone: '9000000003' },
      { name: 'प्रतिनिधी चार', phone: '9000000004' },
    ],
    footer: 'आपला\nसंजीवनी परिवार',
  },
};

export const edition: Entry<EditionData> = {
  id: 'sample',
  data: {
    programme: { collection: 'programmes', id: programme.id },
    days: [{ date: '2027-01-17', at: '15:00' }],
    venue: ['संजीवनी विद्यालय,', 'वसई (पश्चिम)'],
  },
};
