import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiFields, editionTexts } from './message.ts';
import type { ResolvedEdition, ResolvedSession } from './edition';

const day = (date: string, time: string) => ({ date, time, parts: { day: '', month: '', year: '', weekday: '' } });

/** The fields the message reads; everything else empty */
function edition(over: Partial<ResolvedEdition> = {}): ResolvedEdition {
  return {
    invite: '॥ सस्नेह निमंत्रण ॥',
    fullTitle: 'सामवेदी ब्राह्मण ग्राहक पेठ २०२६',
    title: { top: 'सामवेदी ब्राह्मण', main: 'ग्राहक पेठ' },
    organisers: [], organisersSuffix: 'यांच्या संयुक्त विद्यमाने आयोजित',
    days: [day('शनिवार, ३१ ऑक्टोबर २०२६', 'सायंकाळी ४.०० ते रात्री १०.०० वाजेपर्यंत'), day('रविवार, १ नोव्हेंबर २०२६', 'सकाळी ९.०० ते रात्री १०.०० वाजेपर्यंत')],
    venue: ['श्री उमादेवी मंदिर,', 'उमराळे'],
    sessions: [], items: [], groups: [], rules: [], closing: [], contacts: [],
    ...over,
  } as unknown as ResolvedEdition;
}

const session = (n: number, date: string, time: string): ResolvedSession => ({
  n, label: `पुष्प ${['', 'पहिले', 'दुसरे'][n]}`, ...day(date, time), speaker: { name: `वक्ता ${['', 'एक', 'दोन'][n]}`, role: 'लेखक' }, topic: 'माझा\nविषय',
});

test('WhatsApp message: title in bold, every day with its time, venue on one line', () => {
  const { whatsapp } = editionTexts(edition());
  assert.match(whatsapp, /^॥ सस्नेह निमंत्रण ॥\n\*सामवेदी ब्राह्मण ग्राहक पेठ २०२६\*/);
  assert.match(whatsapp, /\*दिनांक :\* शनिवार, ३१ ऑक्टोबर २०२६, सायंकाळी ४\.०० ते रात्री १०\.०० वाजेपर्यंत/);
  assert.match(whatsapp, /\*दिनांक :\* रविवार, १ नोव्हेंबर २०२६, सकाळी/);
  assert.match(whatsapp, /\*स्थळ :\* श्री उमादेवी मंदिर, उमराळे/);
});

test('details the cards leave out are in the message: items, rules, groups, note, contacts', () => {
  const { whatsapp } = editionTexts(edition({
    itemsHeading: 'बाजारातील आकर्षणे', items: ['आकाशकंदील', 'फराळ'], itemsMore: 'आणि बरेच काही…',
    rulesHeading: 'महत्त्वाची माहिती', rules: ['शुल्क ₹१००', 'साहित्य दिले जाईल'],
    groups: [{ name: 'गट १', who: 'इयत्ता ५ वी ते ७ वी', topics: ['माझी शाळा', 'माझा आवडता सण'] }],
    note: { label: 'वि. सू.', text: 'आसन मर्यादित' },
    closing: [{ text: 'नक्की या!', emphasis: true }],
    contacts: [{ name: 'प्रतिनिधी एक', phone: '9000000001', phoneMr: '९०००००००१' }],
  }));
  for (const s of ['*बाजारातील आकर्षणे*\n• आकाशकंदील\n• फराळ\nआणि बरेच काही…', '१. शुल्क ₹१००', '*गट १* (इयत्ता ५ वी ते ७ वी)\n१) माझी शाळा',
    '*वि. सू. :* आसन मर्यादित', '*नक्की या!*', '*संपर्क*\nप्रतिनिधी एक : ९०००००००१']) {
    assert.ok(whatsapp.includes(s), s);
  }
});

test('lectures: the time once when every day shares it, then one block per session', () => {
  const b = edition({ sessions: [session(1, 'रविवार, २६ एप्रिल २०२६', 'सायंकाळी ६.०० वाजता'), session(2, 'शुक्रवार, १ मे २०२६', 'सायंकाळी ६.०० वाजता')] });
  b.days = b.sessions;
  const { whatsapp } = editionTexts(b);
  assert.match(whatsapp, /\*वेळ :\* सायंकाळी ६\.०० वाजता/);
  assert.ok(!whatsapp.includes('*दिनांक :*'));
  assert.ok(whatsapp.includes('*पुष्प पहिले* — रविवार, २६ एप्रिल २०२६\nवक्ता एक (लेखक)\nविषय : “माझा\nविषय”'));
});

test('caption: no WhatsApp asterisks, hashtags at the end', () => {
  const { caption } = editionTexts(edition());
  assert.ok(!caption.includes('*'));
  assert.match(caption, /\n\n#संजीवनीपरिवार #ग्राहकपेठ #वसई$/);
});

test('API values are one line each (the API refuses new lines)', () => {
  const b = edition({ footer: 'एक\nदोन' });
  const all = apiFields(b);
  assert.deepEqual(all, {
    title: 'सामवेदी ब्राह्मण ग्राहक पेठ २०२६',
    date: 'शनिवार, ३१ ऑक्टोबर २०२६ आणि रविवार, १ नोव्हेंबर २०२६',
    time: 'सायंकाळी ४.०० ते रात्री १०.०० वाजेपर्यंत / सकाळी ९.०० ते रात्री १०.०० वाजेपर्यंत',
    venue: 'श्री उमादेवी मंदिर, उमराळे',
  });
  const one = apiFields(b, session(2, 'शुक्रवार, १ मे २०२६', 'सायंकाळी ६.०० वाजता'));
  assert.equal(one.date, 'शुक्रवार, १ मे २०२६');
  assert.equal(one.topic, 'माझा विषय');
  for (const v of Object.values(one)) assert.doesNotMatch(v!, /[\n\t]/);
});
