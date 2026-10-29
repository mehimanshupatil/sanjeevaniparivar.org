// Every type — 1200×628 (1.91:1) wide card: the image header of a WhatsApp API template message,
// a Facebook event cover, a link preview. Shown small in a chat bubble, so only what reads at a
// glance: logos and invitation, title and year on the left; date, time and venue on the right;
// the call along the bottom. The details (attractions, rules, lectures) go in the message text.
import { Fragment } from 'react';
import type { TemplateProps } from '../types';
import type { Logo } from '../../logos';
import { cx } from '../../cx';
import Frame from '../../blocks/Frame';

export default function Wide({ edition: b, format }: TemplateProps) {
  const call = b.closing.find((c) => c.emphasis)?.text ?? b.footer?.replace(/\n/g, ' ');
  return (
    <Frame format={format} pattern={b.theme.decor.pattern} compact>
      <div className="w-full flex-1 flex items-center gap-8 pt-5">
        <div className="min-w-0 flex-1 flex flex-col items-center gap-2 text-center">
          <WideHeader left={b.logos.left} right={b.logos.right} invite={b.invite} />
          <h1 className="w-full flex flex-col items-center font-normal">
            {b.title.top && <span data-fit className="whitespace-nowrap font-display font-display-weight text-[46px] leading-[1.1] text-deep">{b.title.top}</span>}
            <span data-fit className="whitespace-nowrap font-display font-display-weight text-[104px] leading-[1.05] text-primary">{b.title.main}</span>
          </h1>
          <p className="flex items-baseline gap-4">
            <span className="font-ornate text-[40px] leading-none text-gold">{b.yearMr}</span>
            {b.title.sub && <span className="font-ornate text-[26px] text-deep">{b.title.sub}</span>}
          </p>
          {b.organisers.length > 0 && <p className="text-balance text-[17px] leading-[1.35] text-ink-soft">{b.organisers.join(' · ')}</p>}
        </div>
        <WhenWherePanel days={b.days} venue={b.venue} />
      </div>
      {call && <p className="mt-3 text-balance text-center font-ornate text-[24px] leading-[1.3] text-primary">{call}</p>}
    </Frame>
  );
}

/** Logos either side of the invitation line, small enough for a wide card */
export function WideHeader({ left, right, invite }: { left?: Logo; right?: Logo; invite: string }) {
  const logo = (l: Logo) => <img src={l.src} alt={l.caption} className="size-[64px] flex-none object-contain" />;
  return (
    <header className="w-full flex items-center justify-center gap-4">
      {left && logo(left)}
      <p className="text-balance font-ornate text-[26px] leading-[1.25] text-primary">{invite}</p>
      {right && logo(right)}
    </header>
  );
}

/** The facts on a coloured panel: each date with its time, then the venue */
export function WhenWherePanel({ days, venue, narrow = false }: { days: { date: string; time: string }[]; venue: string[]; narrow?: boolean }) {
  return (
    <section className={cx(narrow ? 'w-[330px]' : 'w-[400px]', 'flex-none flex flex-col gap-4 self-stretch justify-center rounded-[6px] bg-deep px-7 py-6 text-band-text')}>
      <div className="flex flex-col gap-2">
        <span className="font-ornate text-[22px] text-band-accent">दिनांक</span>
        {days.map((d, i) => (
          <p key={i} className="flex flex-col">
            <span className={cx('font-bold leading-[1.25]', days.length > 1 ? 'text-[22px]' : 'text-[28px]')}>{d.date}</span>
            <span className="text-[19px] text-band-soft">{d.time}</span>
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-1 border-t border-band-accent/45 pt-3">
        <span className="font-ornate text-[22px] text-band-accent">स्थळ</span>
        <p className="font-display font-display-weight text-[28px] leading-[1.2]">
          {venue.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}
        </p>
      </div>
    </section>
  );
}
