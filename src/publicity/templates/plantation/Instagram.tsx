// Plantation — 1080×1350 (4:5) Instagram feed post. Compact sizes; the intro paragraph and
// any plain closing paragraphs are left out (they belong in the post caption).
import type { TemplateProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import TitleBlock from '../../blocks/TitleBlock';
import WhenWhere from '../../blocks/WhenWhere';
import ItemsList from '../../blocks/ItemsList';
import Contacts from '../../blocks/Contacts';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function PlantationInstagram({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  const call = b.closing.filter((c) => c.emphasis);
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}

      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} compact />
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
      <WhenWhere days={b.days} venue={b.venue} compact />
      {b.items.length > 0 && <ItemsList heading={b.itemsHeading} items={b.items} more={b.itemsMore} compact />}
      {call.map((c, i) => (
        <p key={i} className="max-w-[900px] text-center font-ornate text-[28px] leading-[1.4] text-deep">{c.text}</p>
      ))}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} contacts={b.contacts} compact />}
      {b.footer && <FooterLine text={b.footer} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
