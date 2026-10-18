// What a programme type has besides title, date and venue — the attractions, terms, groups,
// lectures or programme — for the styles that aren't the type's own Template. `compact`
// (Instagram) leaves out the secondary parts, as the type's own Instagram layout does.
import type { ResolvedEdition } from '../edition';
import ItemsList from '../blocks/ItemsList';
import NumberedList from '../blocks/NumberedList';
import NoteBox from '../blocks/NoteBox';
import GroupCards from '../blocks/GroupCards';
import SessionList from '../blocks/SessionList';
import ProgrammeCard from '../blocks/ProgrammeCard';

interface Props {
  edition: ResolvedEdition;
  compact?: boolean;
  /** A narrower column (e.g. beside a side rail): denser blocks */
  narrow?: boolean;
}

export default function Details({ edition: b, compact = false, narrow = false }: Props) {
  const dense = compact || narrow;
  const items = b.items.length > 0 && <ItemsList heading={b.itemsHeading} items={b.items} more={b.itemsMore} compact={dense} />;
  switch (b.type) {
    case 'workshop':
      return <>
        {b.rules.length > 0 && <NumberedList heading={b.rulesHeading} items={b.rules} palette={b.theme.palette} compact={dense} />}
        {b.note && <NoteBox label={b.note.label} text={b.note.text} compact={dense} />}
      </>;
    case 'competition':
      return <>
        {b.groups.length > 0 && <GroupCards heading={compact ? undefined : b.groupsHeading} groups={b.groups} palette={b.theme.palette} compact={dense} />}
        {!compact && b.rules.length > 0 && (
          <p className="w-full rounded-[10px] border-2 border-dashed border-gold px-5 py-2.5 text-center text-[20px] leading-[1.45]">
            {b.rulesHeading && <strong className="font-bold text-deep">{b.rulesHeading} : </strong>}{b.rules.join(' ')}
          </p>
        )}
        {!compact && b.note && <NoteBox label={b.note.label} text={b.note.text} compact />}
      </>;
    case 'lectures':
      return b.sessions.length > 0
        ? <SessionList sessions={b.sessions} showTime={new Set(b.days.map((d) => d.time)).size > 1} compact={dense} />
        : null;
    case 'celebration':
      return !compact && b.note ? <ProgrammeCard label={b.note.label} text={b.note.text} compact={narrow} /> : null;
    default:
      return items || null;
  }
}

/** Venue lines on one line: "वाघेश्वरी मंदिर," + "वाघोली" → "वाघेश्वरी मंदिर, वाघोली"; lines without a comma get one */
export const venueInline = (lines: string[]) =>
  lines.reduce((s, l, i) => (i === 0 ? l : `${s}${/[,،]$/.test(s.trim()) ? ' ' : ', '}${l}`), '');

/** Heavy types need more room for their details, so the styles shrink their headers. */
export const isHeavy = (b: ResolvedEdition) =>
  b.sessions.length > 0 || b.groups.length > 0 || b.rules.length > 2 || b.items.length > 6;
