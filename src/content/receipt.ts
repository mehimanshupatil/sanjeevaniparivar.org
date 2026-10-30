// Trust details printed on every digital donation receipt (/publicity/receipt/).
// Receipts carry the Legal Name, never the Public Name (GLOSSARY.md). No 80G: the trust doesn't have it.

export const RECEIPT_TRUST = {
  legalName: 'संजिवनी परिवार संस्था, नालासोपारा (प)',
  /** Public trust register number, Palghar Division (from the annual report). Empty: the tool warns */
  regNo: 'एफ-१७९४ (पालघर)',
  address: '“पारिजात”, वाघोली, निर्मळ रोड, ता. वसई, पिन - ४०१ ३०४',
  email: 'sanjeevani.parivar@gmail.com',
  website: 'sanjeevaniparivar.org',
};

export const PAYMENT_MODES = [
  { id: 'cash', mr: 'रोख', en: 'Cash', ref: false },
  { id: 'upi', mr: 'UPI', en: 'UPI', ref: true },
  { id: 'cheque', mr: 'धनादेश', en: 'Cheque', ref: true },
  { id: 'bank', mr: 'बँक हस्तांतरण', en: 'Bank transfer', ref: true },
] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number]['id'];
