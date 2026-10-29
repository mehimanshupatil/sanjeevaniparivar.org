// Lectures — 1200×628 (1.91:1) wide card for one lecture, e.g. the image header of the WhatsApp API
// message sent before each पुष्प: photo, series and पुष्प, speaker and topic; date, time and venue
// on the right. The speaker's परिचय goes in the message text.
import type { SessionProps } from '../types';
import Frame from '../../blocks/Frame';
import { WhenWherePanel } from './Wide';

export default function SessionWide({ edition: b, session: x, format }: SessionProps) {
  return (
    <Frame format={format} pattern={b.theme.decor.pattern} compact>
      <div className="w-full flex-1 flex items-center gap-6 pt-5">
        {x.speaker.photo && (
          <img src={x.speaker.photo} alt={x.speaker.name}
            className="flex-none w-[190px] h-[238px] rounded-[14px] border-[5px] border-double border-gold object-cover" />
        )}
        <div className="min-w-0 flex-1 flex flex-col items-start gap-2">
          <p className="w-full"><span data-fit className="inline-block whitespace-nowrap font-display font-display-weight text-[44px] leading-[1.1] text-primary">{b.title.main} <span className="font-ornate font-normal text-gold">{b.yearMr}</span></span></p>
          <p className="rounded-full bg-deep px-6 py-0.5 font-ornate text-[22px] text-band-text">
            {[b.title.sub, x.label].filter(Boolean).join(' · ')}
          </p>
          <p className="font-bold text-[36px] leading-[1.15] text-primary">{x.speaker.name}</p>
          {x.speaker.role && <p className="text-[18px] leading-[1.3] text-ink-soft">{x.speaker.role}</p>}
          <p className="text-balance font-ornate text-[30px] leading-[1.25] text-deep"><span className="text-gold">विषय : </span>“{x.topic}”</p>
        </div>
        <WhenWherePanel days={[x]} venue={b.venue} narrow />
      </div>
    </Frame>
  );
}
