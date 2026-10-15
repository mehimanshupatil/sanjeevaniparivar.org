// Workshop — 1080×1350 (4:5) Instagram feed post. Compact sizes; the intro paragraph
// and the registration sentence are left out (they belong in the post caption).
import type { TemplateProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import TitleBlock from '../../blocks/TitleBlock';
import WhenWhere from '../../blocks/WhenWhere';
import NumberedList from '../../blocks/NumberedList';
import NoteBox from '../../blocks/NoteBox';
import Contacts from '../../blocks/Contacts';
import DecorRow from '../../blocks/DecorRow';

export default function WorkshopInstagram({ banner: b, format }: TemplateProps) {
  const { decor } = b.theme;
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}

      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} compact />
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
      <WhenWhere days={b.days} venue={b.venue} compact />
      {b.rules.length > 0 && <NumberedList heading={b.rulesHeading} items={b.rules} palette={b.theme.palette} compact />}
      {b.note && <NoteBox label={b.note.label} text={b.note.text} compact />}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} contacts={b.contacts} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
