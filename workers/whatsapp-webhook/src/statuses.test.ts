import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { parseStatuses, parseIncoming, validSignature, statusIds, MAX_IDS } from './statuses.ts';

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
        messages: [{ id: 'wamid.IN', from: '919800000000', type: 'text', text: { body: 'hi' } }, { id: 'wamid.R', from: '919800000002', type: 'reaction' }],
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

test('parseIncoming: senders of messages, not reactions', () => {
  assert.deepEqual(parseIncoming(body), [{ phoneNumberId: '1318982904641019', from: '919800000000' }]);
  assert.deepEqual(parseIncoming({}), []);
});
