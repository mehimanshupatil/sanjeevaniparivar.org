// Cleanup — 1080×1350 (4:5) Instagram feed post. Compact sizes; the intro and any plain
// closing paragraphs are left out (they belong in the post caption).
import type { TemplateProps } from '../types';
import Frame from '../../blocks/Frame';
import SloganStrip from '../../blocks/SloganStrip';
import TitleBlock from '../../blocks/TitleBlock';
import CalendarBadge from '../../blocks/CalendarBadge';
import ItemsList from '../../blocks/ItemsList';
import Contacts from '../../blocks/Contacts';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function CleanupInstagram({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  const call = b.closing.filter((c) => c.emphasis);
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      <SloganStrip text={b.invite} compact />
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
      <CalendarBadge days={b.days} venue={b.venue} compact />
      {b.items.length > 0 && <ItemsList heading={b.itemsHeading} items={b.items} more={b.itemsMore} compact />}
      {call.length > 0 && (
        <section className="w-full rounded-[10px] border-[3px] border-marigold bg-white/70 px-8 py-4 text-center">
          {call.map((c, i) => <p key={i} className="text-balance font-ornate text-[27px] leading-[1.4] text-deep">{c.text}</p>)}
        </section>
      )}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} contacts={b.contacts} compact />}
      {b.footer && <FooterLine text={b.footer} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
