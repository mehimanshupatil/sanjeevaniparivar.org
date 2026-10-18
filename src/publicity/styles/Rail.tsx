// Style "rail": a full-height coloured column on the left carries the facts — logo, each
// date with a big number, time, venue, contacts; the right is left-aligned like a modern
// flyer: invite, title, year rule, intro (beside a portrait), details and the call.
import { Fragment } from 'react';
import type { TemplateProps } from '../templates/types';
import { decorUrl } from '../assets';
import { cx } from '../cx';
import Portrait from '../blocks/Portrait';
import Details, { isHeavy } from './Details';

export default function Rail({ edition: b, format }: TemplateProps) {
  const compact = format.height < 1500;
  const heavy = isHeavy(b);
  const logo = b.logos.left ?? b.logos.right;
  const { decor } = b.theme;
  const call = b.closing.filter((c) => c.emphasis);
  const many = b.days.length > 2;
  const s = compact
    ? { rail: 'w-[300px] px-[30px] py-[40px]', day: many ? 'text-[64px]' : 'text-[96px]', label: 'text-[22px]', text: 'text-[20px]', venue: 'text-[26px]', main: 'px-[44px] py-[44px]', title: 'text-[110px]', year: 'text-[52px]' }
    : { rail: 'w-[340px] px-[40px] py-[52px]', day: many ? 'text-[84px]' : 'text-[120px]', label: 'text-[26px]', text: 'text-[22px]', venue: 'text-[32px]', main: 'px-[56px] py-[56px]', title: 'text-[150px]', year: 'text-[64px]' };
  return (
    <main id="frame" className="overflow-hidden bg-ground font-body text-ink" style={{ width: format.width, height: format.height }}>
      <div id="content" className="h-full flex">
        <aside className={cx(s.rail, 'flex-none flex flex-col justify-between bg-deep text-band-text')}>
          <div className={cx('flex flex-col', compact ? 'gap-6' : 'gap-9')}>
            {logo && <span className={cx('grid place-items-center rounded-[20px] bg-white', compact ? 'size-[100px]' : 'size-[130px]')}><img src={logo.src} alt={logo.caption} className="size-[77%] object-contain" /></span>}
            <div className={cx('flex flex-col', many ? 'gap-3' : 'gap-5')}>
              <span className={cx(s.label, 'font-ornate text-band-accent')}>दिनांक</span>
              {b.days.map((d, i) => (
                <div key={i} className="flex flex-col">
                  <span className={cx(s.text, 'text-band-soft')}>{d.parts.weekday}</span>
                  <span className={cx(s.day, 'font-ornate leading-[0.95]')}>{d.parts.day}</span>
                  <span className={cx(s.text, 'font-bold')}>{d.parts.month} {d.parts.year}</span>
                  <span className={cx(s.text, 'text-band-soft')}>{d.time}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 border-t border-band-accent/40 pt-5">
              <span className={cx(s.label, 'font-ornate text-band-accent')}>स्थळ</span>
              <span className={cx(s.venue, 'font-ornate leading-[1.3]')}>{b.venue.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>)}</span>
            </div>
          </div>
          {b.contacts.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-band-accent/40 pt-5">
              <span className={cx(s.label, 'font-ornate text-band-accent')}>{b.contactsHeading ?? 'संपर्क'}</span>
              {b.contacts.slice(0, compact ? 3 : 6).map((c, i) => (
                <span key={i} className={cx(s.text, 'leading-[1.25]')}>{c.name}<br /><b>{c.phoneMr}</b></span>
              ))}
            </div>
          )}
        </aside>

        <section className={cx(s.main, 'min-w-0 flex-1 flex flex-col justify-between gap-5 bg-[length:96px_96px]')}
          style={{ backgroundImage: decor.pattern ? `url("${decorUrl(decor.pattern)}")` : undefined }}>
          <p className={cx('text-balance font-ornate text-primary', compact ? 'text-[26px]' : 'text-[32px]')}>{b.invite}</p>
          <div className="flex flex-col">
            {b.title.top && <span className={cx('font-ornate text-deep', compact ? 'text-[32px]' : 'text-[42px]')}>{b.title.top}</span>}
            <h1 className="w-full font-normal">
              <span data-fit className={cx(s.title, 'inline-block whitespace-nowrap font-display font-display-weight leading-[1.02] text-primary')}>{b.title.main}</span>
            </h1>
            <span className={cx(s.year, 'flex items-center gap-5 font-ornate leading-none text-gold after:h-0.5 after:flex-1 after:bg-gold')}>{b.yearMr}</span>
            {b.title.sub && <span className={cx('mt-3 font-ornate text-deep', compact ? 'text-[26px]' : 'text-[32px]')}>{b.title.sub}</span>}
          </div>
          {b.portrait ? (
            <div className="flex items-center gap-5">
              <Portrait {...b.portrait} compact />
              {!compact && b.intro && <p className="flex-1 text-[22px] leading-[1.5]">{b.intro}</p>}
            </div>
          ) : !compact && b.intro && !heavy && <p className="text-[24px] leading-[1.55]">{b.intro}</p>}
          <Details edition={b} compact={compact} narrow />
          {call.map((c, i) => (
            <p key={i} className={cx('border-l-[8px] border-primary pl-5 text-balance font-ornate leading-[1.35] text-deep', compact ? 'text-[26px]' : 'text-[32px]')}>{c.text}</p>
          ))}
          <div className="flex items-end justify-between">
            <span className={cx('font-ornate text-primary', compact ? 'text-[26px]' : 'text-[30px]')}>{(b.footer ?? '').replace(/\n/g, ' ')}</span>
            {decor.titleSides && <img src={decorUrl(decor.titleSides)} alt="" className={compact ? 'h-[130px] w-[52px]' : 'h-[180px] w-[72px]'} />}
          </div>
        </section>
      </div>
    </main>
  );
}
