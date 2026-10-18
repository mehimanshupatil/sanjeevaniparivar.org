// Lectures (e.g. संजीवनी व्याख्यानमाला) — 1080×1920 series card: every पुष्प on one card.
// Garland, logo + invite, title with समई either side and "वर्ष २४ वे", an ओवी, the intro,
// a row per lecture (date tile, photo, speaker, topic), वेळ | स्थळ, the invitation and contacts.
import type { TemplateProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import TitleBlock from '../../blocks/TitleBlock';
import SessionList from '../../blocks/SessionList';
import TimeVenue from '../../blocks/TimeVenue';
import Contacts from '../../blocks/Contacts';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function LecturesWhatsapp({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  // One shared time goes in the band; otherwise each row shows its own.
  const times = [...new Set(b.days.map((d) => d.time))];
  return (
    <Frame format={format} pattern={decor.pattern}>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}
      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} />

      <div className="w-full flex flex-col items-center gap-1">
        <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} />
        {b.title.sub && <p className="rounded-full bg-primary px-8 py-1 font-ornate text-[30px] text-band-text">{b.title.sub}</p>}
      </div>

      {b.quote && (
        <p className="whitespace-pre-line text-center font-ornate text-[25px] leading-[1.5] text-deep">{b.quote.text}</p>
      )}
      {b.intro && <p className="max-w-[920px] text-center text-[22px] leading-[1.5]">{b.intro}</p>}

      <SessionList sessions={b.sessions} showTime={times.length > 1} />
      <TimeVenue time={times.length === 1 ? times[0] : undefined} venue={b.venue} />

      {b.closing.map((c, i) => (
        <p key={i} className={c.emphasis ? 'text-balance text-center font-ornate text-[30px] leading-[1.4] text-primary' : 'text-balance text-center text-[23px] leading-[1.45]'}>{c.text}</p>
      ))}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} intro={b.contactsIntro} contacts={b.contacts} compact />}
      {b.footer && <FooterLine text={b.footer} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
