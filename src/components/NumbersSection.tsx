// Home page: the trust's work in numbers. Every number is computed from the site's own data
// (src/lib/org.ts, the activities in kshetras.ts, the lecture list), so it never needs typing.
import { useT } from './LangContext';
import { KSHETRAS } from '@/content/kshetras';
import { VYAKHYANE } from '@/content/vyakhyanmala';
import { yearsOfService, vyakhyanmalaEdition, vrikshaYears, mr } from '@/lib/org';

const activities = KSHETRAS.reduce((n, k) => n + k.activities.length, 0);
/** Lectures held since 2003: the highest cumulative lecture number */
const lectures = Math.max(...VYAKHYANE.map((v) => v.lecture_no));

const NUMBERS = [
  { n: yearsOfService, label: { mr: 'वर्षे सेवाकार्य', en: 'years of service' } },
  { n: activities, label: { mr: `उपक्रम, ${mr(KSHETRAS.length)} क्षेत्रांत`, en: `activities in ${KSHETRAS.length} areas` } },
  { n: vyakhyanmalaEdition, label: { mr: 'वर्षे व्याख्यानमाला', en: 'years of the lecture series' } },
  { n: lectures, label: { mr: 'व्याख्याने', en: 'lectures held' } },
  { n: vrikshaYears, label: { mr: 'वर्षे वृक्षवाढदिवस', en: 'years of tree birthdays' } },
];

export default function NumbersSection() {
  const t = useT();
  return (
    <section className="py-14 bg-white" aria-label={t({ mr: 'आमचे कार्य आकड्यांत', en: 'Our work in numbers' })}>
      <dl className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 text-center">
        {NUMBERS.map((x) => (
          <div key={x.label.en} className="flex flex-col-reverse gap-1 last:col-span-2 sm:last:col-span-1">
            <dt className="text-sm text-gray-600">{t(x.label)}</dt>
            <dd className="text-4xl font-black text-primary tabular-nums">{t({ mr: mr(x.n), en: String(x.n) })}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
