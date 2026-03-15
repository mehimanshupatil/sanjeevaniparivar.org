/**
 * KshetraSection — single component for all 4 kshetra detail sections.
 * Replaces ShikshanSection, ParyavaranSection, AarogyaSection, PrabodhanaSection.
 */
import { useT } from './LangContext';

interface Activity {
  title: { mr: string; en: string };
  desc:  { mr: string; en: string };
}

export interface KshetraSectionProps {
  id: string;
  number: string;
  label:    { mr: string; en: string };
  heading:  { mr: string; en: string };
  body:     { mr: string; en: string };
  activities: Activity[];
  emojis: string[];
  /** Tailwind colour token used for dot + label badge */
  colorToken: 'education' | 'environment' | 'health' | 'enlightenment';
  /** Tailwind bg gradient classes for the visual panel */
  visualBg: string;
  /** Optional extra content rendered below the activity list */
  extra?: React.ReactNode;
  /** When true: visual panel is on the LEFT, content on the RIGHT (default visual-right) */
  visualLeft?: boolean;
  /** Stat block shown in visual panel */
  stat?: { value: string; label: { mr: string; en: string } };
  bgLight?: boolean;
}

const dotColour: Record<KshetraSectionProps['colorToken'], string> = {
  education:     'bg-education',
  environment:   'bg-environment',
  health:        'bg-health',
  enlightenment: 'bg-enlightenment',
};

const labelColour: Record<KshetraSectionProps['colorToken'], string> = {
  education:     'bg-blue-100   text-education',
  environment:   'bg-green-100  text-environment',
  health:        'bg-red-100    text-health',
  enlightenment: 'bg-purple-100 text-enlightenment',
};

const badgeBg: Record<KshetraSectionProps['colorToken'], string> = {
  education:     'bg-blue-200',
  environment:   'bg-green-200',
  health:        'bg-red-200',
  enlightenment: 'bg-purple-200',
};

export default function KshetraSection({
  id, number, label, heading, body, activities, emojis,
  colorToken, visualBg, extra, visualLeft = false, stat, bgLight = false,
}: KshetraSectionProps) {
  const t = useT();

  const visual = (
    <div className={`${visualBg} rounded-3xl p-10`}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {emojis.map((e, i) => (
          <div key={i} className="h-16 flex items-center justify-center bg-white/70 rounded-xl text-2xl shadow-sm">
            {e}
          </div>
        ))}
      </div>
      {stat && (
        <div className="bg-white/80 rounded-2xl p-6 text-center shadow-sm">
          <span className={`block text-5xl font-black leading-none mb-2 text-${colorToken}`}>
            {stat.value}
          </span>
          <span className="text-sm text-gray-500 font-medium">{t(stat.label)}</span>
        </div>
      )}
    </div>
  );

  const content = (
    <div>
      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4 ${labelColour[colorToken]}`}>
        <span className={`${badgeBg[colorToken]} px-1.5 rounded text-xs`}>{number}</span>
        {t(label)}
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t(heading)}</h2>
      <p className="text-gray-500 leading-relaxed mb-8">{t(body)}</p>

      <ul className="space-y-4">
        {activities.map((a, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotColour[colorToken]}`} />
            <div>
              <strong className="block text-sm font-bold text-gray-900">{t(a.title)}</strong>
              <span className="text-xs text-gray-500">{t(a.desc)}</span>
            </div>
          </li>
        ))}
      </ul>

      {extra}
    </div>
  );

  return (
    <section id={id} className={`py-20 ${bgLight ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {visualLeft ? (
            <>
              <div className="order-2 lg:order-1">{visual}</div>
              <div className="order-1 lg:order-2">{content}</div>
            </>
          ) : (
            <>
              {content}
              {visual}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
