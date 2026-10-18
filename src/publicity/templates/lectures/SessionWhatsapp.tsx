// Lectures — 1080×1920 card for one lecture (पुष्प): series name and "वर्ष २४ वे · पुष्प पहिले",
// the speaker's photo (no lamps beside it: समई around a portrait reads as a memorial), name and role, the topic, the date band, the speaker's
// परिचय, this lecture's request to attend (or the series' invitation) and the footer.
import type { SessionProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import WhenWhere from '../../blocks/WhenWhere';
import FooterLine from '../../blocks/FooterLine';
import DecorRow from '../../blocks/DecorRow';

export default function LectureSessionWhatsapp({ edition: b, session: x, format }: SessionProps) {
  const { decor } = b.theme;
  const call = x.closing ?? b.closing.find((c) => c.emphasis)?.text;
  return (
    <Frame format={format} pattern={decor.pattern}>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}
      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} compact />

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-display font-display-weight text-[64px] leading-[1.1] text-primary">{b.title.main} <span className="font-ornate font-normal text-gold">{b.yearMr}</span></p>
        <p className="rounded-full bg-deep px-8 py-1 font-ornate text-[30px] text-band-text">
          {[b.title.sub, x.label].filter(Boolean).join(' · ')}
        </p>
      </div>

      {x.speaker.photo && (
        <img src={x.speaker.photo} alt={x.speaker.name}
          className="w-[320px] h-[400px] rounded-[16px] border-[6px] border-double border-gold object-cover outline-2 outline-offset-4 outline-gold" />
      )}

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-bold text-[50px] leading-[1.15] text-primary">{x.speaker.name}</p>
        {x.speaker.role && <p className="text-[24px] text-ink-soft">{x.speaker.role}</p>}
      </div>

      <section className="w-full flex flex-col items-center gap-1 text-center">
        <span className="font-ornate text-[24px] text-gold">— विषय —</span>
        <p className="text-balance font-ornate text-[46px] leading-[1.25] text-deep">“{x.topic}”</p>
        {x.topicNote && <p className="text-[21px] text-ink-soft">{x.topicNote}</p>}
      </section>

      <WhenWhere days={[x]} venue={b.venue} compact />

      {x.bio && <p className="w-full rounded-[10px] border-l-[6px] border-gold bg-white/70 px-6 py-4 text-[20px] leading-[1.5]">{x.bio}</p>}
      {call && <p className="text-balance text-center font-ornate text-[28px] leading-[1.4] text-primary">{call}</p>}
      {b.footer && <FooterLine text={b.footer} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
