/**
 * ============================================================
 *  KSHETRA CONTENT — single file to edit all four kshetras
 *  Edit text here; the pages and components update automatically.
 * ============================================================
 */

export type Bilingual = { mr: string; en: string };

export interface Activity {
  slug: string;
  title: Bilingual;
  desc: Bilingual;
  /** Optional longer body shown on the individual upakram page */
  body?: Bilingual;
}

export interface KshetraData {
  /** URL slug  e.g. "shikshan" → /shikshan */
  slug: string;
  num: string;
  /** Brand hex used as header/accent colour */
  color: string;
  /** Lighter tint for subtle backgrounds */
  colorTint: string;
  /** Tailwind text colour class matching color */
  colorClass: string;
  label: Bilingual;
  tagline: Bilingual;
  heading: Bilingual;
  body: Bilingual;
  /** Short description used in the About section overview cards */
  overview_desc: Bilingual;
  activities: Activity[];
  stat?: { value: string; label: Bilingual };
  quote?: Bilingual;
  heroImage?: string;
}

export const KSHETRAS: KshetraData[] = [
  // ──────────────────────────────────────────────
  // 01  SHIKSHAN — Education
  // ──────────────────────────────────────────────
  {
    slug: 'shikshan',
    num: '01',
    color: 'var(--color-education)',
    colorTint: 'var(--color-education-tint)',
    colorClass: 'text-education',
    label: { mr: 'शिक्षण क्षेत्र', en: 'Education Kshetra' },
    tagline: { mr: 'ज्ञान हेच सामर्थ्य', en: 'Knowledge is Power' },
    heading: { mr: 'शिक्षणातून समाजपरिवर्तन', en: 'Social Change Through Education' },
    body: {
      mr: 'स्पर्धात्मक शिक्षण क्षेत्रात आपले विद्यार्थी सक्षम व्हावेत म्हणून वेगवेगळ्या विद्यार्थी मार्गदर्शक शिबिराचं आयोजन, वक्तृत्व स्पर्धा, निबंध स्पर्धाचं आयोजन. स्पर्धा परीक्षांचा सराव व्हावा म्हणून आत्मविश्वास आणि प्रेरणा अभियान, वाचनाची आवड निर्माण करण्यासाठी वाचन अभियान. दहावी, बारावी व विशेष प्राविण्य मिळविणाऱ्या विद्यार्थ्यांचे कौतुक.',
      en: 'To empower students in the competitive education arena, student guidance camps, elocution and essay competitions are organised. The Confidence & Inspiration Campaign aids exam preparation, and the Reading Campaign builds a love for reading. Students excelling in SSC, HSC and other achievements are felicitated.',
    },
    overview_desc: {
      mr: 'विद्यार्थी मार्गदर्शन शिबिरे, वक्तृत्व व निबंध स्पर्धा, आत्मविश्वास अभियान, वाचन अभियान आणि विद्यार्थी कौतुक समारंभ',
      en: 'Student guidance camps, elocution & essay competitions, confidence campaign, reading campaign and student felicitation',
    },
    activities: [
      {
        slug: 'vaktrutva-spardha',
        title: { mr: 'वक्तृत्व स्पर्धा', en: 'Elocution Competition' },
        desc: { mr: 'विद्यार्थ्यांमध्ये आत्मविश्वास वाढवण्यासाठी वार्षिक स्पर्धा', en: 'Annual competition to build confidence in students' },
        body: { mr: 'वक्तृत्व स्पर्धा ही संजीवनी परिवाराच्या शिक्षण क्षेत्रातील एक महत्त्वाची स्पर्धा आहे. विद्यार्थ्यांना आपले विचार प्रभावीपणे मांडण्याची संधी देणे, आत्मविश्वास वाढवणे आणि भाषा कौशल्याचा विकास करणे हे या स्पर्धेचे मुख्य उद्दिष्ट आहे.', en: 'The Elocution Competition is one of the flagship initiatives of Sanjeevani Parivar\'s Education Kshetra. The primary goal is to give students an opportunity to express their thoughts effectively, build self-confidence and develop language skills.' },
      },
      {
        slug: 'vachana-prerna-din',
        title: { mr: 'वाचन प्रेरणा दिन', en: 'Reading Inspiration Day' },
        desc: { mr: 'वाचनाची आवड जोपासण्यासाठी विशेष कार्यक्रम', en: 'Special programs to cultivate a love for reading' },
        body: { mr: 'वाचन प्रेरणा दिन हा उपक्रम विद्यार्थ्यांमध्ये वाचनाची सवय रुजवण्यासाठी दरवर्षी आयोजित केला जातो. विविध पुस्तकांची ओळख, लेखक भेट आणि वाचन स्पर्धा यांच्या माध्यमातून वाचन संस्कृती जोपासली जाते.', en: 'Reading Inspiration Day is organized annually to cultivate the habit of reading among students. Through book introductions, author meets and reading competitions, a reading culture is nurtured.' },
      },
      {
        slug: 'vidyarthi-gaurav',
        title: { mr: 'विद्यार्थी गौरव समारंभ', en: 'Student Felicitation' },
        desc: { mr: 'गुणवंत विद्यार्थ्यांचा जाहीर सन्मान', en: 'Public recognition of meritorious students' },
        body: { mr: 'विद्यार्थी गौरव समारंभ हा एक प्रेरणादायी कार्यक्रम आहे ज्यात शैक्षणिक, क्रीडा आणि सांस्कृतिक क्षेत्रात उत्कृष्ट कामगिरी केलेल्या विद्यार्थ्यांचा सार्वजनिक सन्मान केला जातो.', en: 'The Student Felicitation Ceremony is an inspiring event where students who have excelled in academics, sports and cultural activities are publicly honoured.' },
      },
      {
        slug: 'marathi-bhasha-din',
        title: { mr: 'जागतिक मराठी भाषादिन', en: 'World Marathi Language Day' },
        desc: { mr: 'मराठी भाषेचे जतन, संवर्धन आणि प्रसार', en: 'Preservation, promotion and spread of Marathi language' },
        body: { mr: 'जागतिक मराठी भाषादिन साजरा करताना संजीवनी परिवार मराठी भाषेच्या समृद्धीसाठी विविध उपक्रम राबवते. कविता वाचन, निबंध लेखन आणि मराठी साहित्याची ओळख या माध्यमातून मातृभाषेचा अभिमान जागवला जातो.', en: 'Celebrating World Marathi Language Day, Sanjeevani Parivar runs various initiatives for the enrichment of the Marathi language. Through poetry recitation, essay writing and introduction to Marathi literature, pride in the mother tongue is awakened.' },
      },
      {
        slug: 'clay-ganesh',
        title: { mr: 'शाडूमाती गणेश कार्यशाळा', en: 'Clay Ganesh Workshop' },
        desc: { mr: 'पारंपरिक मूर्तिकलेचे शिक्षण देणारी कार्यशाळा', en: 'Workshop teaching traditional idol-making art' },
        body: { mr: 'पर्यावरणपूरक गणेशोत्सव साजरा करण्यासाठी शाडूमातीपासून गणेश मूर्ती बनवण्याची कार्यशाळा आयोजित केली जाते. या कार्यशाळेत मुलांना पारंपरिक भारतीय शिल्पकलेची ओळख करून दिली जाते.', en: 'A workshop for making clay Ganesh idols is organized to celebrate an eco-friendly Ganesh festival. In this workshop, children are introduced to traditional Indian sculpture art.' },
      },
      {
        slug: 'patang-mahotsav',
        title: { mr: 'पतंग महोत्सव', en: 'Kite Festival' },
        desc: { mr: 'आकाश कंदील व पतंग उत्सव — सणाचा आनंद', en: 'Sky lantern and kite festival — celebration of joy' },
        body: { mr: 'पतंग महोत्सव हा एक आनंददायी सांस्कृतिक उत्सव आहे. मकरसंक्रांतीच्या निमित्ताने आयोजित या महोत्सवात मुले पारंपरिक पद्धतीने पतंग उडवण्याचा आनंद घेतात.', en: 'The Kite Festival is a joyful cultural celebration. Organized on the occasion of Makar Sankranti, children in this festival enjoy flying kites in the traditional way.' },
      },
      {
        slug: 'rangoli',
        title: { mr: 'संस्कार भारती रांगोळी', en: 'Sanskar Bharati Rangoli' },
        desc: { mr: 'भारतीय सांस्कृतिक वारसा जपण्यासाठी रांगोळी स्पर्धा', en: 'Rangoli competition to preserve Indian cultural heritage' },
        body: { mr: 'संस्कार भारती रांगोळी स्पर्धा ही भारतीय लोककलेचे जतन आणि संवर्धन करण्यासाठी आयोजित केली जाते. विविध प्रकारच्या रांगोळ्या काढण्याच्या या स्पर्धेत सर्व वयोगटातील स्पर्धक सहभागी होतात.', en: 'The Sanskar Bharati Rangoli competition is organized to preserve and promote Indian folk art. Participants from all age groups take part in this competition to draw various types of rangoli.' },
      },
      {
        slug: 'aero-modelling',
        title: { mr: 'एरो मॉडेलिंग शो', en: 'Aero Modelling Show' },
        desc: { mr: 'विज्ञान व तंत्रज्ञानाची गोडी लावणारा विशेष कार्यक्रम', en: 'Special event to spark interest in science and technology' },
        body: { mr: 'एरो मॉडेलिंग शो हा विद्यार्थ्यांमध्ये विज्ञान आणि तंत्रज्ञानाची आवड निर्माण करण्यासाठी आयोजित केला जातो. विमानांचे छोटे मॉडेल बनवणे आणि उडवणे या अनोख्या अनुभवातून मुलांमध्ये STEM शिक्षणाची गोडी वाढते.', en: 'The Aero Modelling Show is organized to create interest in science and technology among students. Through the unique experience of building and flying small aircraft models, children\'s interest in STEM education increases.' },
      },
    ],
    quote: {
      mr: '"शिक्षण हे सर्वात शक्तिशाली शस्त्र आहे जे तुम्ही जगाला बदलण्यासाठी वापरू शकता."',
      en: '"Education is the most powerful weapon which you can use to change the world."',
    },
  },

  // ──────────────────────────────────────────────
  // 02  PARYAVARAN — Environment
  // ──────────────────────────────────────────────
  {
    slug: 'paryavaran',
    num: '02',
    color: 'var(--color-environment)',
    colorTint: 'var(--color-environment-tint)',
    colorClass: 'text-environment',
    label: { mr: 'पर्यावरण क्षेत्र', en: 'Environment Kshetra' },
    tagline: { mr: 'निसर्ग वाचवा, भविष्य जगवा', en: 'Save Nature, Sustain the Future' },
    heading: { mr: 'निसर्गाचे रक्षण, भविष्याचे संरक्षण', en: 'Protecting Nature, Securing the Future' },
    body: {
      mr: 'निर्मळ श्रीमत शंकराचार्य मंदीर परिसरात श्री सायनेकर सरांच्या प्रेरणेतून आकारलेला (सन २००५ पासून) वृक्षारोपण व वृक्षसंवर्धन प्रकल्प, विद्यार्थ्यांच्या सहभागाने श्रमदान, स्वच्छता अभियान इत्यादी उपक्रम.',
      en: 'Inspired by Shri Saynekar sir, a tree plantation and conservation project has taken shape at the Nirmal Shrimat Shankaracharya temple premises since 2005 — with Shramdan and cleanliness drives involving active student participation.',
    },
    overview_desc: {
      mr: 'श्री सायनेकर सरांच्या प्रेरणेतून (सन २००५ पासून) वृक्षारोपण व वृक्षसंवर्धन प्रकल्प, श्रमदान व स्वच्छता अभियान',
      en: 'Tree plantation & conservation project since 2005 inspired by Shri Saynekar sir, Shramdan & cleanliness drives',
    },
    activities: [
      {
        slug: 'vriksha-vadhadiws',
        title: { mr: 'वृक्षवाढदिवस उत्सव', en: 'Tree Birthday Celebration' },
        desc: { mr: 'गेली २० वर्षे सातत्याने साजरा होणारा अनोखा उत्सव', en: 'A unique celebration running continuously for 20 years' },
        body: { mr: 'वृक्षवाढदिवस उत्सव हा संजीवनी परिवाराचा सर्वात अनोखा उपक्रम आहे. लावलेल्या झाडांचा वाढदिवस साजरा करण्याची ही संकल्पना गेली २० वर्षे सातत्याने सुरू आहे. झाडांशी भावनिक नाते जोडणे आणि त्यांच्या संगोपनाची जबाबदारी घेणे हे या उत्सवाचे मुख्य उद्दिष्ट आहे.', en: 'The Tree Birthday Celebration is Sanjeevani Parivar\'s most unique initiative. The concept of celebrating the birthday of planted trees has been running continuously for 20 years. The main goal of this celebration is to build an emotional bond with trees and take responsibility for their care.' },
      },
      {
        slug: 'vriksha-ropan',
        title: { mr: 'वृक्षारोपण अभियान', en: 'Tree Plantation Drive' },
        desc: { mr: 'मोठ्या प्रमाणावर झाडे लावणे, जगवणे आणि संवर्धन करणे', en: 'Large-scale planting, nurturing and conservation of trees' },
        body: { mr: 'वृक्षारोपण अभियानांतर्गत दरवर्षी मोठ्या प्रमाणावर वृक्षारोपण केले जाते. केवळ झाडे लावणे नव्हे, तर त्यांची काळजी घेणे, संगोपन करणे आणि ती जगवणे हे संजीवनी परिवाराचे उद्दिष्ट आहे.', en: 'Under the Tree Plantation Drive, large-scale tree planting is done every year. Sanjeevani Parivar\'s goal is not just to plant trees but to take care of them, nurture them and ensure their survival.' },
      },
      {
        slug: 'mandir-swachchhata',
        title: { mr: 'मंदिर परिसर स्वच्छता', en: 'Temple Premises Cleanliness' },
        desc: { mr: 'धार्मिक स्थळांचे परिसर स्वच्छ ठेवणे', en: 'Keeping the surroundings of religious places clean' },
        body: { mr: 'मंदिर परिसर स्वच्छता अभियानांतर्गत वसईतील विविध मंदिरे आणि धार्मिक स्थळांचा परिसर स्वच्छ ठेवण्याचे काम संजीवनी परिवार नियमितपणे करते. स्वच्छतेचा संदेश समाजापर्यंत पोहोचवणे हे या अभियानाचे उद्दिष्ट आहे.', en: 'Under the Temple Premises Cleanliness campaign, Sanjeevani Parivar regularly keeps the surroundings of various temples and religious places in Vasai clean. The goal of this campaign is to spread the message of cleanliness to society.' },
      },
      {
        slug: 'beach-cleanliness',
        title: { mr: 'समुद्र किनारा स्वच्छता', en: 'Beach Cleanliness Drive' },
        desc: { mr: 'वसईच्या समुद्र किनाऱ्यांची नियमित स्वच्छता', en: 'Regular cleanliness of Vasai\'s sea shores' },
        body: { mr: 'वसई परिसरातील समुद्र किनाऱ्यांची नियमित स्वच्छता करणे हे या अभियानाचे उद्दिष्ट आहे. स्वयंसेवकांच्या मदतीने समुद्र किनारे प्लास्टिक आणि कचऱ्यापासून मुक्त ठेवण्याचे काम केले जाते.', en: 'The goal of this campaign is to regularly clean the beaches in the Vasai area. With the help of volunteers, beaches are kept free from plastic and garbage.' },
      },
      {
        slug: 'plastic-free',
        title: { mr: 'प्लास्टिकमुक्त उपक्रम', en: 'Plastic-Free Initiative' },
        desc: { mr: 'कापडी पिशव्यांचे वाटप आणि प्लास्टिकविरोधी जनजागृती', en: 'Cloth bag distribution and anti-plastic awareness' },
        body: { mr: 'प्लास्टिकमुक्त उपक्रमांतर्गत नागरिकांना कापडी पिशव्यांचे वाटप केले जाते आणि प्लास्टिकच्या दुष्परिणामांबद्दल जनजागृती केली जाते. एकल-वापर प्लास्टिक टाळण्यासाठी पर्यायी उपाय सुचवले जातात.', en: 'Under the Plastic-Free Initiative, cloth bags are distributed to citizens and awareness is created about the harmful effects of plastic. Alternative solutions to avoid single-use plastic are suggested.' },
      },
      {
        slug: 'nagrik-jagruti',
        title: { mr: 'नागरिक जागरूकता', en: 'Citizen Awareness' },
        desc: { mr: 'पर्यावरण रक्षणासाठी नागरिकांमध्ये जागृती निर्माण करणे', en: 'Creating awareness among citizens for environmental protection' },
        body: { mr: 'पर्यावरण संरक्षणासाठी नागरिकांमध्ये जागरूकता निर्माण करणे हे या उपक्रमाचे उद्दिष्ट आहे. विविध माध्यमांतून — नाटिका, प्रदर्शन, जनजागृती रॅली — पर्यावरणाच्या महत्त्वाचा संदेश समाजापर्यंत पोहोचवला जातो.', en: 'The goal of this initiative is to create awareness among citizens for environmental protection. Through various mediums — skits, exhibitions, awareness rallies — the message of the importance of the environment is conveyed to society.' },
      },
    ],
    stat: { value: '20+', label: { mr: 'वर्षे वृक्षवाढदिवस', en: 'Years of Tree Birthday' } },
    quote: {
      mr: '"पृथ्वी आपण वारशाने मिळवलेली नाही, ती आपण आपल्या मुलांकडून उधार घेतलेली आहे."',
      en: '"We do not inherit the earth from our ancestors, we borrow it from our children."',
    },
  },

  // ──────────────────────────────────────────────
  // 03  AAROGYA — Health
  // ──────────────────────────────────────────────
  {
    slug: 'aarogya',
    num: '03',
    color: 'var(--color-health)',
    colorTint: 'var(--color-health-tint)',
    colorClass: 'text-health',
    label: { mr: 'आरोग्य क्षेत्र', en: 'Health Kshetra' },
    tagline: { mr: 'स्वास्थ्य हेच संपदा', en: 'Health is True Wealth' },
    heading: { mr: 'निरोगी समाज, सुदृढ राष्ट्र', en: 'Healthy Society, Strong Nation' },
    body: {
      mr: 'समाजातील गरजू रुग्णासाठी आर्थिक सहकार्य करणारा मेडिकल फंड, आरोग्य विषयक वेगवेगळ्या शिबिराचे आयोजन.',
      en: 'A medical fund provides financial support for needy patients in the community, along with the organisation of various health awareness camps.',
    },
    overview_desc: {
      mr: 'गरजू रुग्णांसाठी आर्थिक सहकार्य करणारा मेडिकल फंड आणि आरोग्य विषयक वेगवेगळ्या शिबिरांचे आयोजन',
      en: 'Medical fund providing financial support for needy patients and various health awareness camps',
    },
    activities: [
      {
        slug: 'cancer-camp',
        title: { mr: 'कर्करोग निदान शिबीर', en: 'Cancer Detection Camp' },
        desc: { mr: 'Indian Cancer Society च्या सहकार्याने महिलांसाठी मोफत तपासणी', en: 'Free check-up for women in collaboration with Indian Cancer Society' },
        body: { mr: 'कर्करोग निदान शिबीर हे संजीवनी परिवाराच्या आरोग्य क्षेत्रातील सर्वात महत्त्वाचे उपक्रम आहे. Indian Cancer Society च्या सहकार्याने विशेषतः महिला वर्गासाठी हे शिबीर आयोजित केले जाते. लवकर निदान म्हणजे लवकर उपचार — हा संदेश देण्याचे काम या शिबिराद्वारे केले जाते.', en: 'The Cancer Detection Camp is one of the most important initiatives of Sanjeevani Parivar\'s Health Kshetra. This camp is organized especially for women in collaboration with the Indian Cancer Society. The message conveyed through this camp is — early detection means early treatment.' },
      },
      {
        slug: 'health-awareness',
        title: { mr: 'आरोग्य जागृती कार्यक्रम', en: 'Health Awareness Program' },
        desc: { mr: 'समाजात आरोग्यविषयक माहिती व जनजागृती पसरवणे', en: 'Spreading health information and awareness in the community' },
        body: { mr: 'आरोग्य जागृती कार्यक्रमांतर्गत विविध आजारांबद्दल जनजागृती, आरोग्यदायी जीवनशैलीचे महत्त्व आणि प्रतिबंधात्मक उपाययोजनांची माहिती दिली जाते. डॉक्टर आणि आरोग्य तज्ज्ञांच्या मार्गदर्शनाखाली हे कार्यक्रम आयोजित केले जातात.', en: 'Under Health Awareness Programs, information about various diseases, the importance of a healthy lifestyle and preventive measures is provided. These programs are organized under the guidance of doctors and health experts.' },
      },
      {
        slug: 'health-fund',
        title: { mr: 'आरोग्य निधी', en: 'Health Fund' },
        desc: { mr: 'गरजू रुग्णांना उपचारासाठी आर्थिक सहाय्य देणे', en: 'Financial assistance for treatment of needy patients' },
        body: { mr: 'आरोग्य निधी हा एक मानवतावादी उपक्रम आहे. आर्थिकदृष्ट्या दुर्बल रुग्णांना उपचारासाठी आर्थिक सहाय्य देण्यासाठी हा निधी उभारला जातो. समाजातील दानशूर व्यक्ती आणि संस्थांच्या सहकार्याने हे सहाय्य केले जाते.', en: 'The Health Fund is a humanitarian initiative. This fund is raised to provide financial assistance for treatment to economically weaker patients. This assistance is provided with the cooperation of generous individuals and organizations in society.' },
      },
    ],
    quote: {
      mr: '"आरोग्य म्हणजे फक्त आजार नसणे नव्हे, तर संपूर्ण शारीरिक, मानसिक आणि सामाजिक कल्याण होय."',
      en: '"Health is not merely the absence of disease, but a state of complete physical, mental and social well-being."',
    },
    heroImage: '',
  },

  // ──────────────────────────────────────────────
  // 04  PRABODHANA — Enlightenment
  // ──────────────────────────────────────────────
  {
    slug: 'prabodhana',
    num: '04',
    color: 'var(--color-enlightenment)',
    colorTint: 'var(--color-enlightenment-tint)',
    colorClass: 'text-enlightenment',
    label: { mr: 'प्रबोधन क्षेत्र', en: 'Enlightenment Kshetra' },
    tagline: { mr: 'विचारातून परिवर्तन', en: 'Change Through Thought' },
    heading: { mr: 'ज्ञानातून जागृती, जागृतीतून प्रगती', en: 'Awakening Through Knowledge' },
    body: {
      mr: 'सन २००३ पासून संजीवनी व्याख्यानमालेचा प्रारंभ. व्याख्यानमालेअंतर्गत आंतरराष्ट्रीय कीर्तीच्या तज्ज्ञाचे मार्गदर्शन. अर्थसाक्षरतेसाठी केंद्रीय अर्थसंकल्पावर विश्लेषणात्मक कार्यक्रमाचे आयोजन.',
      en: 'Sanjeevani Vyakhyanmala began in 2003, bringing guidance from internationally renowned experts. Analytical programmes on the Union Budget are also organised for financial literacy.',
    },
    overview_desc: {
      mr: 'सन २००३ पासून संजीवनी व्याख्यानमाला, आंतरराष्ट्रीय कीर्तीच्या तज्ज्ञांचे मार्गदर्शन, केंद्रीय अर्थसंकल्पावर विश्लेषणात्मक कार्यक्रम',
      en: 'Sanjeevani Vyakhyanmala since 2003, guidance by internationally renowned experts, Union Budget analysis programme',
    },
    activities: [
      {
        slug: 'vyakhyanmala',
        title: { mr: 'संजीवनी व्याख्यानमाला', en: 'Sanjeevani Vyakhyanmala' },
        desc: { mr: '२००३ पासून सुरू — आंतरराष्ट्रीय ख्यातीचे वक्ते, २३ व्या वर्षात', en: 'Since 2003 — internationally renowned speakers, in its 23rd year' },
        body: { mr: 'संजीवनी व्याख्यानमाला ही संजीवनी परिवाराची सर्वात प्रतिष्ठित आणि लोकप्रिय व्याख्यान श्रृंखला आहे. २००३ पासून सुरू असलेली ही व्याख्यानमाला आता २३ व्या वर्षात प्रवेश करत आहे. आंतरराष्ट्रीय ख्यातीचे वक्ते, शास्त्रज्ञ, साहित्यिक, समाजसेवक आणि विविध क्षेत्रातील तज्ज्ञ या व्याख्यानमालेत सहभागी होतात. कोरोना काळातही ऑनलाइन माध्यमातून ही व्याख्यानमाला सुरू राहिली.', en: 'Sanjeevani Vyakhyanmala is the most prestigious and popular lecture series of Sanjeevani Parivar. Started in 2003, this lecture series is now entering its 23rd year. Internationally renowned speakers, scientists, literary figures, social workers and experts from various fields participate in this series. Even during the COVID pandemic, the lecture series continued through online platforms.' },
      },
      {
        slug: 'budget-analysis',
        title: { mr: 'अर्थसंकल्प विश्लेषण', en: 'Budget Analysis' },
        desc: { mr: 'केंद्रीय अर्थसंकल्पावर तज्ज्ञांची चर्चा व विश्लेषण', en: 'Expert discussion and analysis of the Union Budget' },
        body: { mr: 'केंद्रीय अर्थसंकल्प सादर झाल्यानंतर लगेचच संजीवनी परिवार एका विशेष चर्चासत्राचे आयोजन करते. अर्थतज्ज्ञ, सनदी लेखापाल आणि व्यवसाय विशेषज्ञ अर्थसंकल्पाचे विश्लेषण करतात आणि सामान्य नागरिकांवर होणाऱ्या प्रभावाबद्दल माहिती देतात.', en: 'Immediately after the Union Budget is presented, Sanjeevani Parivar organizes a special discussion session. Economists, chartered accountants and business experts analyze the budget and provide information about its impact on ordinary citizens.' },
      },
      {
        slug: 'investment-workshop',
        title: { mr: 'गुंतवणूक कार्यशाळा', en: 'Investment Workshop' },
        desc: { mr: 'शेअर बाजार माहिती व गुंतवणूक नियोजन मार्गदर्शन', en: 'Stock market information and investment planning guidance' },
        body: { mr: 'गुंतवणूक कार्यशाळेत शेअर बाजार, म्युच्युअल फंड, सोने, स्थावर मालमत्ता आणि इतर गुंतवणूक पर्यायांबद्दल सखोल माहिती दिली जाते. आर्थिक नियोजन आणि बचतीचे महत्त्व समजावून सांगितले जाते.', en: 'The Investment Workshop provides in-depth information about stock market, mutual funds, gold, real estate and other investment options. The importance of financial planning and saving is explained.' },
      },
      {
        slug: 'online-lectures',
        title: { mr: 'ऑनलाइन व्याख्याने', en: 'Online Lectures' },
        desc: { mr: 'कोरोना काळातही व्याख्यानमालेचे सातत्य — डिजिटल माध्यमातून', en: 'Lecture series continued through COVID too — via digital platforms' },
        body: { mr: 'कोरोना महामारीच्या काळात प्रत्यक्ष कार्यक्रम आयोजित करणे शक्य नसताना संजीवनी परिवाराने ऑनलाइन व्याख्यानांच्या माध्यमातून ज्ञानप्रसाराचे काम अखंड सुरू ठेवले. YouTube आणि इतर डिजिटल प्लॅटफॉर्मवरून हजारो श्रोत्यांपर्यंत पोहोचणे शक्य झाले.', en: 'When it was not possible to organize in-person events during the COVID pandemic, Sanjeevani Parivar continued the work of knowledge dissemination uninterruptedly through online lectures. It became possible to reach thousands of listeners through YouTube and other digital platforms.' },
      },
    ],
    stat: { value: '23', label: { mr: 'व्याख्यानमालेचे वर्षे', en: 'Years of Vyakhyanmala' } },
    quote: {
      mr: '"विचाराने माणूस घडतो, विचाराने समाज घडतो."',
      en: '"Thought shapes the person, thought shapes the society."',
    },
  },
];

/** Color map derived from KSHETRAS — includes 'general' for non-kshetra events/gallery items */
export const KSHETRA_COLOR: Record<string, string> = {
  ...Object.fromEntries(KSHETRAS.map((k) => [k.slug, k.color])),
  general: 'var(--color-general)',
};

/** Label map derived from KSHETRAS — includes 'general' */
export const KSHETRA_LABEL: Record<string, Bilingual> = {
  ...Object.fromEntries(KSHETRAS.map((k) => [k.slug, k.label])),
  general: { mr: 'सामान्य', en: 'General' },
};

/** Quick lookup by slug */
export const getKshetra = (slug: string) =>
  KSHETRAS.find((k) => k.slug === slug);

/** Quick lookup of an activity within a kshetra */
export const getActivity = (kshetraSlug: string, activitySlug: string) => {
  const kshetra = getKshetra(kshetraSlug);
  if (!kshetra) return undefined;
  return { kshetra, activity: kshetra.activities.find((a) => a.slug === activitySlug) };
};
