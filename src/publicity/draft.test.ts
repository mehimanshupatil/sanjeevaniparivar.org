import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'yaml';
import { draftFromSample, draftToEntries, programmeYaml, editionYaml } from './draft.ts';
import * as sample from './templates/fair/sample.ts';
import * as workshopSample from './templates/workshop/sample.ts';
import * as driveSample from './templates/drive/sample.ts';

/** Drops undefined fields, as YAML has no way to write them. */
const clean = (o: unknown) => JSON.parse(JSON.stringify(o));

for (const [type, s] of [['fair', sample], ['workshop', workshopSample], ['drive', driveSample]] as const) {
  test(`${type}: the generated YAML parses back to the same programme and edition`, () => {
    const { programme, edition } = draftToEntries(draftFromSample(s.programme, s.edition), s.programme);
    assert.deepEqual(parse(programmeYaml(programme)), clean(programme.data));
    const parsedEdition = parse(editionYaml(edition));
    assert.equal(parsedEdition.programme, programme.id);
    assert.deepEqual(parsedEdition.days, clean(edition.data.days));
    assert.deepEqual(parsedEdition.venue, edition.data.venue);
  });
}

test('workshop: incomplete contact rows are left out', () => {
  const draft = draftFromSample(workshopSample.programme, workshopSample.edition);
  draft.contacts = [{ name: 'अ', phone: '9028265426' }, { name: '', phone: '9000000000' }, { name: 'ब', phone: '12' }];
  const { programme } = draftToEntries(draft, workshopSample.programme);
  assert.deepEqual(programme.data.contacts, [{ name: 'अ', phone: '9028265426' }]);
});

test('text with quotes, colons and placeholders survives', () => {
  const draft = draftFromSample(sample.programme, sample.edition);
  draft.intro = 'वेळ: "सायंकाळी" — {{ fullTitle }}';
  const { programme } = draftToEntries(draft, sample.programme);
  assert.equal(parse(programmeYaml(programme)).intro, draft.intro);
});

test('empty optional fields are left out, and an open-ended day has no "to"', () => {
  const draft = draftFromSample(sample.programme, sample.edition);
  draft.tagline = '  ';
  draft.days = [{ date: '2027-10-29', from: '09:00', to: '' }];
  const { programme, edition } = draftToEntries(draft, sample.programme);
  assert.equal('tagline' in parse(programmeYaml(programme)), false);
  assert.deepEqual(parse(editionYaml(edition)).days, [{ date: '2027-10-29', from: '09:00' }]);
});
