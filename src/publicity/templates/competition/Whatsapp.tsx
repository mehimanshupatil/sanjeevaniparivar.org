// Competition (e.g. वक्तृत्व स्पर्धा) — 1080×1920 WhatsApp card, also works as an Instagram story.
// Logo + invite, title between trophies with the (school) year, intro, date band, a card per
// group with its topics, the rules, a note for parents, registration contacts and a sign-off.
import type { TemplateProps } from '../types';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import TitleBlock from '../../blocks/TitleBlock';
import WhenWhere from '../../blocks/WhenWhere';
import GroupCards from '../../blocks/GroupCards';
import Contacts from '../../blocks/Contacts';
import Signoff from '../../blocks/Signoff';
import DecorRow from '../../blocks/DecorRow';

export default function CompetitionWhatsapp({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  return (
    <Frame format={format} pattern={decor.pattern}>
      <div className="w-full mt-8">
        <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} tagline={b.tagline} compact />
      </div>
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
      {b.intro && <p className="max-w-[940px] text-center text-[21px] leading-[1.5]">{b.intro}</p>}

      <WhenWhere days={b.days} venue={b.venue} compact />
      {b.groups.length > 0 && <GroupCards heading={b.groupsHeading} groups={b.groups} palette={b.theme.palette} />}

      {b.rules.length > 0 && (
        <section className="w-full rounded-[10px] border-2 border-dashed border-gold px-6 py-3 text-center text-[22px] leading-[1.45]">
          {b.rulesHeading && <strong className="font-bold text-deep">{b.rulesHeading} : </strong>}
          {b.rules.join(' ')}
        </section>
      )}
      {b.note && (
        <p className="w-full rounded-[10px] bg-deep px-6 py-3.5 text-center text-[22px] leading-[1.45] text-band-text">
          <strong className="font-bold text-band-accent">{b.note.label} : </strong>{b.note.text}
        </p>
      )}
      {b.contacts.length > 0 && <Contacts heading={b.contactsHeading} intro={b.contactsIntro} contacts={b.contacts} compact />}
      {b.footer && <Signoff text={b.footer} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
