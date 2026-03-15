/**
 * ============================================================
 *  KSHETRA CONTENT — single file to edit all four kshetras
 *  Edit text here; the pages and components update automatically.
 * ============================================================
 */

export type Bilingual = { mr: string; en: string };

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
  label:   Bilingual;
  tagline: Bilingual;   // short punchy subtitle under heading
  heading: Bilingual;
  body:    Bilingual;
  activities: { title: Bilingual; desc: Bilingual }[];
  stat?: { value: string; label: Bilingual };
  quote?: Bilingual;
  /** Path under /public/assets/ — leave empty until you have a photo */
  heroImage?: string;
}

export const KSHETRAS: KshetraData[] = [
  // ──────────────────────────────────────────────
  // 01  SHIKSHAN — Education
  // ──────────────────────────────────────────────
  {
    slug:       'shikshan',
    num:        '01',
    color:      '#1565C0',
    colorTint:  '#EFF6FF',
    colorClass: 'text-[#1565C0]',
    label:   { mr: 'शिक्षण क्षेत्र',         en: 'Education Kshetra'   },
    tagline: { mr: 'ज्ञान हेच सामर्थ्य',     en: 'Knowledge is Power'  },
    heading: { mr: 'शिक्षणातून समाजपरिवर्तन', en: 'Social Change Through Education' },
    body:    {
      mr: 'संजीवनी परिवार शिक्षण क्षेत्रात विद्यार्थ्यांसाठी अनेक उपक्रम राबवते. वाचन संस्कृतीची जोपासना, वक्तृत्व कला विकास आणि विविध सर्जनशील कार्यशाळांद्वारे विद्यार्थ्यांच्या सर्वांगीण विकासास चालना दिली जाते.',
      en: 'Sanjeevani Parivar runs many initiatives for students in the field of education. Reading culture, elocution skills and various creative workshops promote the overall development of students.',
    },
    activities: [
      { title: { mr: 'वक्तृत्व स्पर्धा',       en: 'Elocution Competition'   }, desc: { mr: 'विद्यार्थ्यांमध्ये आत्मविश्वास वाढवण्यासाठी वार्षिक स्पर्धा',  en: 'Annual competition to build confidence in students'       } },
      { title: { mr: 'वाचन प्रेरणा दिन',        en: 'Reading Inspiration Day'  }, desc: { mr: 'वाचनाची आवड जोपासण्यासाठी विशेष कार्यक्रम',                   en: 'Special programs to cultivate a love for reading'         } },
      { title: { mr: 'विद्यार्थी गौरव समारंभ',  en: 'Student Felicitation'     }, desc: { mr: 'गुणवंत विद्यार्थ्यांचा जाहीर सन्मान',                          en: 'Public recognition of meritorious students'               } },
      { title: { mr: 'जागतिक मराठी भाषादिन',   en: 'World Marathi Language Day'}, desc: { mr: 'मराठी भाषेचे जतन, संवर्धन आणि प्रसार',                        en: 'Preservation, promotion and spread of Marathi language'   } },
      { title: { mr: 'शाडूमाती गणेश कार्यशाळा', en: 'Clay Ganesh Workshop'      }, desc: { mr: 'पारंपरिक मूर्तिकलेचे शिक्षण देणारी कार्यशाळा',               en: 'Workshop teaching traditional idol-making art'            } },
      { title: { mr: 'पतंग महोत्सव',            en: 'Kite Festival'            }, desc: { mr: 'आकाश कंदील व पतंग उत्सव — सणाचा आनंद',                        en: 'Sky lantern and kite festival — celebration of joy'       } },
      { title: { mr: 'संस्कार भारती रांगोळी',   en: 'Sanskar Bharati Rangoli'  }, desc: { mr: 'भारतीय सांस्कृतिक वारसा जपण्यासाठी रांगोळी स्पर्धा',          en: 'Rangoli competition to preserve Indian cultural heritage' } },
      { title: { mr: 'एरो मॉडेलिंग शो',         en: 'Aero Modelling Show'      }, desc: { mr: 'विज्ञान व तंत्रज्ञानाची गोडी लावणारा विशेष कार्यक्रम',        en: 'Special event to spark interest in science and technology'} },
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
    slug:       'paryavaran',
    num:        '02',
    color:      '#1B7A1B',
    colorTint:  '#F0FDF4',
    colorClass: 'text-[#1B7A1B]',
    label:   { mr: 'पर्यावरण क्षेत्र',                   en: 'Environment Kshetra'              },
    tagline: { mr: 'निसर्ग वाचवा, भविष्य जगवा',           en: 'Save Nature, Sustain the Future'  },
    heading: { mr: 'निसर्गाचे रक्षण, भविष्याचे संरक्षण', en: 'Protecting Nature, Securing the Future' },
    body:    {
      mr: 'वृक्षारोपण आणि वृक्षसंवर्धनासोबतच वृक्षांचा वाढदिवस साजरा करणे हा एक अनोखा उपक्रम गेली २० वर्षे सातत्याने सुरू आहे. स्वच्छता अभियान, प्लास्टिकमुक्त उपक्रम आणि नागरिकांमध्ये जागरूकता निर्माण करणे हे परिवाराचे वर्षभर चालणारे काम आहे.',
      en: 'Celebrating tree birthdays alongside tree planting and conservation has been a unique initiative running continuously for 20 years. Cleanliness drives, plastic-free initiatives and creating awareness among citizens is the organization\'s year-round work.',
    },
    activities: [
      { title: { mr: 'वृक्षवाढदिवस उत्सव',     en: 'Tree Birthday Celebration'  }, desc: { mr: 'गेली २० वर्षे सातत्याने साजरा होणारा अनोखा उत्सव',             en: 'A unique celebration running continuously for 20 years'         } },
      { title: { mr: 'वृक्षारोपण अभियान',        en: 'Tree Plantation Drive'      }, desc: { mr: 'मोठ्या प्रमाणावर झाडे लावणे, जगवणे आणि संवर्धन करणे',         en: 'Large-scale planting, nurturing and conservation of trees'      } },
      { title: { mr: 'मंदिर परिसर स्वच्छता',     en: 'Temple Premises Cleanliness'}, desc: { mr: 'धार्मिक स्थळांचे परिसर स्वच्छ ठेवणे',                          en: 'Keeping the surroundings of religious places clean'             } },
      { title: { mr: 'समुद्र किनारा स्वच्छता',   en: 'Beach Cleanliness Drive'    }, desc: { mr: 'वसईच्या समुद्र किनाऱ्यांची नियमित स्वच्छता',                  en: 'Regular cleanliness of Vasai\'s sea shores'                    } },
      { title: { mr: 'प्लास्टिकमुक्त उपक्रम',    en: 'Plastic-Free Initiative'    }, desc: { mr: 'कापडी पिशव्यांचे वाटप आणि प्लास्टिकविरोधी जनजागृती',           en: 'Cloth bag distribution and anti-plastic awareness'             } },
      { title: { mr: 'नागरिक जागरूकता',           en: 'Citizen Awareness'         }, desc: { mr: 'पर्यावरण रक्षणासाठी नागरिकांमध्ये जागृती निर्माण करणे',        en: 'Creating awareness among citizens for environmental protection' } },
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
    slug:       'aarogya',
    num:        '03',
    color:      '#C41E3A',
    colorTint:  '#FFF1F2',
    colorClass: 'text-[#C41E3A]',
    label:   { mr: 'आरोग्य क्षेत्र',          en: 'Health Kshetra'          },
    tagline: { mr: 'स्वास्थ्य हेच संपदा',     en: 'Health is True Wealth'   },
    heading: { mr: 'निरोगी समाज, सुदृढ राष्ट्र', en: 'Healthy Society, Strong Nation' },
    body:    {
      mr: 'विशेषतः महिला वर्गासाठी Indian Cancer Society च्या सहकार्याने कर्करोग निदान शिबिराचे आयोजन करण्यात येते. आरोग्यविषयी जागरूकता निर्माण करणे तसेच गरजू रुग्णांसाठी आरोग्य निधी उभारून त्यांना आर्थिक सहाय्य केले जाते.',
      en: 'Cancer screening camps are organized especially for women in collaboration with the Indian Cancer Society. Health awareness is created and financial aid is provided to needy patients through a dedicated health fund.',
    },
    activities: [
      { title: { mr: 'कर्करोग निदान शिबीर',   en: 'Cancer Detection Camp'      }, desc: { mr: 'Indian Cancer Society च्या सहकार्याने महिलांसाठी मोफत तपासणी', en: 'Free check-up for women in collaboration with Indian Cancer Society' } },
      { title: { mr: 'आरोग्य जागृती कार्यक्रम', en: 'Health Awareness Program'    }, desc: { mr: 'समाजात आरोग्यविषयक माहिती व जनजागृती पसरवणे',                 en: 'Spreading health information and awareness in the community'          } },
      { title: { mr: 'आरोग्य निधी',            en: 'Health Fund'                }, desc: { mr: 'गरजू रुग्णांना उपचारासाठी आर्थिक सहाय्य देणे',               en: 'Financial assistance for treatment of needy patients'                } },
    ],
    quote: {
      mr: '"आरोग्य म्हणजे फक्त आजार नसणे नव्हे, तर संपूर्ण शारीरिक, मानसिक आणि सामाजिक कल्याण होय."',
      en: '"Health is not merely the absence of disease, but a state of complete physical, mental and social well-being."',
    },
    heroImage: '', // add e.g. '/assets/aarogya-hero.jpg' when available
  },

  // ──────────────────────────────────────────────
  // 04  PRABODHANA — Enlightenment
  // ──────────────────────────────────────────────
  {
    slug:       'prabodhana',
    num:        '04',
    color:      '#6A1B9A',
    colorTint:  '#F5F3FF',
    colorClass: 'text-[#6A1B9A]',
    label:   { mr: 'प्रबोधन क्षेत्र',                   en: 'Enlightenment Kshetra'           },
    tagline: { mr: 'विचारातून परिवर्तन',                 en: 'Change Through Thought'          },
    heading: { mr: 'ज्ञानातून जागृती, जागृतीतून प्रगती', en: 'Awakening Through Knowledge'     },
    body:    {
      mr: 'अर्थसाक्षरतेअंतर्गत केंद्रीय अर्थसंकल्प विश्लेषण, शेअर बाजाराविषयी माहिती, गुंतवणूक कार्यशाळा असे वेगवेगळे उपक्रम आयोजित करण्यात येतात. संजीवनी व्याख्यानमाला आता २३ व्या वर्षात पदार्पण करत आहे.',
      en: 'Under financial literacy, programs like Union Budget analysis, stock market information, and investment workshops are organized. The Sanjeevani Vyakhyanmala is now entering its 23rd year.',
    },
    activities: [
      { title: { mr: 'संजीवनी व्याख्यानमाला',   en: 'Sanjeevani Vyakhyanmala'    }, desc: { mr: '२००३ पासून सुरू — आंतरराष्ट्रीय ख्यातीचे वक्ते, २३ व्या वर्षात', en: 'Since 2003 — internationally renowned speakers, in its 23rd year'   } },
      { title: { mr: 'अर्थसंकल्प विश्लेषण',     en: 'Budget Analysis'            }, desc: { mr: 'केंद्रीय अर्थसंकल्पावर तज्ज्ञांची चर्चा व विश्लेषण',            en: 'Expert discussion and analysis of the Union Budget'                  } },
      { title: { mr: 'गुंतवणूक कार्यशाळा',       en: 'Investment Workshop'         }, desc: { mr: 'शेअर बाजार माहिती व गुंतवणूक नियोजन मार्गदर्शन',               en: 'Stock market information and investment planning guidance'            } },
      { title: { mr: 'ऑनलाइन व्याख्याने',        en: 'Online Lectures'            }, desc: { mr: 'कोरोना काळातही व्याख्यानमालेचे सातत्य — डिजिटल माध्यमातून',     en: 'Lecture series continued through COVID too — via digital platforms'  } },
    ],
    stat: { value: '23', label: { mr: 'व्याख्यानमालेचे वर्षे', en: 'Years of Vyakhyanmala' } },
    quote: {
      mr: '"विचाराने माणूस घडतो, विचाराने समाज घडतो."',
      en: '"Thought shapes the person, thought shapes the society."',
    },
  },
];

/** Quick lookup by slug */
export const getKshetra = (slug: string) =>
  KSHETRAS.find((k) => k.slug === slug);
