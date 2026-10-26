// Fair (e.g. ग्राहक पेठ) — 1080×1350 (4:5) Instagram feed post. Same blocks as Whatsapp.tsx, compact sizes;
// the intro and closing paragraphs are left out (they belong in the post caption).
import type { TemplateProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import Organisers from '../../blocks/Organisers';
import TitleBlock from '../../blocks/TitleBlock';
import WhenWhere from '../../blocks/WhenWhere';
import ItemsList from '../../blocks/ItemsList';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function FairInstagram({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}

      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} deity={b.deity} compact />
      {b.organisers.length > 0 && <Organisers names={b.organisers} suffix={b.organisersSuffix} compact />}
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
      <WhenWhere days={b.days} venue={b.venue} compact />
      {b.items.length > 0 && <ItemsList heading={b.itemsHeading} items={b.items} more={b.itemsMore} compact />}
      {b.footer && <FooterLine text={b.footer} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
