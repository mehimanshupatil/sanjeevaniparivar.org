import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseReceiptCsv, parseReceiptDate, parseReceiptAmount, parsePaymentMode, receiptColumns, receiptFileName, receiptMissing, signedFields,
  RECEIPT_CSV_TEMPLATE, type ReceiptRules,
} from './receipt-csv.ts';

// As in src/content/receipt.ts
const rules: ReceiptRules = {
  titles: ['श्री', 'श्रीमती', 'सौ.', 'कु.', 'डॉ.', 'मे.'],
  modes: [
    { id: 'cash', mr: 'रोख', en: 'Cash', by: 'रोखीने', optional: false },
    { id: 'cheque', mr: 'धनादेश', en: 'Cheque', by: 'धनादेशाने', ref: 'धनादेश क्र., बँक', optional: false },
    { id: 'bank', mr: 'NEFT / RTGS', en: 'NEFT / RTGS', by: 'NEFT / RTGS ने', ref: 'UTR क्र.', optional: true },
    { id: 'upi', mr: 'UPI', en: 'UPI', by: 'UPI ने', ref: 'UTR क्र.', optional: true },
  ],
  programme: 'वार्षिक',
  purpose: 'संजीवनी परिवाराकरिता',
};

test('parseReceiptDate: ISO, day first, Marathi digits, spreadsheet times; impossible dates refused', () => {
  assert.equal(parseReceiptDate('2026-11-02'), '2026-11-02');
  assert.equal(parseReceiptDate('2026-11-02 00:00:00'), '2026-11-02');
  assert.equal(parseReceiptDate('2/11/2026'), '2026-11-02');
  assert.equal(parseReceiptDate('02-11-26'), '2026-11-02');
  assert.equal(parseReceiptDate('०२.११.२०२६'), '2026-11-02');
  assert.equal(parseReceiptDate('31/02/2026'), undefined);
  assert.equal(parseReceiptDate('Nov 2'), undefined);
});

test('parseReceiptAmount and parsePaymentMode', () => {
  assert.equal(parseReceiptAmount('₹ 12,000/-'), '12000');
  assert.equal(parseReceiptAmount('रु. १२०००'), '12000');
  assert.equal(parseReceiptAmount('12000.00'), '12000');
  assert.equal(parseReceiptAmount('12000.50'), '12000.50');
  assert.equal(parsePaymentMode('', rules.modes), 'cash');
  assert.equal(parsePaymentMode('रोख', rules.modes), 'cash');
  assert.equal(parsePaymentMode('NEFT', rules.modes), 'bank');
  assert.equal(parsePaymentMode('धनादेशाने', rules.modes), 'cheque');
  assert.equal(parsePaymentMode('GPay', rules.modes), 'upi');
  assert.equal(parsePaymentMode('barter', rules.modes), undefined);
});

test('receiptColumns: Marathi or English names, extra words after the name', () => {
  assert.deepEqual(receiptColumns(['Sr', 'Name', 'Amount (Rs.)', 'गाव', 'UTR No']), { name: 1, amount: 2, village: 3, reference: 4 });
  assert.deepEqual(Object.keys(receiptColumns(RECEIPT_CSV_TEMPLATE[0])).length, 10);
});

test('parseReceiptCsv: the template row is a good receipt', () => {
  const { rows, missingColumns } = parseReceiptCsv(RECEIPT_CSV_TEMPLATE, rules);
  assert.deepEqual(missingColumns, []);
  assert.deepEqual(rows, [{
    line: 2, problems: [],
    receipt: { serial: '1427', date: '2026-11-02', title: 'श्री', name: 'आनंद रमेश पाटील', village: 'वाघोली', amount: '12000',
      programme: 'वार्षिक', purpose: 'संजीवनी परिवाराकरिता', mode: 'upi', reference: '' },
  }]);
});

test('parseReceiptCsv: titles in the name, defaults, blank rows, and every kind of problem', () => {
  const { rows, missingColumns } = parseReceiptCsv([
    ['पावती क्रमांक', 'नाव', 'रक्कम', 'दिनांक', 'माध्यम', 'UTR'],
    ['१', 'सौ. सुनीता पाटील', '500', '1/4/2026', 'cheque', ''],
    ['', '', '', '', '', ''],
    ['2', 'श्रीकांत म्हात्रे', '१,०००', 'yesterday', 'barter', ''],
    ['2', 'श्रीमती रेखा', '12.5', '', '', ''],
  ], rules);
  assert.deepEqual(missingColumns, []);
  assert.deepEqual(rows.map((r) => r.line), [2, 4, 5]);
  assert.deepEqual(rows[0].receipt.title, 'सौ.');
  assert.deepEqual(rows[0].receipt.name, 'सुनीता पाटील');
  assert.deepEqual(rows[0].receipt.serial, '1');
  assert.deepEqual(rows[0].problems, ['धनादेश क्र., बँक नाही']);
  // "श्रीकांत" is a name, not श्री + कांत
  assert.deepEqual([rows[1].receipt.title, rows[1].receipt.name, rows[1].receipt.amount], ['श्री', 'श्रीकांत म्हात्रे', '1000']);
  assert.deepEqual(rows[1].problems, ['दिनांक "yesterday" ओळखता आला नाही (दिवस/महिना/वर्ष लिहा)', 'माध्यम "barter" ओळखता आले नाही']);
  assert.deepEqual(rows[2].problems, ['दिनांक नाही', 'रक्कम (पूर्ण रुपये) नाही', 'क्रमांक 2 ओळ 4 मध्येही आहे']);
  assert.deepEqual(parseReceiptCsv([['नाव', 'गाव']], rules).missingColumns, ['क्रमांक', 'रक्कम']);
});

test('receiptMissing, signedFields and receiptFileName match the single receipt form', () => {
  const r = parseReceiptCsv(RECEIPT_CSV_TEMPLATE, rules).rows[0].receipt;
  assert.deepEqual(receiptMissing({ ...r, mode: 'cheque' }, rules.modes), ['धनादेश क्र., बँक']);
  assert.deepEqual(signedFields({ ...r, reference: 'X1' }, rules.modes), {
    serial: '1427', date: '2026-11-02', amount: 12000, name: 'श्री आनंद रमेश पाटील', village: 'वाघोली', mode: 'upi',
    reference: 'X1', programme: 'वार्षिक', purpose: 'संजीवनी परिवाराकरिता',
  });
  assert.equal(signedFields({ ...r, mode: 'cash', reference: 'X1' }, rules.modes).reference, '');
  assert.equal(receiptFileName(r), 'पावती-आनंद-रमेश-पाटील-1427.pdf');
});
