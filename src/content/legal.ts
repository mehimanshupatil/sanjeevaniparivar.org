// Privacy Policy (/privacy) and Terms of Service (/terms). Also the URLs given to Meta for the
// trust's WhatsApp Business app. Update `LEGAL_UPDATED` and the text when a new use of personal
// data starts (e.g. registrations or donation receipts over WhatsApp).
import type { Bilingual } from '@/i18n/translations';
import { BRAND_EMAIL } from './brand';

/** YYYY-MM-DD; shown via src/lib/marathi.ts */
export const LEGAL_UPDATED = '2026-10-26';
export const LEGAL_EMAIL = BRAND_EMAIL;

export interface LegalSection {
  heading: Bilingual;
  /** Shown in this order: paragraphs, list, then note */
  paragraphs?: Bilingual[];
  list?: Bilingual[];
  note?: Bilingual;
}

export interface LegalDoc {
  title: Bilingual;
  intro: Bilingual;
  sections: LegalSection[];
}

const WHO: Bilingual = {
  mr: 'संजीवनी परिवार ही वसई येथील सार्वजनिक विश्वस्त संस्था आहे. संस्थेचे कायदेशीर नाव "संजिवनी परिवार संस्था, नालासोपारा (प)" असून ती मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम, १९५० अंतर्गत धर्मादाय आयुक्त, पालघर विभाग येथे नोंदणीकृत आहे.',
  en: 'Sanjeevani Parivar is a public trust in Vasai, Maharashtra, India. Its legal name is "संजिवनी परिवार संस्था, नालासोपारा (प)" (Sanjivani Parivar Sanstha, Nalasopara (W)), registered under the Bombay Public Trusts Act, 1950 with the Charity Commissioner, Palghar Division.',
};

const CONTACT: Bilingual = {
  mr: `या धोरणाबद्दल कोणताही प्रश्न, तक्रार किंवा विनंती असल्यास ${LEGAL_EMAIL} या ई-मेलवर संपर्क साधा.`,
  en: `For any question, complaint or request about this policy, email ${LEGAL_EMAIL}.`,
};

