// Personal invitation (वैयक्तिक निमंत्रण) — 1080×1350 (4:5), addressed to one guest and sent to them
// in a WhatsApp chat, where a 4:5 image shows whole in the bubble (a 9:16 one is cut off until tapped). The guest's name is
// typed by a member on the edition's page and written into [data-guest] (personal/client.ts).
import { Fragment } from 'react';
import type { ResolvedEdition } from '../edition';
import type { Format } from '../formats';
import { decorUrl } from '../assets';
import Frame from '../blocks/Frame';
import HeaderLogos from '../blocks/HeaderLogos';
import TitleBlock from '../blocks/TitleBlock';
import FooterLine from '../blocks/FooterLine';
import DecorRow from '../blocks/DecorRow';

interface Props {
  edition: ResolvedEdition;
  format: Format;
  /** Shown until a name is typed, and in the sample render */
  guest: string;
}

export default function PersonalCard({ edition: b, format, guest }: Props) {
  const { decor } = b.theme;
  const personal = b.personal!;
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      {decor.top && <img src={decorUrl(decor.top)} alt="" className="w-full" />}

      <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} deity={b.deity} compact />

      <section className="w-full flex flex-col items-center gap-1 text-center">
        <p className="self-start font-ornate text-[24px] text-ink-soft">प्रति,</p>
        {/* data-fit: a long name shrinks to one line (see fit.ts) */}
        <p data-guest data-fit data-fit-reserve={40} className="whitespace-nowrap font-ornate text-[46px] leading-[1.3] text-deep">{guest}</p>
        <div className="flex items-center gap-4">
          <i className="h-0.5 w-[130px] bg-gold"></i>
          <i className="size-2.5 rotate-45 bg-gold"></i>
          <i className="h-0.5 w-[130px] bg-gold"></i>
        </div>
        <p className="mt-1 font-ornate text-[26px] text-primary">सप्रेम नमस्कार!</p>
      </section>

      <p className="max-w-[920px] text-center text-[22px] leading-[1.5]">{personal.request}</p>

      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
      {/* स्थळ and the days as in a letter: "शनिवार, दिनांक ३१ ऑक्टोबर २०२६", वेळ, then "आणि" the next day */}
      <section className="w-full flex flex-col items-center gap-2 rounded-[6px] bg-deep px-8 py-5 text-center text-band-text">
        <p className="text-[26px] leading-[1.3]">
          <span className="font-ornate text-band-accent">स्थळ: </span>
          <span className="font-bold">{b.venue.join(' ')}</span>
        </p>
        <i className="h-px w-[60%] bg-band-accent/45"></i>
        {personal.days.map((d, i) => (
          <Fragment key={i}>
            {i > 0 && <p className="font-ornate text-[20px] text-band-accent">आणि</p>}
            <div>
              <p className="text-[24px] font-bold">{d.date}</p>
              <p className="text-[20px] text-band-soft"><span className="text-band-accent">वेळ: </span>{d.time}</p>
            </div>
          </Fragment>
        ))}
      </section>

      {personal.inauguration && (
        <section className="w-full rounded-[6px] border-2 border-dashed border-gold px-7 py-3 text-center">
          <h2 className="font-ornate text-[26px] font-normal text-primary">उद्घाटन समारंभ</h2>
          <p className="mt-1 text-[22px] font-bold leading-[1.45]">{personal.inauguration}</p>
        </section>
      )}

      <FooterLine text="धन्यवाद!" compact />
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
