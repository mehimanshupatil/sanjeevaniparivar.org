// Style "pass": the invitation as an entry pass on a deep background — the ticket holds the
// logo, title, year, intro (beside a portrait) and details; below a perforated line with
// notches, the tear-off stub holds दिनांक / वेळ / स्थळ. The call and contacts sit outside.
import { Fragment } from 'react';
import type { TemplateProps } from '../templates/types';
import { decorUrl } from '../assets';
import { cx } from '../cx';
import Portrait from '../blocks/Portrait';
import Details, { isHeavy } from './Details';

export default function Pass({ edition: b, format }: TemplateProps) {
  const compact = format.height < 1500;
  const heavy = isHeavy(b);
  const logo = b.logos.left ?? b.logos.right;
  const { decor } = b.theme;
  const times = [...new Set(b.days.map((d) => d.time))];
  const call = b.closing.filter((c) => c.emphasis);
  const s = compact
    ? { pad: 'px-[44px] py-[36px]', inner: 'px-[40px]', title: 'text-[96px]', label: 'text-[20px]', fact: 'text-[22px]', venue: 'text-[24px]' }
    : { pad: 'px-[50px] py-[48px]', inner: 'px-[52px]', title: 'text-[124px]', label: 'text-[24px]', fact: 'text-[26px]', venue: 'text-[28px]' };
  return (
    <main id="frame" className="overflow-hidden bg-deep font-body text-ink" style={{ width: format.width, height: format.height }}>
      <div id="content" data-fill className={cx(s.pad, 'h-full flex flex-col items-center justify-between gap-4')}>
        <p className={cx('text-balance text-center font-ornate text-band-accent', compact ? 'text-[28px]' : 'text-[34px]')}>{b.invite}</p>

        {/* The ticket is only as tall as its contents; the deep background shows around it */}
        <article className="relative w-full flex-none overflow-hidden rounded-[36px] bg-ground">
          {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full px-8 pt-4" />}
          <div className={cx(s.inner, 'flex flex-col items-center text-center', compact ? 'gap-3 pt-5 pb-6' : 'gap-4 pt-7 pb-8')}>
            {logo && <img src={logo.src} alt={logo.caption} className={compact ? 'size-[80px] object-contain' : 'size-[104px] object-contain'} />}
            {b.title.top && <span className={cx('font-ornate text-deep', compact ? 'text-[30px]' : 'text-[38px]')}>{b.title.top}</span>}
            <h1 className="w-full font-normal">
              <span data-fit className={cx(s.title, 'inline-block whitespace-nowrap font-display font-display-weight leading-[1.05] text-primary')}>{b.title.main}</span>
            </h1>
            <span className={cx('rounded-full bg-primary px-8 py-1 font-ornate text-band-text', compact ? 'text-[28px]' : 'text-[36px]')}>
              {b.yearMr}{b.title.sub ? ` · ${b.title.sub}` : ''}
            </span>
            {b.portrait ? (
              <div className="w-full flex items-center gap-5 text-left">
                <Portrait {...b.portrait} compact />
                {!compact && b.intro && <p className="flex-1 text-[22px] leading-[1.5] text-ink-soft">{b.intro}</p>}
              </div>
            ) : !compact && b.intro && !heavy && <p className="text-[22px] leading-[1.5] text-ink-soft">{b.intro}</p>}
            <Details edition={b} compact={compact} />
          </div>

          {/* perforation: a dashed rule with a notch cut out on each side */}
          <div className="relative h-0 border-t-4 border-dashed border-deep/40">
            <span className="absolute -left-8 -top-8 size-16 rounded-full bg-deep" />
            <span className="absolute -right-8 -top-8 size-16 rounded-full bg-deep" />
          </div>

          <div className={cx(s.inner, 'grid gap-6', b.sessions.length ? 'grid-cols-[1fr_1.6fr]' : 'grid-cols-[1fr_1fr_1.3fr]', compact ? 'py-5' : 'py-7')}>
            {/* lectures: the rows above carry the dates */}
            {!b.sessions.length && <div className="flex flex-col">
              <span className={cx(s.label, 'font-ornate text-gold')}>दिनांक</span>
              {b.days.map((d, i) => (
                <span key={i} className={cx(s.fact, 'font-bold leading-[1.25] text-deep')}>{d.parts.day} {d.parts.month}
                  <span className="block text-[0.8em] font-normal text-ink-soft">{d.parts.weekday}</span></span>
              ))}
            </div>}
            <div className="flex flex-col">
              <span className={cx(s.label, 'font-ornate text-gold')}>वेळ</span>
              {times.map((t, i) => <span key={i} className={cx(s.fact, 'font-bold leading-[1.3] text-deep')}>{t}</span>)}
            </div>
            <div className="flex flex-col">
              <span className={cx(s.label, 'font-ornate text-gold')}>स्थळ</span>
              <span className={cx(s.venue, 'font-ornate leading-[1.3] text-primary')}>{b.venue.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>)}</span>
            </div>
          </div>
        </article>

        {call.map((c, i) => <p key={i} className={cx('text-balance text-center font-ornate leading-[1.35] text-band-text', compact ? 'text-[26px]' : 'text-[32px]')}>{c.text}</p>)}
        <div className="flex flex-col items-center gap-1 text-band-soft">
          {b.contacts.length > 0 && (
            <span className={cx('text-center', compact ? 'text-[18px]' : 'text-[21px]')}>
              {b.contacts.slice(0, compact ? 3 : 6).map((c) => `${c.name} ${c.phoneMr}`).join('  ·  ')}
            </span>
          )}
          <span className={cx('font-ornate text-band-accent', compact ? 'text-[26px]' : 'text-[30px]')}>{(b.footer ?? '').replace(/\n/g, ' ')}</span>
        </div>
      </div>
    </main>
  );
}