export const PRIVACY: LegalDoc = {
  title: { mr: 'गोपनीयता धोरण', en: 'Privacy Policy' },
  intro: {
    mr: 'संजीवनी परिवार ("आम्ही") आपल्या वैयक्तिक माहितीचा आदर करतो. आमचे संकेतस्थळ sanjeevaniparivar.org आणि आमचा WhatsApp क्रमांक वापरताना आम्ही कोणती माहिती घेतो, ती कशासाठी वापरतो आणि आपले अधिकार काय आहेत, हे या धोरणात सांगितले आहे.',
    en: 'Sanjeevani Parivar ("we", "us") respects your privacy. This policy explains what information we collect when you use our website sanjeevaniparivar.org or our WhatsApp number, why we use it, and the choices you have.',
  },
  sections: [
    { heading: { mr: 'आम्ही कोण', en: 'Who we are' }, paragraphs: [WHO] },
    {
      heading: { mr: 'संकेतस्थळावर आम्ही घेत असलेली माहिती', en: 'Information on our website' },
      list: [
        {
          mr: 'संकेतस्थळावर खाते, लॉगिन किंवा जाहिराती नाहीत. आम्ही ट्रॅकिंग कुकीज किंवा विश्लेषण (analytics) साधने वापरत नाही.',
          en: 'The website has no accounts, logins or advertising. We do not use tracking cookies or analytics tools.',
        },
        {
          mr: 'संपर्क अर्ज आपल्या ई-मेल ॲपमध्ये संदेश उघडतो. आपण पाठवलेला ई-मेल (नाव, ई-मेल पत्ता, संदेश) आम्हाला मिळतो आणि तो फक्त उत्तर देण्यासाठी वापरला जातो.',
          en: 'The contact form opens a message in your own email app. We receive the email you choose to send (your name, email address and message) and use it only to reply.',
        },
        {
          mr: 'वैयक्तिक निमंत्रण बनवताना लिहिलेले पाहुण्याचे नाव आपल्या ब्राउझरमध्येच राहते; ते आम्हाला पाठवले किंवा साठवले जात नाही.',
          en: 'When you make a personal invitation, the guest name you type stays in your browser. It is not sent to us or stored.',
        },
        {
          mr: 'संकेतस्थळ GitHub Pages वर चालते. पान दाखवण्यासाठी त्यांचे सर्व्हर आपला IP पत्ता व ब्राउझर तपशील तांत्रिक नोंदींमध्ये (logs) ठेवू शकतात.',
          en: 'The website is hosted on GitHub Pages. To serve pages, their servers may record your IP address and browser details in technical logs.',
        },
      ],
    },
    {
      heading: { mr: 'WhatsApp वर आम्ही घेत असलेली माहिती', en: 'Information on WhatsApp' },
      paragraphs: [{
        mr: 'आम्ही Meta च्या WhatsApp Business Platform द्वारे कार्यक्रमांची निमंत्रणे व माहिती पाठवतो. त्यासाठी पुढील माहिती आमच्याकडे येते:',
        en: 'We use Meta\'s WhatsApp Business Platform to send invitations and updates about our programmes. For this we hold:',
      }],
      list: [
        { mr: 'आपला WhatsApp फोन क्रमांक आणि WhatsApp वरील प्रोफाइल नाव', en: 'Your WhatsApp phone number and WhatsApp profile name' },
        { mr: 'आपण आम्हाला पाठवलेले संदेश', en: 'The messages you send us' },
        { mr: 'आपण संदेश घेण्यास दिलेली संमती किंवा ते थांबवण्याची विनंती', en: 'Your consent to receive messages, or your request to stop them' },
        { mr: 'आमचे संदेश पोहोचले / वाचले गेले की नाही याची WhatsApp कडून मिळणारी स्थिती', en: 'Delivery and read status of our messages, as reported by WhatsApp' },
      ],
    },
    {
      heading: { mr: 'माहितीचा वापर', en: 'How we use it' },
      list: [
        { mr: 'आमच्या कार्यक्रमांची (उदा. ग्राहक पेठ, व्याख्यानमाला, कार्यशाळा) निमंत्रणे, स्मरण व बदलांची माहिती पाठवणे', en: 'To send invitations, reminders and changes for our programmes (for example ग्राहक पेठ, the lecture series and workshops)' },
        { mr: 'आपल्या प्रश्नांना व संदेशांना उत्तर देणे', en: 'To reply to your questions and messages' },
        { mr: 'कोणाला संदेश पाठवायचे व कोणाला नाही, याची नोंद ठेवणे', en: 'To keep a record of who has agreed to receive messages and who has opted out' },
      ],
      note: {
        mr: 'आम्ही फक्त संमती दिलेल्या व्यक्तींनाच संदेश पाठवतो. आम्ही आपली माहिती विकत, भाड्याने देत किंवा इतरांच्या जाहिरातींसाठी वापरत नाही.',
        en: 'We message only people who have agreed to hear from us. We never sell or rent your information or use it for anyone else\'s marketing.',
      },
    },
    {
      heading: { mr: 'संदेश थांबवणे', en: 'Stopping messages' },
      paragraphs: [{
        mr: 'आमचे संदेश नको असल्यास WhatsApp वर "STOP" किंवा "थांबवा" असे उत्तर द्या, किंवा आम्हाला ई-मेल करा. त्यानंतर आम्ही आपल्याला कार्यक्रमांचे संदेश पाठवणार नाही.',
        en: 'To stop our messages, reply "STOP" (or "थांबवा") on WhatsApp, or email us. We will then stop sending you programme messages.',
      }],
    },
    {
      heading: { mr: 'माहिती कोणाला दिली जाते', en: 'Who we share it with' },
      list: [
        {
          mr: 'Meta Platforms (WhatsApp): संदेश WhatsApp Business Platform वरून जातात आणि Meta त्यांच्या अटी व गोपनीयता धोरणानुसार त्यावर प्रक्रिया करते.',
          en: 'Meta Platforms (WhatsApp): messages pass through the WhatsApp Business Platform, and Meta processes them under its own terms and privacy policy.',
        },
        {
          mr: 'संस्थेचे कार्यकर्ते: संदेश पाठवण्याचे व उत्तर देण्याचे काम करणाऱ्या स्वयंसेवकांनाच ही माहिती दिसते.',
          en: 'Our volunteers: only the trust members and volunteers who send and answer messages can see this information.',
        },
        {
          mr: 'कायद्याने बंधनकारक असेल तेव्हा शासकीय यंत्रणांना.',
          en: 'Authorities, where the law requires it.',
        },
      ],
    },
    {
      heading: { mr: 'माहिती किती काळ ठेवली जाते', en: 'How long we keep it' },
      paragraphs: [{
        mr: 'आपण संदेश घेत आहात तोपर्यंत आपला क्रमांक आमच्या यादीत राहतो. संदेश थांबवल्यावर किंवा माहिती काढून टाकण्याची विनंती केल्यावर आम्ही आपला क्रमांक यादीतून काढतो; फक्त पुन्हा संदेश न पाठवण्यासाठी आवश्यक नोंद ठेवली जाते. संदेशांचा इतिहास १२ महिन्यांनंतर काढून टाकला जातो.',
        en: 'Your number stays on our list while you receive our messages. When you opt out or ask us to delete your data, we remove it from the list, keeping only what we need to make sure we do not message you again. Message history is deleted after 12 months.',
      }],
    },
    {
      heading: { mr: 'सुरक्षा', en: 'Security' },
      paragraphs: [{
        mr: 'WhatsApp खाते व संबंधित साधने फक्त अधिकृत कार्यकर्त्यांनाच वापरता येतात. माहिती सुरक्षित ठेवण्यासाठी आम्ही वाजवी काळजी घेतो, तरीही इंटरनेटवरील कोणतीही प्रणाली पूर्णपणे सुरक्षित असल्याची हमी देता येत नाही.',
        en: 'Only authorised trust members can use our WhatsApp account and tools. We take reasonable care to protect your information, but no system on the internet can be guaranteed fully secure.',
      }],
    },
    {
      heading: { mr: 'आपले अधिकार', en: 'Your rights' },
      paragraphs: [{
        mr: 'डिजिटल वैयक्तिक माहिती संरक्षण अधिनियम, २०२३ नुसार आपण आमच्याकडील आपली माहिती पाहण्याची, ती दुरुस्त करण्याची किंवा काढून टाकण्याची आणि दिलेली संमती मागे घेण्याची विनंती करू शकता. ई-मेलवर विनंती पाठवा; आम्ही ३० दिवसांच्या आत उत्तर देऊ.',
        en: 'Under India\'s Digital Personal Data Protection Act, 2023, you can ask to see the information we hold about you, correct it, delete it, or withdraw your consent. Email us and we will respond within 30 days.',
      }],
    },
    {
      heading: { mr: 'मुले', en: 'Children' },
      paragraphs: [{
        mr: 'आम्ही १८ वर्षांखालील मुलांची माहिती पालकांच्या संमतीशिवाय जाणूनबुजून घेत नाही. अशी माहिती आमच्याकडे आल्याचे लक्षात आल्यास आम्ही ती काढून टाकू.',
        en: 'We do not knowingly collect information from children under 18 without a parent\'s consent. If we learn that we have, we will delete it.',
      }],
    },
    {
      heading: { mr: 'धोरणातील बदल', en: 'Changes to this policy' },
      paragraphs: [{
        mr: 'माहितीचा नवीन वापर सुरू करण्यापूर्वी (उदा. WhatsApp वरून नोंदणी किंवा देणगी पावती) आम्ही हे धोरण अद्ययावत करू. सर्वात वरील तारीख शेवटच्या बदलाची आहे.',
        en: 'We will update this policy before starting any new use of personal information (for example registrations or donation receipts over WhatsApp). The date at the top shows the last change.',
      }],
    },
    { heading: { mr: 'संपर्क', en: 'Contact' }, paragraphs: [CONTACT] },
  ],
};

