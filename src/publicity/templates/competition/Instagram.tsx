// Competition — 1080×1350 (4:5) Instagram post: title, date band and the groups with their
// topics. Intro, rules, the parents' note and contacts go in the post caption.
import type { TemplateProps } from '../types';
import Frame from '../../blocks/Frame';
import HeaderLogos from '../../blocks/HeaderLogos';
import TitleBlock from '../../blocks/TitleBlock';
import WhenWhere from '../../blocks/WhenWhere';
import GroupCards from '../../blocks/GroupCards';
import DecorRow from '../../blocks/DecorRow';

export default function CompetitionInstagram({ edition: b, format }: TemplateProps) {
  const { decor } = b.theme;
  return (
    <Frame format={format} pattern={decor.pattern} compact>
      <div className="w-full mt-8">
        <HeaderLogos left={b.logos.left} right={b.logos.right} invite={b.invite} compact />
      </div>
      <TitleBlock top={b.title.top} main={b.title.main} yearMr={b.yearMr} decor={decor} compact />
      <WhenWhere days={b.days} venue={b.venue} compact />
      {b.groups.length > 0 && <GroupCards groups={b.groups} palette={b.theme.palette} compact />}
      {decor.bottomRow && <DecorRow file={decor.bottomRow} compact />}
    </Frame>
  );
}
