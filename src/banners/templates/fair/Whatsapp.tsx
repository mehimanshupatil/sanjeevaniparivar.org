// Fair (e.g. ग्राहक पेठ) — 1080×1920 WhatsApp card, also works as an Instagram story.
import type { TemplateProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import Organisers from '../../blocks/Organisers';
import TitleBlock from '../../blocks/TitleBlock';
import WhenWhere from '../../blocks/WhenWhere';
import ItemsList from '../../blocks/ItemsList';
import Closing from '../../blocks/Closing';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function FairWhatsapp({ banner: b, format }: TemplateProps) {
  const { decor } = b.theme;
  return (
    <Frame format={format} pattern={decor.pattern}>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}

      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} />
      {b.organisers.length > 0 && <Organisers names={b.organisers} suffix={b.organisersSuffix} />}
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} />

      {b.intro && <p className="max-w-[880px] text-center text-[24px] leading-[1.55]">{b.intro}</p>}

      <WhenWhere days={b.days} venue={b.venue} />
      {b.items.length > 0 && <ItemsList heading={b.itemsHeading} items={b.items} more={b.itemsMore} />}
      <Closing paragraphs={b.closing} />
      {b.footer && <FooterLine text={b.footer} />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} />}
    </Frame>
  );
}
