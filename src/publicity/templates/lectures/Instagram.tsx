// Lectures — 1080×1350 (4:5) series post. Compact: no ओवी, intro or contacts (post caption).
import type { TemplateProps } from '../types';
import { decorUrl } from '../../assets';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import TitleBlock from '../../blocks/TitleBlock';
import SessionList from '../../blocks/SessionList';
import TimeVenue from '../../blocks/TimeVenue';
import DecorRow from '../../blocks/DecorRow';

export default function LecturesInstagram({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  const times = [...new Set(b.days.map((d) => d.time))];
  const call = b.closing.find((c) => c.emphasis);
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}
      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} compact />
      <div className="w-full flex flex-col items-center gap-1">
        <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
        {b.title.sub && <p className="rounded-full bg-primary px-6 py-0.5 font-ornate text-[24px] text-band-text">{b.title.sub}</p>}
      </div>
      <SessionList sessions={b.sessions} showTime={times.length > 1} compact />
      <TimeVenue time={times.length === 1 ? times[0] : undefined} venue={b.venue} compact />
      {call && <p className="text-balance text-center font-ornate text-[26px] text-primary">{call.text}</p>}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
