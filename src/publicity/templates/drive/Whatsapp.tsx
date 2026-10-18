// Drive (e.g. स्वच्छता अभियान, वृक्षारोपण) — 1080×1920 WhatsApp card, also works as an Instagram story.
// Little text, so it is set larger than the other types: slogan, title, intro, date band, the call to join.
import type { TemplateProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import Organisers from '../../blocks/Organisers';
import TitleBlock from '../../blocks/TitleBlock';
import WhenWhere from '../../blocks/WhenWhere';
import ItemsList from '../../blocks/ItemsList';
import Contacts from '../../blocks/Contacts';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function DriveWhatsapp({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  return (
    <Frame format={format} pattern={decor.pattern}>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}

      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} />
      {b.organisers.length > 0 && <Organisers names={b.organisers} suffix={b.organisersSuffix} />}
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} />

      {b.intro && <p className="max-w-[900px] text-center text-[28px] leading-[1.55]">{b.intro}</p>}

      <WhenWhere days={b.days} venue={b.venue} />
      {b.items.length > 0 && <ItemsList heading={b.itemsHeading} items={b.items} more={b.itemsMore} />}
      {b.closing.length > 0 && (
        <section className="max-w-[920px] flex flex-col items-center gap-4 text-center">
          {b.closing.map((c, i) => (
            <p key={i} className={c.emphasis ? 'font-ornate text-[34px] leading-[1.45] text-deep' : 'text-[27px] leading-[1.5]'}>{c.text}</p>
          ))}
        </section>
      )}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} intro={b.contactsIntro} contacts={b.contacts} />}
      {b.footer && <FooterLine text={b.footer} />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} />}
    </Frame>
  );
}