export const TERMS: LegalDoc = {
  title: { mr: 'सेवा अटी', en: 'Terms of Service' },
  intro: {
    mr: 'संजीवनी परिवाराचे संकेतस्थळ sanjeevaniparivar.org आणि आमची WhatsApp सेवा वापरण्याच्या या अटी आहेत. संकेतस्थळ किंवा आमची WhatsApp सेवा वापरून आपण या अटी मान्य करता.',
    en: 'These terms govern your use of the Sanjeevani Parivar website sanjeevaniparivar.org and our WhatsApp service. By using either, you agree to them.',
  },
  sections: [
    { heading: { mr: 'आम्ही कोण', en: 'Who we are' }, paragraphs: [WHO] },
    {
      heading: { mr: 'संकेतस्थळ', en: 'The website' },
      paragraphs: [{
        mr: 'संकेतस्थळावरील माहिती संस्थेचे कार्य व कार्यक्रम यांच्या माहितीसाठी आहे. ती अचूक ठेवण्याचा आम्ही प्रयत्न करतो, परंतु कार्यक्रमांच्या तारखा, वेळा व स्थळे बदलू शकतात. अंतिम माहितीसाठी आमच्याशी संपर्क साधा.',
        en: 'The website tells you about the trust\'s work and programmes. We try to keep it accurate, but programme dates, times and venues can change. Contact us to confirm the details.',
      }],
    },
    {
      heading: { mr: 'WhatsApp सेवा', en: 'Our WhatsApp service' },
      list: [
        { mr: 'आपण संमती दिल्यावरच आम्ही आपल्याला कार्यक्रमांची निमंत्रणे व माहिती पाठवतो. "STOP" किंवा "थांबवा" असे उत्तर देऊन आपण ती कधीही थांबवू शकता.', en: 'We send programme invitations and updates only after you agree to receive them. You can stop them at any time by replying "STOP" (or "थांबवा").' },
        { mr: 'संदेश अधूनमधून, मुख्यतः कार्यक्रमांच्या आधी पाठवले जातात.', en: 'Messages are occasional, mostly before our programmes.' },
        { mr: 'स्वयंसेवक शक्य तितक्या लवकर उत्तर देतात; त्वरित उत्तराची हमी नाही. आपत्कालीन किंवा वैद्यकीय मदतीसाठी ही सेवा वापरू नका.', en: 'Volunteers reply as soon as they can; an immediate reply is not guaranteed. Do not use this service for emergencies or medical help.' },
        { mr: 'आपल्या मोबाइल सेवा पुरवठादाराचे डेटा शुल्क लागू होऊ शकते.', en: 'Your mobile operator\'s data charges may apply.' },
        { mr: 'आम्हाला बेकायदेशीर, अपमानास्पद, फसवा किंवा स्पॅम मजकूर पाठवू नका. असे संदेश पाठवणाऱ्या क्रमांकांना आम्ही ब्लॉक करू शकतो.', en: 'Do not send us unlawful, abusive, misleading or spam content. We may block numbers that do.' },
        { mr: 'WhatsApp चा वापर Meta च्या अटींनुसारही होतो.', en: 'Your use of WhatsApp is also subject to Meta\'s terms.' },
      ],
    },
    {
      heading: { mr: 'निमंत्रणे व साहित्य', en: 'Invitations and materials' },
      paragraphs: [{
        mr: 'संकेतस्थळावरील निमंत्रणे, वैयक्तिक निमंत्रणे, लोगो व इतर साहित्य संस्थेच्या कार्यक्रमांच्या प्रचारासाठी डाउनलोड करून शेअर करता येईल. त्यात दिशाभूल करणारे बदल करू नयेत किंवा ते इतर कारणांसाठी वापरू नयेत. लोगो वापराचे नियम /brand पानावर आहेत.',
        en: 'You may download and share the invitations, personal invitations, logos and other materials on the website to promote the trust\'s programmes. Do not alter them in misleading ways or use them for other purposes. Logo rules are on the /brand page.',
      }],
    },
    {
      heading: { mr: 'बौद्धिक संपदा', en: 'Intellectual property' },
      paragraphs: [{
        mr: 'संकेतस्थळावरील मजकूर, छायाचित्रे, लोगो व रचना संस्थेच्या किंवा संबंधित मालकांच्या आहेत. वरील परवानगीखेरीज लेखी परवानगीशिवाय त्यांचा व्यावसायिक वापर करू नये.',
        en: 'The text, photos, logos and designs on the website belong to the trust or their respective owners. Apart from the permission above, do not use them commercially without written permission.',
      }],
    },
    {
      heading: { mr: 'देणगी', en: 'Donations' },
      paragraphs: [{
        mr: 'देणगी पूर्णपणे ऐच्छिक आहे. देणगीचे तपशील व पावतीबाबत /donate पानावरील माहिती पहा किंवा आमच्याशी संपर्क साधा.',
        en: 'Donations are entirely voluntary. For donation details and receipts, see the /donate page or contact us.',
      }],
    },
    {
      heading: { mr: 'इतर संकेतस्थळांचे दुवे', en: 'Links to other sites' },
      paragraphs: [{
        mr: 'संकेतस्थळावर YouTube, Facebook, Instagram व WhatsApp यांसारख्या इतर सेवांचे दुवे आहेत. त्या सेवांवरील मजकूर व त्यांच्या धोरणांसाठी आम्ही जबाबदार नाही.',
        en: 'The website links to other services such as YouTube, Facebook, Instagram and WhatsApp. We are not responsible for their content or policies.',
      }],
    },
    {
      heading: { mr: 'जबाबदारीची मर्यादा', en: 'Limitation of liability' },
      paragraphs: [{
        mr: 'संकेतस्थळ व WhatsApp सेवा "जशी आहे तशी" विनामूल्य दिली जाते. कायद्याने परवानगी असलेल्या मर्यादेपर्यंत, त्यांच्या वापरामुळे होणाऱ्या कोणत्याही नुकसानीसाठी संस्था जबाबदार राहणार नाही.',
        en: 'The website and WhatsApp service are provided free of charge and "as is". To the extent the law allows, the trust is not liable for any loss arising from their use.',
      }],
    },
    {
      heading: { mr: 'लागू कायदा', en: 'Governing law' },
      paragraphs: [{
        mr: 'या अटींना भारतीय कायदे लागू होतात. कोणताही वाद पालघर जिल्हा, महाराष्ट्र येथील न्यायालयांच्या अधिकारक्षेत्रात येईल.',
        en: 'These terms are governed by the laws of India. Any dispute falls under the jurisdiction of the courts in Palghar district, Maharashtra.',
      }],
    },
    {
      heading: { mr: 'अटींमधील बदल', en: 'Changes to these terms' },
      paragraphs: [{
        mr: 'आम्ही या अटी वेळोवेळी बदलू शकतो. सर्वात वरील तारीख शेवटच्या बदलाची आहे. बदलानंतर सेवा वापरल्यास नवीन अटी मान्य आहेत असे मानले जाईल.',
        en: 'We may change these terms from time to time. The date at the top shows the last change. Using the website or service after a change means you accept the new terms.',
      }],
    },
    {
      heading: { mr: 'संपर्क', en: 'Contact' },
      paragraphs: [{
        mr: `या अटींबद्दल प्रश्न असल्यास ${LEGAL_EMAIL} या ई-मेलवर संपर्क साधा.`,
        en: `For questions about these terms, email ${LEGAL_EMAIL}.`,
      }],
    },
  ],
};
