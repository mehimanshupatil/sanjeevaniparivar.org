import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, toCsv, normalizePhone, templateSlots, buildMessage, fillText, sendPath, optimizationsOn, apiError, resultIds, withDelivery, type WaTemplate } from './whatsapp.ts';

test('parseCsv: quotes, escaped quotes, CRLF, BOM, blank lines, Marathi', () => {
  const csv = '﻿नाव,फोन\r\n"म्हात्रे, संदीप",98765 43210\r\n\r\n"He said ""hi""",+91 98765-43211\n';
  assert.deepEqual(parseCsv(csv), [['नाव', 'फोन'], ['म्हात्रे, संदीप', '98765 43210'], ['He said "hi"', '+91 98765-43211']]);
});

test('toCsv round-trips through parseCsv', () => {
  const rows = [['a', 'b,c'], ['"q"', 'line']];
  assert.deepEqual(parseCsv(toCsv(rows)), rows);
});

test('normalizePhone', () => {
  assert.equal(normalizePhone('98765 43210'), '919876543210');
  assert.equal(normalizePhone('+91 98765-43210'), '919876543210');
  assert.equal(normalizePhone('09876543210'), '919876543210');
  assert.equal(normalizePhone('0091 9876543210'), '919876543210');
  assert.equal(normalizePhone('+44 7700 900123'), '447700900123');
  assert.equal(normalizePhone('12345'), null);
  assert.equal(normalizePhone('0250 2345678'), null); // landline
  assert.equal(normalizePhone(''), null);
});

const positional: WaTemplate = {
  id: '1', name: 'grahak_peth', language: 'mr', status: 'APPROVED', category: 'MARKETING',
  components: [
    { type: 'HEADER', format: 'IMAGE' },
    { type: 'BODY', text: 'नमस्कार {{1}}, {{2}} येथे या. {{1}}' },
    { type: 'BUTTONS', buttons: [{ type: 'URL', text: 'पहा', url: 'https://x.org/{{1}}' }, { type: 'QUICK_REPLY', text: 'थांबवा' }] },
  ],
};

test('templateSlots: header, body (each name once), URL buttons', () => {
  assert.deepEqual(templateSlots(positional).map((s) => s.key), ['body:1', 'body:2', 'button:0:1']);
  const named: WaTemplate = { ...positional, components: [{ type: 'HEADER', format: 'TEXT', text: 'प्रति {{guest}}' }, { type: 'BODY', text: 'Hi {{guest}} at {{place}}' }] };
  assert.deepEqual(templateSlots(named).map((s) => s.key), ['header:guest', 'body:guest', 'body:place']);
});

test('buildMessage: positional with image header and URL button', () => {
  const m = buildMessage(positional, '919876543210', { 'body:1': 'संदीप', 'body:2': 'उमराळे', 'button:0:1': '2026' }, 'https://x.org/c.png');
  assert.deepEqual(m.template.components, [
    { type: 'header', parameters: [{ type: 'image', image: { link: 'https://x.org/c.png' } }] },
    { type: 'body', parameters: [{ type: 'text', text: 'संदीप' }, { type: 'text', text: 'उमराळे' }] },
    { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: '2026' }] },
  ]);
  assert.equal(m.to, '919876543210');
  assert.deepEqual(m.template.language, { code: 'mr' });
  assert.throws(() => buildMessage(positional, '91', {}));
});

test('buildMessage: named parameters, no components when nothing to fill', () => {
  const named: WaTemplate = { ...positional, parameter_format: 'NAMED', components: [{ type: 'BODY', text: 'Hi {{guest}}' }] };
  assert.deepEqual(buildMessage(named, '91', { 'body:guest': 'A' }).template.components, [{ type: 'body', parameters: [{ type: 'text', parameter_name: 'guest', text: 'A' }] }]);
  const plain: WaTemplate = { ...positional, components: [{ type: 'BODY', text: 'Hello' }] };
  assert.equal('components' in buildMessage(plain, '91', {}).template, false);
});

test('fillText, sendPath, optimizationsOn, apiError', () => {
  assert.equal(fillText('नमस्कार {{1}} {{2}}', { 'body:1': 'A' }, 'body'), 'नमस्कार A {{2}}');
  assert.equal(sendPath(positional), 'marketing_messages');
  assert.equal(sendPath({ ...positional, category: 'UTILITY' }), 'messages');
  assert.deepEqual(optimizationsOn({ creative_features_spec: [{ key: 'IMAGE_TOUCHUPS', value: { enroll_status: 'OPT_IN' } }, { key: 'ADD_TEXT_OVERLAY', value: { enroll_status: 'OPT_OUT' } }] }), ['image_touchups']);
  assert.deepEqual(optimizationsOn(undefined), []);
  assert.equal(apiError({ error: { code: 131030, message: 'Recipient not in allowed list', error_data: { details: 'add it' } } }, 400), '#131030 — Recipient not in allowed list — add it');
  assert.equal(apiError({}, 500), 'HTTP 500');
  assert.equal(apiError({ error: { code: 100, error_subcode: 2388339, message: 'Invalid parameter', error_user_msg: 'This API is not supported for this WhatsApp Business Account.' } }, 400),
    '#100/2388339 — Invalid parameter — This API is not supported for this WhatsApp Business Account.');
});

test('resultIds + withDelivery: read message ids back from a results CSV, fill in the latest delivery', () => {
  const old = [
    ['नाव', 'फोन', 'WhatsApp क्रमांक', 'स्थिती', 'message id / त्रुटी', 'पोहोच', 'पोहोच त्रुटी'],
    ['अ', '9800000000', '919800000000', 'sent', 'wamid.A=', 'delivered', ''],
    ['ब', '9800000001', '919800000001', 'failed', '#131026 — bad number', '', ''],
    ['क', '9800000002', '919800000002', 'sent', 'wamid.C', ''],
    ['ड', '', '', 'skipped', ''],
  ];
  assert.deepEqual(resultIds(old), { column: 4, ids: ['wamid.A=', 'wamid.C'] });
  assert.equal(resultIds([['नाव'], ['अ']]), undefined);
  const delivery = { 'wamid.A=': { status: 'read', error: null }, 'wamid.C': { status: 'failed', error: '#131049 — not delivered' } };
  const updated = withDelivery(old, 4, delivery);
  assert.deepEqual(updated[1].slice(5), ['read', '']);
  assert.deepEqual(updated[2].slice(5), ['', '']);
  assert.deepEqual(updated[3].slice(5), ['failed', '#131049 — not delivered']);
  assert.deepEqual(updated[4], ['ड', '', '', 'skipped', '', '', '']);
  // A results CSV without the delivery columns gets them added
  const plain = withDelivery([['नाव', 'id'], ['अ', 'wamid.A=']], 1, delivery);
  assert.deepEqual(plain, [['नाव', 'id', 'पोहोच', 'पोहोच त्रुटी'], ['अ', 'wamid.A=', 'read', '']]);
});
