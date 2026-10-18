// Style "poster": the top is one solid colour block with a huge title and a big faint motif
// (or the portrait); below it a giant date, the venue, then the details and the call.
// No border, no ornament rows. One component for both formats; Instagram is compact.
import type { TemplateProps } from '../templates/types';
import { decorUrl } from '../assets';
import { cx } from '../cx';
import Portrait from '../blocks/Portrait';
import Contacts from '../blocks/Contacts';
import Details, { isHeavy, venueInline } from './Details';

export default function Poster({ edition: b, format }: TemplateProps) {
  const compact = format.height < 1500;
  const heavy = isHeavy(b);
  const logo = b.logos.left ?? b.logos.right;
  const one = b.days.length === 1 ? b.days[0] : undefined;
  const call = b.closing.filter((c) => c.emphasis);
  const plain = compact ? [] : b.closing.filter((c) => !c.emphasis);
  const s = compact
    ? { block: heavy ? 'h-[400px]' : 'h-[560px]', pad: 'px-[56px]', title: 'text-[130px]', year: 'text-[60px]', day: 'text-[150px]', month: 'text-[34px]', sub: 'text-[26px]', venue: 'text-[34px]' }
    : { block: heavy ? 'h-[620px]' : 'h-[820px]', pad: 'px-[70px]', title: 'text-[180px]', year: 'text-[80px]', day: 'text-[210px]', month: 'text-[44px]', sub: 'text-[32px]', venue: 'text-[44px]' };
  return (
    <main id="frame" className="overflow-hidden bg-ground font-body text-ink" style={{ width: format.width, height: format.height }}>
      <div id="content" className="h-full flex flex-col">
        <section className={cx(s.block, s.pad, 'relative flex-none flex flex-col justify-between overflow-hidden bg-deep py-[48px] text-band-text')}>
          {b.portrait
            ? <div className="absolute right-[40px] bottom-[20px]"><Portrait {...b.portrait} compact /></div>
            : b.theme.decor.titleSides && <img src={decorUrl(b.theme.decor.titleSides)} alt="" className="absolute -right-4 bottom-0 h-[85%] w-[34%] object-contain object-bottom opacity-25" />}
          <header className="relative flex items-center gap-5">
            {logo && <span className={cx('grid flex-none place-items-center rounded-full bg-white', compact ? 'size-[84px]' : 'size-[104px]')}><img src={logo.src} alt={logo.caption} className="size-[76%] object-contain" /></span>}
            <p className={cx('text-balance font-ornate text-band-accent', compact ? 'text-[28px]' : 'text-[34px]')}>{b.invite}</p>
          </header>
          <div className={cx('relative flex flex-col', b.portrait && 'pr-[230px]')}>
            {b.title.top && <span className={cx('font-ornate text-band-soft', compact ? 'text-[34px]' : 'text-[44px]')}>{b.title.top}</span>}
            <h1 className="w-full font-normal">
              <span data-fit className={cx(s.title, 'inline-block whitespace-nowrap font-display font-display-weight leading-[1.02] text-white')}>{b.title.main}</span>
            </h1>
            <div className="mt-2 flex items-baseline gap-6">
              <span className={cx(s.year, 'font-ornate leading-none text-band-accent')}>{b.yearMr}</span>
              {b.title.sub && <span className={cx(s.sub, 'font-ornate text-band-soft')}>{b.title.sub}</span>}
            </div>
          </div>
        </section>

        <section className={cx(s.pad, 'flex-none flex items-center gap-10 border-b-4 border-primary py-[28px]')}>
          {one ? <>
            <span className={cx(s.day, 'font-ornate leading-[0.9] text-primary')}>{one.parts.day}</span>
            <div className="flex flex-col gap-1">
              <span className={cx(s.month, 'font-bold leading-[1.15] text-deep')}>{one.parts.month} {one.parts.year}</span>
              <span className={cx(s.sub, 'text-ink-soft')}>{one.parts.weekday} · {one.time}</span>
            </div>
          </> : b.sessions.length > 0 ? (
            // the lecture rows below carry the dates; show only the time here
            <span className={cx(s.month, 'font-bold text-deep')}>{[...new Set(b.days.map((d) => d.time))].join(' / ')}</span>
          ) : (
            <div className="flex flex-col gap-1">
              {b.days.map((d, i) => <span key={i} className={cx(s.sub, 'font-bold leading-[1.3] text-deep')}>{d.date} <span className="font-normal text-ink-soft">· {d.time}</span></span>)}
            </div>
          )}
        </section>

        <section className={cx(s.pad, 'flex-1 flex flex-col justify-evenly gap-4 py-[24px]')}>
          <p className={cx(s.venue, 'font-ornate leading-[1.25] text-primary')}>
            <span className="text-gold">स्थळ : </span>{venueInline(b.venue)}
          </p>
          {!compact && !heavy && b.intro && <p className="text-[24px] leading-[1.5] text-ink-soft">{b.intro}</p>}
          <Details edition={b} compact={compact} />
          {plain.map((c, i) => <p key={i} className="text-[23px] leading-[1.45]">{c.text}</p>)}
          {call.map((c, i) => <p key={i} className={cx('text-balance font-bold leading-[1.3] text-deep', compact ? 'text-[28px]' : 'text-[34px]')}>{c.text}</p>)}
          {!compact && b.contacts.length > 0 && <Contacts heading={b.contactsHeading} intro={b.contactsIntro} contacts={b.contacts} compact />}
        </section>

        <footer className={cx(s.pad, 'flex-none flex items-center justify-between gap-6 bg-primary py-[22px] text-band-text')}>
          <span className={cx('font-ornate', compact ? 'text-[26px]' : 'text-[32px]')}>{(b.footer ?? '॥ संजीवनी परिवार ॥').replace(/\n/g, ' ')}</span>
          {compact && b.contacts.length > 0 && <span className="text-[20px]">{b.contacts.slice(0, 2).map((c) => `${c.name} ${c.phoneMr}`).join(' · ')}</span>}
        </footer>
      </div>
    </main>
  );
}
