// Celebration — 1080×1350 (4:5) Instagram feed post. Compact sizes; the intro and the
// programme note are left out (they belong in the post caption).
import type { TemplateProps } from '../types';
import Frame from '../../blocks/Frame';
import TitleBlock from '../../blocks/TitleBlock';
import DetailsScroll from '../../blocks/DetailsScroll';
import Signoff from '../../blocks/Signoff';
import DecorRow from '../../blocks/DecorRow';

export default function CelebrationInstagram({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  const logo = b.logos.left ?? b.logos.right;
  const call = b.closing.filter((c) => c.emphasis);
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      <header className="mt-5 flex flex-col items-center gap-1.5">
        {logo && <img src={logo.src} alt={logo.caption} className="size-[88px] object-contain" />}
        <p className="text-balance font-ornate text-[28px] text-deep">{b.invite}</p>
      </header>
      <div className="w-full flex flex-col items-center gap-1">
        <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
        {b.title.sub && <p className="font-ornate text-[30px] text-deep">{b.title.sub}</p>}
      </div>
      <DetailsScroll days={b.days} venue={b.venue} compact />
      {call.map((c, i) => (
        <p key={i} className="text-balance max-w-[900px] text-center font-ornate text-[27px] leading-[1.4] text-deep">{c.text}</p>
      ))}
      {b.footer && <Signoff text={b.footer} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
