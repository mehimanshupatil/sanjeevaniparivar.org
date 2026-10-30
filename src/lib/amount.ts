// Rupee amounts in words, Indian grouping (हजार/thousand, लाख/lakh, कोटी/crore), for receipts.
// Whole rupees only: donations are recorded without paise.

// Marathi numbers below 100 don't follow a pattern, so each one is listed.
const MR_0_99 = [
  'शून्य', 'एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ',
  'दहा', 'अकरा', 'बारा', 'तेरा', 'चौदा', 'पंधरा', 'सोळा', 'सतरा', 'अठरा', 'एकोणीस',
  'वीस', 'एकवीस', 'बावीस', 'तेवीस', 'चोवीस', 'पंचवीस', 'सव्वीस', 'सत्तावीस', 'अठ्ठावीस', 'एकोणतीस',
  'तीस', 'एकतीस', 'बत्तीस', 'तेहतीस', 'चौतीस', 'पस्तीस', 'छत्तीस', 'सदतीस', 'अडतीस', 'एकोणचाळीस',
  'चाळीस', 'एक्केचाळीस', 'बेचाळीस', 'त्रेचाळीस', 'चव्वेचाळीस', 'पंचेचाळीस', 'सेहेचाळीस', 'सत्तेचाळीस', 'अठ्ठेचाळीस', 'एकोणपन्नास',
  'पन्नास', 'एक्कावन्न', 'बावन्न', 'त्रेपन्न', 'चोपन्न', 'पंचावन्न', 'छप्पन्न', 'सत्तावन्न', 'अठ्ठावन्न', 'एकोणसाठ',
  'साठ', 'एकसष्ट', 'बासष्ट', 'त्रेसष्ट', 'चौसष्ट', 'पासष्ट', 'सहासष्ट', 'सदुसष्ट', 'अडुसष्ट', 'एकोणसत्तर',
  'सत्तर', 'एक्काहत्तर', 'बाहत्तर', 'त्र्याहत्तर', 'चौऱ्याहत्तर', 'पंच्याहत्तर', 'शहात्तर', 'सत्याहत्तर', 'अठ्ठ्याहत्तर', 'एकोणऐंशी',
  'ऐंशी', 'एक्याऐंशी', 'ब्याऐंशी', 'त्र्याऐंशी', 'चौऱ्याऐंशी', 'पंच्याऐंशी', 'शहाऐंशी', 'सत्त्याऐंशी', 'अठ्ठ्याऐंशी', 'एकोणनव्वद',
  'नव्वद', 'एक्याण्णव', 'ब्याण्णव', 'त्र्याण्णव', 'चौऱ्याण्णव', 'पंच्याण्णव', 'शहाण्णव', 'सत्त्याण्णव', 'अठ्ठ्याण्णव', 'नव्व्याण्णव',
];

const EN_0_19 = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const EN_TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

/** Largest amount accepted: just under 100 crore */
export const MAX_AMOUNT = 99_99_99_999;

/** 123456789 → [crore, lakh, thousand, hundred, rest] = [12, 34, 56, 7, 89] */
function groups(n: number) {
  if (!Number.isInteger(n) || n < 1 || n > MAX_AMOUNT) throw new Error(`Amount must be whole rupees from 1 to ${MAX_AMOUNT}, got ${n}`);
  return [Math.floor(n / 1e7), Math.floor(n / 1e5) % 100, Math.floor(n / 1e3) % 100, Math.floor(n / 100) % 10, n % 100];
}

/** 12500 → "बारा हजार पाचशे" */
export function amountWordsMr(n: number): string {
  const [crore, lakh, thousand, hundred, rest] = groups(n);
  const out: string[] = [];
  if (crore) out.push(`${MR_0_99[crore]} कोटी`);
  if (lakh) out.push(`${MR_0_99[lakh]} लाख`);
  if (thousand) out.push(`${MR_0_99[thousand]} हजार`);
  // 100 on its own is शंभर; with anything after it, एकशे (एकशे पन्नास)
  if (hundred) out.push(hundred === 1 && !rest && !out.length ? 'शंभर' : `${MR_0_99[hundred]}शे`);
  if (rest) out.push(MR_0_99[rest]);
  return out.join(' ');
}

const en99 = (n: number) => (n < 20 ? EN_0_19[n] : [EN_TENS[Math.floor(n / 10)], n % 10 ? EN_0_19[n % 10] : ''].filter(Boolean).join('-'));

/** 12500 → "Twelve Thousand Five Hundred" */
export function amountWordsEn(n: number): string {
  const [crore, lakh, thousand, hundred, rest] = groups(n);
  const out: string[] = [];
  if (crore) out.push(`${en99(crore)} Crore`);
  if (lakh) out.push(`${en99(lakh)} Lakh`);
  if (thousand) out.push(`${en99(thousand)} Thousand`);
  if (hundred) out.push(`${EN_0_19[hundred]} Hundred`);
  if (rest) out.push(en99(rest));
  return out.join(' ');
}

/** 1250000 → "12,50,000" (Indian grouping) */
export function formatRupees(n: number): string {
  return n.toLocaleString('en-IN');
}
