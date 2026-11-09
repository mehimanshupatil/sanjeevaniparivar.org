import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { parseStatuses, parseIncoming, validSignature, statusIds, optOutIntent, hasKey, istTime, toCsv, MAX_IDS, MAX_TEXT } from './statuses.ts';

const body = {
  object: 'whatsapp_business_account',
  entry: [{
    id: '2539900846429599',
    changes: [{
      field: 'messages',
      value: {
        messaging_product: 'whatsapp',
        metadata: { phone_number_id: '1318982904641019' },
        statuses: [
          { id: 'wamid.A', status: 'delivered', timestamp: '1793030000', recipient_id: '919800000000' },
          { id: 'wamid.B', status: 'failed', timestamp: '1793030001', recipient_id: '919800000001',
            errors: [{ code: 131049, title: 'This message was not delivered to maintain healthy ecosystem engagement.', error_data: { details: 'In order to maintain…' } }] },
          { id: 'wamid.C', status: 'deleted', timestamp: '1793030002' },
        ],
        contacts: [{ wa_id: '919800000000', profile: { name: 'संदीप' } }],
        messages: [
          { id: 'wamid.IN', from: '919800000000', type: 'text', timestamp: '1793030010', text: { body: 'hi' } },
          { id: 'wamid.R', from: '919800000002', type: 'reaction' },
          { id: 'wamid.BTN', from: '919800000003', type: 'button', timestamp: '1793030011', button: { text: 'Stop promotions' } },
          { id: 'wamid.IMG', from: '919800000004', type: 'image', timestamp: '1793030012', image: {} },
        ],
      },
    }, { field: 'account_update', value: { statuses: [{ id: 'wamid.X', status: 'sent' }] } }],
  }],
};

test('parseStatuses: statuses of known kinds only, error text, no phone numbers or messages', () => {
  assert.deepEqual(parseStatuses(body), [
    { id: 'wamid.A', status: 'delivered', rank: 2, at: 1793030000, error: null },
    { id: 'wamid.B', status: 'failed', rank: 4, at: 1793030001,
      error: '#131049 — This message was not delivered to maintain healthy ecosystem engagement. — In order to maintain…' },
  ]);
  assert.deepEqual(parseStatuses({}), []);
  assert.deepEqual(parseStatuses(null), []);
});

test('validSignature: HMAC-SHA256 of the raw body with the app secret', async () => {
  const raw = new TextEncoder().encode(JSON.stringify(body));
  const sig = 'sha256=' + createHmac('sha256', 'secret').update(raw).digest('hex');
  assert.equal(await validSignature('secret', raw, sig), true);
  assert.equal(await validSignature('secret', raw, sig.toUpperCase().replace('SHA256=', 'sha256=')), true);
  assert.equal(await validSignature('other', raw, sig), false);
  assert.equal(await validSignature('secret', raw, sig.slice(0, -1)), false);
  assert.equal(await validSignature('secret', raw, null), false);
  assert.equal(await validSignature('', raw, sig), false);
});

test('statusIds: WhatsApp ids, no repeats, capped', () => {
  assert.deepEqual(statusIds('wamid.HBgM=,wamid.HBgM=, wamid.b-_+/ ,x,wamid.,wamid.a;drop'), ['wamid.HBgM=', 'wamid.b-_+/']);
  assert.deepEqual(statusIds(null), []);
  assert.equal(statusIds(Array.from({ length: 150 }, (_, i) => `wamid.${i}`).join(',')).length, MAX_IDS);
});

test('parseIncoming: who wrote and what, not reactions', () => {
  const p = '1318982904641019';
  assert.deepEqual(parseIncoming(body), [
    { phoneNumberId: p, id: 'wamid.IN', from: '919800000000', name: 'संदीप', type: 'text', text: 'hi', at: 1793030010 },
    { phoneNumberId: p, id: 'wamid.BTN', from: '919800000003', name: '', type: 'button', text: 'Stop promotions', at: 1793030011 },
    { phoneNumberId: p, id: 'wamid.IMG', from: '919800000004', name: '', type: 'image', text: '', at: 1793030012 },
  ]);
  const long = { entry: [{ changes: [{ field: 'messages', value: { metadata: { phone_number_id: p }, messages: [{ id: 'w', from: '91', type: 'text', text: { body: 'x'.repeat(900) } }] } }] }] };
  assert.equal(parseIncoming(long)[0].text.length, MAX_TEXT);
  assert.deepEqual(parseIncoming({}), []);
});

test('optOutIntent: the whole message, in English or Marathi', () => {
  for (const t of ['STOP', 'Stop.', ' stop promotions ', 'थांबवा', 'बंद करा']) assert.equal(optOutIntent(t), 'stop', t);
  for (const t of ['START', 'Resume promotions', 'सुरू करा']) assert.equal(optOutIntent(t), 'start', t);
  for (const t of ['please do not stop', 'stopped by the office', 'hi', '']) assert.equal(optOutIntent(t), undefined, t);
});

test('hasKey, istTime, toCsv', () => {
  assert.equal(hasKey('k3y', 'Bearer k3y'), true);
  assert.equal(hasKey('k3y', 'Bearer k3'), false);
  assert.equal(hasKey('k3y', 'k3y'), false);
  assert.equal(hasKey('', 'Bearer '), false);
  assert.equal(hasKey('k3y', null), false);
  assert.equal(istTime(Date.UTC(2026, 10, 9, 8, 35) / 1000), '2026-11-09 14:05');
  assert.equal(toCsv([['नाव', 'संदेश'], ['अ', 'a, say "hi" now']]), '\ufeffनाव,संदेश\nअ,"a, say ""hi"" now"');
});
