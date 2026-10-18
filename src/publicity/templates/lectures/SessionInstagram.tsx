// Lectures — 1080×1350 (4:5) post for one lecture: photo beside name, role and topic,
// then the date band. The speaker's परिचय belongs in the post caption.
import type { SessionProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import WhenWhere from '../../blocks/WhenWhere';
import DecorRow from '../../blocks/DecorRow';

export default function LectureSessionInstagram({ edition: b, session: x, format }: SessionProps) {
  const { decor } = b.theme;
  const call = x.closing ?? b.closing.find((c) => c.emphasis)?.text;
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}
      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} compact />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-display font-display-weight text-[56px] leading-[1.1] text-primary">{b.title.main} <span className="font-ornate font-normal text-gold">{b.yearMr}</span></p>
        <p className="rounded-full bg-deep px-7 py-0.5 font-ornate text-[26px] text-band-text">
          {[b.title.sub, x.label].filter(Boolean).join(' · ')}
        </p>
      </div>
      <div className="w-full flex items-center gap-7">
        {x.speaker.photo && (
          <img src={x.speaker.photo} alt={x.speaker.name}
            className="flex-none w-[240px] h-[300px] rounded-[14px] border-[5px] border-double border-gold object-cover" />
        )}
        <div className="flex-1 flex flex-col gap-2">
          <p className="font-bold text-[42px] leading-[1.15] text-primary">{x.speaker.name}</p>
          {x.speaker.role && <p className="text-[21px] text-ink-soft">{x.speaker.role}</p>}
          <span className="mt-2 font-ornate text-[22px] text-gold">विषय</span>
          <p className="text-balance font-ornate text-[38px] leading-[1.25] text-deep">“{x.topic}”</p>
        </div>
      </div>
      <WhenWhere days={[x]} venue={b.venue} compact />
      {call && <p className="text-balance text-center font-ornate text-[28px] leading-[1.4] text-primary">{call}</p>}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
