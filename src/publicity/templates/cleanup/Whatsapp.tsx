// Cleanup (e.g. स्वच्छता अभियान) — 1080×1920 WhatsApp card, also works as an Instagram story.
// Slogan strip across the top, centred logo, title between brooms, a calendar badge
// for the date, and the call to join in an outlined box.
import type { TemplateProps } from '../types';
import Frame from '../../blocks/Frame';
import SloganStrip from '../../blocks/SloganStrip';
import Organisers from '../../blocks/Organisers';
import TitleBlock from '../../blocks/TitleBlock';
import CalendarBadge from '../../blocks/CalendarBadge';
import ItemsList from '../../blocks/ItemsList';
import Contacts from '../../blocks/Contacts';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function CleanupWhatsapp({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  const logo = b.logos.left ?? b.logos.right;
  const plain = b.closing.filter((c) => !c.emphasis);
  const call = b.closing.filter((c) => c.emphasis);
  return (
    <Frame format={format} pattern={decor.pattern}>
      <SloganStrip text={b.invite} />
      {logo && (
        <figure className="flex flex-col items-center gap-1.5">
          <img src={logo.src} alt={logo.caption} className="size-[120px] object-contain" />
          <figcaption className="text-[19px] font-semibold text-deep">{logo.caption}</figcaption>
        </figure>
      )}
      {b.organisers.length > 0 && <Organisers names={b.organisers} suffix={b.organisersSuffix} />}
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} />

      {b.intro && <p className="max-w-[900px] text-center text-[28px] leading-[1.55]">{b.intro}</p>}

      <CalendarBadge days={b.days} venue={b.venue} />
      {b.items.length > 0 && <ItemsList heading={b.itemsHeading} items={b.items} more={b.itemsMore} />}
      {plain.map((c, i) => <p key={i} className="max-w-[900px] text-center text-[27px] leading-[1.5]">{c.text}</p>)}
      {call.length > 0 && (
        <section className="w-full rounded-[10px] border-[3px] border-marigold bg-white/70 px-10 py-7 text-center">
          {call.map((c, i) => <p key={i} className="text-balance font-ornate text-[34px] leading-[1.45] text-deep">{c.text}</p>)}
        </section>
      )}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} intro={b.contactsIntro} contacts={b.contacts} />}
      {b.footer && <FooterLine text={b.footer} />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} />}
    </Frame>
  );
}
