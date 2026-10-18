// Celebration (e.g. मराठी भाषा गौरव दिन) — 1080×1920 WhatsApp card, also works as an Instagram story.
// A letter strip on top (theme), centred logo, calligraphic title over a faint ornament with a line
// under it, an optional quote, the purpose (beside an optional portrait), date/time and venue as two
// coloured cards, what the programme will be in a ribboned card, the request to attend and a sign-off.
import type { TemplateProps } from '../types';
import Frame from '../../blocks/Frame';
import LetterStrip from '../../blocks/LetterStrip';
import Organisers from '../../blocks/Organisers';
import TitleBlock from '../../blocks/TitleBlock';
import Quote from '../../blocks/Quote';
import Portrait from '../../blocks/Portrait';
import DetailsCards from '../../blocks/DetailsCards';
import ProgrammeCard from '../../blocks/ProgrammeCard';
import Contacts from '../../blocks/Contacts';
import Signoff from '../../blocks/Signoff';
import DecorRow from '../../blocks/DecorRow';

export default function CelebrationWhatsapp({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  const logo = b.logos.left ?? b.logos.right;
  return (
    <Frame format={format} pattern={decor.pattern}>
      {b.theme.strip && <LetterStrip letters={b.theme.strip} />}
      <header className="flex items-center gap-4">
        {logo && <img src={logo.src} alt={logo.caption} className="size-[96px] object-contain" />}
        <div className="flex flex-col">
          <p className="text-balance font-ornate text-[36px] text-deep">{b.invite}</p>
          {b.tagline && <p className="text-[23px] text-ink-soft">{b.tagline}</p>}
        </div>
      </header>
      {b.organisers.length > 0 && <Organisers names={b.organisers} suffix={b.organisersSuffix} />}

      <div className="w-full flex flex-col items-center gap-1">
        <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} />
        {b.title.sub && <p className="rounded-full border-2 border-gold px-8 py-1 font-ornate text-[34px] text-deep">{b.title.sub}</p>}
      </div>

      {b.quote && <Quote text={b.quote.text} by={b.quote.by} />}

      {b.portrait ? (
        <div className="w-full flex items-center gap-8">
          <Portrait {...b.portrait} />
          {b.intro && <p className="flex-1 text-[27px] leading-[1.6]">{b.intro}</p>}
        </div>
      ) : b.intro && <p className="max-w-[900px] text-center text-[27px] leading-[1.6]">{b.intro}</p>}

      <DetailsCards days={b.days} venue={b.venue} />
      {b.note && <ProgrammeCard label={b.note.label} text={b.note.text} />}

      {b.closing.map((c, i) => (
        <p key={i} className={c.emphasis
          ? 'flex items-center gap-5 text-balance text-center font-ornate text-[33px] leading-[1.45] text-deep before:size-3 before:flex-none before:rotate-45 before:bg-gold after:size-3 after:flex-none after:rotate-45 after:bg-gold'
          : 'max-w-[900px] text-center text-[26px]'}>{c.text}</p>
      ))}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} intro={b.contactsIntro} contacts={b.contacts} />}
      {b.footer && <Signoff text={b.footer} />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} />}
    </Frame>
  );
}
