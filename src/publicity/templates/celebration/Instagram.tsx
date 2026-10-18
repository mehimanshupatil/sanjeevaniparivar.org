// Celebration — 1080×1350 (4:5) Instagram feed post. Compact sizes; the intro, quote and the
// programme note are left out (they belong in the post caption).
import type { TemplateProps } from '../types';
import Frame from '../../blocks/Frame';
import LetterStrip from '../../blocks/LetterStrip';
import TitleBlock from '../../blocks/TitleBlock';
import Portrait from '../../blocks/Portrait';
import DetailsCards from '../../blocks/DetailsCards';
import Signoff from '../../blocks/Signoff';
import DecorRow from '../../blocks/DecorRow';

export default function CelebrationInstagram({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  const logo = b.logos.left ?? b.logos.right;
  const call = b.closing.filter((c) => c.emphasis);
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      {b.theme.strip && <LetterStrip letters={b.theme.strip} compact />}
      <header className="flex items-center gap-3">
        {logo && <img src={logo.src} alt={logo.caption} className="size-[72px] object-contain" />}
        <p className="text-balance font-ornate text-[30px] text-deep">{b.invite}</p>
      </header>
      <div className="w-full flex flex-col items-center gap-1">
        <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
        {b.title.sub && <p className="rounded-full border-2 border-gold px-6 py-0.5 font-ornate text-[28px] text-deep">{b.title.sub}</p>}
      </div>
      {b.portrait ? (
        <div className="w-full flex items-center gap-6">
          <Portrait {...b.portrait} compact />
          <div className="flex-1"><DetailsCards days={b.days} venue={b.venue} compact stacked /></div>
        </div>
      ) : <DetailsCards days={b.days} venue={b.venue} compact />}
      {call.map((c, i) => (
        <p key={i} className="flex items-center gap-4 text-balance text-center font-ornate text-[28px] leading-[1.4] text-deep before:size-2.5 before:flex-none before:rotate-45 before:bg-gold after:size-2.5 after:flex-none after:rotate-45 after:bg-gold">{c.text}</p>
      ))}
      {b.footer && <Signoff text={b.footer} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
