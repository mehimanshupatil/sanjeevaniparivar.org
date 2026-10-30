// Trust details and choices for digital donation receipts (/publicity/receipt/), laid out like the
// paper receipt book. Receipts carry the Legal Name and the trust's registration (GLOSSARY.md); the
// old paper books still print the earlier name and number. No 80G: the trust doesn't have it.

export const RECEIPT_TRUST = {
  legalName: 'संजिवनी परिवार संस्था, नालासोपारा (प)',
  /** Public trust register number, Palghar Division (from the annual report) */
  regNo: 'एफ-१७९४ (पालघर)',
  address: '“पारिजात”, वाघोली, निर्मळ रोड, ता. वसई, पिन - ४०१ ३०४',
  email: 'sanjeevani.parivar@gmail.com',
  website: 'sanjeevaniparivar.org',
};

/** `by`: how the receipt sentence ends ("… धनादेशाने मिळाले"); `ref`: label of the detail it needs */
export const PAYMENT_MODES = [
  { id: 'cash', mr: 'रोख', en: 'Cash', by: 'रोखीने', ref: undefined },
  { id: 'cheque', mr: 'धनादेश', en: 'Cheque', by: 'धनादेशाने', ref: 'धनादेश क्र., बँक' },
  { id: 'bank', mr: 'NEFT / RTGS', en: 'NEFT / RTGS', by: 'NEFT / RTGS ने', ref: 'UTR क्र.' },
  { id: 'upi', mr: 'UPI', en: 'UPI', by: 'UPI ने', ref: 'UTR क्र.' },
] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number]['id'];

/** कार्यक्रम, as printed on the paper receipt; another can be typed */
export const RECEIPT_PROGRAMMES = ['वार्षिक', 'व्याख्यानमाला', 'मेडिकल फंड'];

/** निमित्त, unless the donor gives another */
export const DEFAULT_PURPOSE = 'संजीवनी परिवाराकरिता';
