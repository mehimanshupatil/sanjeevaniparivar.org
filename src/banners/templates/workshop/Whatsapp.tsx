// Workshop (e.g. आकाशकंदील कार्यशाळा) — 1080×1920 WhatsApp card, also works as an Instagram story.
import type { TemplateProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import Organisers from '../../blocks/Organisers';
import TitleBlock from '../../blocks/TitleBlock';
import WhenWhere from '../../blocks/WhenWhere';
import NumberedList from '../../blocks/NumberedList';
import NoteBox from '../../blocks/NoteBox';
import Contacts from '../../blocks/Contacts';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function WorkshopWhatsapp({ banner: b, format }: TemplateProps) {
  const { decor } = b.theme;
  return (
    <Frame format={format} pattern={decor.pattern}>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}

      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} />
      {b.organisers.length > 0 && <Organisers names={b.organisers} suffix={b.organisersSuffix} />}
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} />

      {b.intro && <p className="max-w-[900px] text-center text-[23px] leading-[1.5]">{b.intro}</p>}

      <WhenWhere days={b.days} venue={b.venue} />
      {b.rules.length > 0 && <NumberedList heading={b.rulesHeading} items={b.rules} palette={b.theme.palette} />}
      {b.note && <NoteBox label={b.note.label} text={b.note.text} />}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} intro={b.contactsIntro} contacts={b.contacts} />}
      {b.footer && <FooterLine text={b.footer} />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} />}
    </Frame>
  );
}
