// Celebration (e.g. मराठी भाषा गौरव दिन) — 1080×1920 WhatsApp card, also works as an Instagram story.
// Patrika style: centred logo, calligraphic title with a line under it, the purpose, दिनांक / वेळ /
// स्थळ as centred lines (beside an optional portrait), what the programme will be (note), the request to attend and a letter sign-off.
import type { TemplateProps } from '../types';
import Frame from '../../blocks/Frame';
import Organisers from '../../blocks/Organisers';
import TitleBlock from '../../blocks/TitleBlock';
import DetailsScroll from '../../blocks/DetailsScroll';
import Portrait from '../../blocks/Portrait';
import Contacts from '../../blocks/Contacts';
import Signoff from '../../blocks/Signoff';
import DecorRow from '../../blocks/DecorRow';

export default function CelebrationWhatsapp({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  const logo = b.logos.left ?? b.logos.right;
  return (
    <Frame format={format} pattern={decor.pattern}>
      <header className="mt-8 flex flex-col items-center gap-2">
        {logo && <img src={logo.src} alt={logo.caption} className="size-[112px] object-contain" />}
        <p className="text-balance font-ornate text-[34px] text-deep">{b.invite}</p>
        {b.tagline && <p className="text-[23px] text-ink-soft">{b.tagline}</p>}
      </header>
      {b.organisers.length > 0 && <Organisers names={b.organisers} suffix={b.organisersSuffix} />}

      <div className="w-full flex flex-col items-center gap-2">
        <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} />
        {b.title.sub && <p className="font-ornate text-[36px] text-deep">{b.title.sub}</p>}
      </div>

      {b.portrait ? (
        <div className="w-full flex items-center gap-8">
          <Portrait {...b.portrait} />
          {b.intro && <p className="flex-1 text-[27px] leading-[1.6]">{b.intro}</p>}
        </div>
      ) : b.intro && <p className="max-w-[900px] text-center text-[27px] leading-[1.6]">{b.intro}</p>}

      <DetailsScroll days={b.days} venue={b.venue} />

      {b.note && (
        <section className="max-w-[920px] flex flex-col items-center gap-2 text-center">
          <h2 className="font-ornate text-[32px] text-primary">॥ {b.note.label} ॥</h2>
          <p className="text-[27px] leading-[1.55]">{b.note.text}</p>
        </section>
      )}
      {b.closing.map((c, i) => (
        <p key={i} className={c.emphasis ? 'text-balance max-w-[900px] text-center font-ornate text-[33px] leading-[1.45] text-deep' : 'max-w-[900px] text-center text-[26px]'}>{c.text}</p>
      ))}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} intro={b.contactsIntro} contacts={b.contacts} />}
      {b.footer && <Signoff text={b.footer} />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} />}
    </Frame>
  );
}
