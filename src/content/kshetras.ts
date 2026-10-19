/**
 * ============================================================
 *  KSHETRA CONTENT — single file to edit all four kshetras
 *  Edit text here; the pages and components update automatically.
 * ============================================================
 */

import type { Bilingual } from '@/i18n/translations';
import { vyakhyanmalaEdition, vrikshaYears, mr } from '@/lib/org';

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
        title: { mr: `वक्तृत्व स्पर्धा`, en: `Elocution Competition` },
        desc: { mr: `२०१२ पासून दरवर्षी — शाळकरी विद्यार्थ्यांसाठी गटनिहाय स्पर्धा`, en: `Every year since 2012 — a competition for school students, in age groups` },
        body: { mr: `विद्यार्थ्यांच्या व्यक्तिमत्त्व विकासासाठी संजीवनी परिवार २०१२ पासून दरवर्षी वक्तृत्व स्पर्धा आयोजित करतो. ही स्पर्धा केवळ वक्तृत्वकौशल्यापुरती मर्यादित नसून विद्यार्थ्यांमध्ये आत्मविश्वास, भाषेवर प्रभुत्व, विचारांची मांडणी आणि सार्वजनिक बोलण्याचे नैपुण्य विकसित करते. विद्यार्थी आपल्या गटासाठी दिलेल्या कोणत्याही एका विषयावर पाच मिनिटे विचार मांडतात. २०२५-२६ मध्ये भाऊसाहेब वर्तक विद्यामंदिर, नाळे येथे चार गटांत झालेल्या स्पर्धेत १११ विद्यार्थ्यांनी सहभाग घेतला. याच वर्षी स्पर्धेची पुढील पायरी म्हणून वादविवाद स्पर्धेचा प्रयोगही करण्यात आला.`, en: `Since 2012 Sanjeevani Parivar has held an elocution competition every year for its students. It goes beyond public speaking: it builds confidence, command of the language, clear thinking and the skill of speaking in public. Each student speaks for five minutes on one of the topics set for their group. In 2025–26, 111 students took part in four groups at Bhausaheb Vartak Vidyamandir, Nale. The same year a debate was tried for the first time, as the next step after elocution.` },
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
        title: { mr: `मराठी भाषा गौरव दिन`, en: `Marathi Language Day` },
        desc: { mr: `कुसुमाग्रज जयंतीनिमित्त २७ फेब्रुवारीला — वाचन अभियानातील विद्यार्थ्यांचे सादरीकरण`, en: `On 27 February, Kusumagraj's birth anniversary — performed by the reading-centre students` },
        body: { mr: `ज्ञानपीठ पुरस्कार विजेते कवी कुसुमाग्रज (वि. वा. शिरवाडकर) यांचा जन्मदिवस २७ फेब्रुवारी हा "मराठी भाषा गौरव दिन" म्हणून साजरा केला जातो. संजीवनी परिवार हा दिवस वाचन अभियान केंद्रांच्या सहकार्याने साजरा करतो. उमराळे, सोमाडी, वटार, भुईगाव आदी गावांतील विद्यार्थी कुसुमाग्रजांच्या साहित्यातील उतारे, कविता वाचन आणि नाट्यप्रवेश सादर करतात.`, en: `Kusumagraj (V. V. Shirwadkar), the Jnanpith-winning poet, was born on 27 February, which is celebrated as Marathi Language Day. Sanjeevani Parivar marks it with its reading centres: students from Umrale, Somadi, Vatar, Bhuigaon and other villages read his poems and prose and perform scenes from his plays.` },
      },
      {
        slug: 'vachan-abhiyan',
        title: { mr: `वाचन अभियान`, en: `Reading Campaign` },
        desc: { mr: `२०१६ पासून — सहा गावांत मुलांसाठी मराठी वाचन केंद्रे`, en: `Since 2016 — Marathi reading centres for children in six villages` },
        body: { mr: `इंग्रजीच्या प्रभावामुळे मुले मातृभाषेपासून दुरावत असताना त्यांच्यामध्ये मराठी वाचनाची गोडी निर्माण व्हावी आणि मातृभाषेचे संवर्धन व्हावे या उद्देशाने संजीवनी परिवाराने २०१६ पासून वाचन अभियान सुरू केले आहे. अभियानातील नोंदणी झालेली ४२६ पुस्तके १० पेट्यांमधून विविध केंद्रांत फिरवली जातात. आजमितीस भुईगाव, गास, उमराळे, वाघोली, वटार आणि सोमाडी या सहा गावांमध्ये वाचन केंद्रे सुरू असून गावातील स्वयंसेविका ती चालवतात. आपल्या गावात केंद्र सुरू करायचे असल्यास परिवाराशी संपर्क साधावा.`, en: `As English draws children away from their mother tongue, Sanjeevani Parivar started a reading campaign in 2016 to give them a taste for Marathi reading. 426 catalogued books travel between centres in 10 boxes. Reading centres now run in six villages — Bhuigaon, Gas, Umrale, Wagholi, Vatar and Somadi — each looked after by volunteers from the village. To start a centre in your village, get in touch.` },
      },
      {
        slug: 'study-center',
        title: { mr: `संजीवनी स्टडी सेंटर`, en: `Sanjeevani Study Centre` },
        desc: { mr: `भाऊसाहेब वर्तक विद्यामंदिर, नाळे — अभ्यासिका, कल चाचणी व मार्गदर्शन शिबिरे`, en: `At Bhausaheb Vartak Vidyamandir, Nale — a study room, aptitude tests and guidance sessions` },
        body: { mr: `भाऊसाहेब वर्तक विद्यामंदिर, नाळे येथे सुरू केलेल्या संजीवनी स्टडी सेंटरमध्ये विद्यार्थ्यांना अभ्यासासाठी जागा आणि विविध कोर्स व मार्गदर्शन शिबिरे उपलब्ध करून दिली जातात. जैमुनी सहकारी पतपेढीच्या सहकार्याने इयत्ता ९ वी ते १२ वीच्या ७८ विद्यार्थ्यांची कल चाचणी (ॲप्टिट्यूड टेस्ट) घेऊन पालकांसह समुपदेशन करण्यात आले. "कृत्रिम बुद्धिमत्ता (AI) — बदलत्या जगाची नवी दिशा" या मार्गदर्शन कार्यशाळेला १०० हून अधिक विद्यार्थी व पालक उपस्थित होते. वरिष्ठ महाविद्यालयीन विद्यार्थ्यांसाठी संगणक प्रशिक्षण शिबिराचेही नियोजन आहे.`, en: `The Sanjeevani Study Centre at Bhausaheb Vartak Vidyamandir, Nale gives students a place to study, along with courses and guidance sessions. With Jaimuni Sahakari Patpedhi, 78 students of classes 9–12 took an aptitude test and were counselled with their parents. Over 100 students and parents attended a session on "Artificial Intelligence — the new direction of a changing world". A computer training camp for senior college students is planned.` },
      },
      {
        slug: 'shaikshanik-madat',
        title: { mr: `शैक्षणिक मदत`, en: `Education Aid` },
        desc: { mr: `गरजू विद्यार्थ्यांना शिक्षणासाठी आर्थिक मदत`, en: `Financial help for students in need` },
        body: { mr: `वैद्यकीय मदतीबरोबरच संजीवनी परिवाराने गरजू विद्यार्थ्यांना शिक्षणासाठी आर्थिक मदत करण्यास सुरुवात केली आहे. २०२५-२६ मध्ये तीन विद्यार्थ्यांना एकूण ₹५३,९५०/- ची मदत करण्यात आली.`, en: `Alongside medical aid, Sanjeevani Parivar now helps students in need with their education. In 2025–26, three students received ₹53,950 in all.` },
      },
      {
        slug: 'clay-ganesh',
        title: { mr: `शाडूमाती गणेशमूर्ती कार्यशाळा`, en: `Clay Ganesh Idol Workshop` },
        desc: { mr: `संजीवनी कलादालन — विद्यार्थ्यांसाठी शाडूमातीच्या गणेशमूर्ती बनवण्याची कार्यशाळा`, en: `Sanjeevani Kaladalan — students make eco-friendly clay Ganesh idols` },
        body: { mr: `गणेशोत्सवाच्या पार्श्वभूमीवर संजीवनी कलादालन अंतर्गत विद्यार्थ्यांसाठी शाडूमातीपासून श्रीगणेशमूर्ती बनवण्याची कार्यशाळा आयोजित केली जाते. तज्ज्ञ चित्रकार व शिल्पकार विद्यार्थ्यांना मार्गदर्शन करतात आणि मूर्तीसाठी लागणारे साहित्य परिवाराकडून पुरवले जाते. २०२५ मध्ये श्रीवाघेश्वरी मंदिर, वाघोली येथे झालेल्या सातव्या कार्यशाळेत १३० विद्यार्थ्यांनी भाग घेतला.`, en: `Before Ganeshotsav, Sanjeevani Kaladalan holds a workshop where students make Ganesh idols from shadu clay. Artists and sculptors guide them and the trust provides the materials. The seventh workshop, in 2025 at Shri Wagheshwari Temple, Wagholi, had 130 students.` },
      },
      {
        slug: 'akashkandil-karyashala',
        title: { mr: `आकाशकंदील कार्यशाळा`, en: `Akashkandil (Diwali Lantern) Workshop` },
        desc: { mr: `संजीवनी कलादालन — दिवाळीसाठी आकाशकंदील बनवण्याची कार्यशाळा`, en: `Sanjeevani Kaladalan — students make Diwali lanterns` },
        body: { mr: `बालविद्यार्थ्यांच्या दिवाळसणाच्या उत्साहात भर टाकणारी आकाशकंदील कार्यशाळा संजीवनी कलादालन अंतर्गत श्रीवाघेश्वरी मंदिर, वाघोली येथे आयोजित केली जाते. आकाशकंदील बनवण्यासाठीचे सर्व साहित्य परिवाराकडून पुरवले जाते. २०२५ मध्ये या कार्यशाळेचे आठवे वर्ष होते आणि ८५ विद्यार्थ्यांनी सहभाग नोंदवला.`, en: `To add to the children's Diwali, Sanjeevani Kaladalan holds a lantern-making workshop at Shri Wagheshwari Temple, Wagholi, with all materials provided. 2025 was its eighth year, with 85 students.` },
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
        title: { mr: `वृक्षवाढदिवस उत्सव`, en: `Tree Birthday Celebration` },
        desc: { mr: `गेली ${mr(vrikshaYears)} वर्षे — जुलैच्या पहिल्या रविवारी लावलेल्या झाडांचा वाढदिवस`, en: `For ${vrikshaYears} years — the birthday of the trees we planted, on the first Sunday of July` },
        body: { mr: `संजीवनी परिवाराने २००५ साली वृक्षारोपण प्रकल्प हाती घेतला. परिवाराचे स्फूर्तिस्थान प्राध्यापक मुरलीधर सायनेकर यांच्या प्रेरणेतून लावलेल्या झाडांची मशागत करून २००६ पासून दरवर्षी जुलैच्या पहिल्या रविवारी त्यांचा वाढदिवस साजरा केला जातो आणि नवीन झाडांची लागवडही केली जाते. झाडांशी भावनिक नाते जोडणे आणि त्यांच्या संगोपनाची जबाबदारी घेणे हे या उत्सवाचे उद्दिष्ट आहे. "वृक्ष आपले मित्र, मार्गदर्शक आणि तत्त्वज्ञ आहेत," असे सायनेकर सर सांगत.`, en: `Sanjeevani Parivar began planting trees in 2005. Inspired by Prof. Muralidhar Saynekar, the trees are cared for and, since 2006, their birthday is celebrated every year on the first Sunday of July, along with new planting. The idea is to form a bond with trees and take responsibility for raising them. "Trees are our friends, guides and philosophers," Saynekar Sir would say.` },
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
        title: { mr: `प्लास्टिकमुक्त उपक्रम`, en: `Plastic-Free Initiative` },
        desc: { mr: `कापडी पिशव्यांचे वाटप आणि गावोगावी प्लास्टिक संकलन`, en: `Cloth bags for every home, and plastic collection in the villages` },
        body: { mr: `प्लास्टिक पिशव्यांचा वापर कमी व्हावा यासाठी संजीवनी परिवार सतत आग्रही आहे. केवळ आग्रह न करता प्लास्टिक पिशवीला पर्याय म्हणून कापडी पिशव्यांच्या २,४२८ संचांचे वाटप समाजात करण्यात आले आहे. ध्यास फाउंडेशनच्या सहकार्याने गास, बोळींज, भावडी, वटार, उमराळे आदी गावांत प्लास्टिक संकलन केले जाते आणि ते योग्य विल्हेवाटीसाठी पाठवले जाते.`, en: `Sanjeevani Parivar keeps urging people to use fewer plastic bags, and offers an alternative: 2,428 sets of cloth bags have been given out. With Dhyas Foundation, plastic is collected in Gas, Bolinj, Bhavdi, Vatar, Umrale and other villages and sent for proper disposal.` },
      },
      {
        slug: 'nagrik-jagruti',
        title: { mr: 'नागरिक जागरूकता', en: 'Citizen Awareness' },
        desc: { mr: 'पर्यावरण रक्षणासाठी नागरिकांमध्ये जागृती निर्माण करणे', en: 'Creating awareness among citizens for environmental protection' },
        body: { mr: 'पर्यावरण संरक्षणासाठी नागरिकांमध्ये जागरूकता निर्माण करणे हे या उपक्रमाचे उद्दिष्ट आहे. विविध माध्यमांतून — नाटिका, प्रदर्शन, जनजागृती रॅली — पर्यावरणाच्या महत्त्वाचा संदेश समाजापर्यंत पोहोचवला जातो.', en: 'The goal of this initiative is to create awareness among citizens for environmental protection. Through various mediums — skits, exhibitions, awareness rallies — the message of the importance of the environment is conveyed to society.' },
      },
    ],
    stat: { value: `${vrikshaYears}+`, label: { mr: 'वर्षे वृक्षवाढदिवस', en: 'Years of Tree Birthday' } },
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
        title: { mr: `वैद्यकीय मदत (आरोग्य निधी)`, en: `Medical Aid (Health Fund)` },
        desc: { mr: `गरजू रुग्णांना उपचारासाठी तातडीची आर्थिक मदत — कमाल ₹१ लाख`, en: `Urgent help for patients in need — up to ₹1 lakh` },
        body: { mr: `आणीबाणीच्या परिस्थितीत गरजू समाजबांधवांना तातडीची आर्थिक मदत करणे हा या उपक्रमाचा उद्देश आहे. आजाराचे स्वरूप, रुग्णाची परिस्थिती आणि एकूण खर्च लक्षात घेऊन कमाल ₹१ लाखापर्यंत मदत केली जाते आणि ती लवकरात लवकर पोहोचवण्यावर परिवाराचा भर असतो. २०२५-२६ मध्ये ८ रुग्णांना ₹३.५० लाखांची मदत करण्यात आली. आजवर १० रुग्णांच्या कुटुंबीयांनी ₹३.७३ लाख परतफेडीच्या स्वरूपात परिवारास परत दिले आहेत. शुभकार्य किंवा आप्तेष्टांच्या स्मृतीनिमित्त या निधीस देणगी देता येते.`, en: `This fund gives urgent financial help to members of the community in a medical emergency. Up to ₹1 lakh is given, depending on the illness, the patient's situation and the total cost, and the trust tries to send it as fast as possible. In 2025–26, 8 patients received ₹3.5 lakh. So far the families of 10 patients have given back ₹3.73 lakh to the fund. Donations can be made on a family occasion or in memory of a loved one.` },
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
        title: { mr: `संजीवनी व्याख्यानमाला`, en: `Sanjeevani Vyakhyanmala` },
        desc: { mr: `२००३ पासून सुरू — नामवंत वक्ते, ${mr(vyakhyanmalaEdition)} व्या वर्षात`, en: `Since 2003 — eminent speakers, in its ${vyakhyanmalaEdition}th year` },
        body: { mr: `महाराष्ट्रातील नामवंत वक्ते, विषयांतील विविधता आणि नेटके नियोजन यांमुळे २००३ पासून सातत्य राखलेली संजीवनी व्याख्यानमाला वसई तालुक्यातील दर्जेदार व्याख्यानमाला म्हणून ओळखली जाते. यंदा ती ${mr(vyakhyanmalaEdition)} व्या वर्षात आहे. समाजात देण्याची मानसिकता वाढावी यासाठी प्रत्येक व्याख्यानमालेत सामाजिक कार्य करणाऱ्या व्यक्तीच्या कार्याबद्दल कृतज्ञता व्यक्त करून परिवाराच्या माध्यमातून देणगी दिली जाते; २०२५ मध्ये सैनिकांसाठी ऑक्सिजन प्लांट उभारण्याच्या कार्यास ₹६१,०००/- ची देणगी देण्यात आली. कोरोना काळातही ही व्याख्यानमाला ऑनलाइन माध्यमातून सुरू राहिली.`, en: `With eminent speakers from across Maharashtra, a wide range of subjects and careful organisation, the Sanjeevani Vyakhyanmala has run without a break since 2003 and is known as one of the finest lecture series in Vasai taluka. This year is its ${vyakhyanmalaEdition}th. To encourage giving, each series thanks a person doing social work and passes on a donation through the trust; in 2025, ₹61,000 went to setting up oxygen plants for soldiers. During COVID the series continued online.` },
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
    stat: { value: `${vyakhyanmalaEdition}`, label: { mr: 'व्याख्यानमालेचे वर्षे', en: 'Years of Vyakhyanmala' } },
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
