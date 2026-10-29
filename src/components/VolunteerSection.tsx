// Home page: "सहभागी व्हा" — a short volunteer form. Like the contact form it has no backend:
// it opens an email to the trust with the details filled in (mailto).
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useT } from './LangContext';
import SectionHeader from './common/SectionHeader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { KSHETRAS } from '@/content/kshetras';

const TO_EMAIL = 'sanjeevani.parivar@gmail.com';

export default function VolunteerSection() {
  const t = useT();
  const [areas, setAreas] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;
    const chosen = KSHETRAS.filter((k) => areas.has(k.slug)).map((k) => k.label.mr).join(', ');
    const subject = encodeURIComponent(`सहभागी व्हा — ${name}`);
    const body = encodeURIComponent([
      `नाव / Name: ${name}`,
      `गाव / Village: ${data.get('village')}`,
      `संपर्क / Contact: ${data.get('contact')}`,
      `आवडीचे क्षेत्र / Areas: ${chosen || '—'}`,
      '',
      `मी कशी मदत करू शकतो/शकते / How I can help:`,
      data.get('help') as string,
    ].join('\n'));

    const a = document.createElement('a');
    a.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
    a.click();
    setSent(true);
    e.currentTarget.reset();
    setAreas(new Set());
  }

  const toggle = (slug: string, on: boolean) =>
    setAreas((s) => { const n = new Set(s); if (on) n.add(slug); else n.delete(slug); return n; });

  return (
    <section id="join" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader
          tag={t({ mr: 'सहभागी व्हा', en: 'Volunteer' })}
          heading={t({ mr: 'संजीवनी परिवारात सामील व्हा', en: 'Join Sanjeevani Parivar' })}
          sub={t({ mr: 'वेळ, कौशल्य किंवा कल्पना — आपण कोणत्याही प्रकारे सहभागी होऊ शकता. माहिती भरा; आम्ही संपर्क करू.', en: 'Time, skills or ideas — there are many ways to help. Fill this in and we will get in touch.' })}
          tagClass="bg-secondary/10 text-secondary"
        />

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100 space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="join-name" className="font-semibold text-gray-700">{t({ mr: 'नाव', en: 'Name' })} <span className="text-primary">*</span></Label>
              <Input id="join-name" name="name" required autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="join-village" className="font-semibold text-gray-700">{t({ mr: 'गाव', en: 'Village / area' })}</Label>
              <Input id="join-village" name="village" autoComplete="address-level2" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="join-contact" className="font-semibold text-gray-700">{t({ mr: 'फोन / ईमेल', en: 'Phone / Email' })} <span className="text-primary">*</span></Label>
              <Input id="join-contact" name="contact" required />
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-gray-700 mb-2">{t({ mr: 'आवडीचे क्षेत्र', en: 'Areas of interest' })}</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {KSHETRAS.map((k) => (
                <Label key={k.slug} className="flex items-center gap-2 font-normal text-gray-800">
                  <Checkbox checked={areas.has(k.slug)} onCheckedChange={(on) => toggle(k.slug, on)} />
                  {t(k.label)}
                </Label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor="join-help" className="font-semibold text-gray-700">{t({ mr: 'आपण कशी मदत करू शकता?', en: 'How would you like to help?' })}</Label>
            <Textarea id="join-help" name="help" rows={3} className="resize-none"
              placeholder={t({ mr: 'उदा. कार्यक्रमांच्या आयोजनात मदत, शिकवणे, वृक्षारोपण…', en: 'e.g. helping at events, teaching, tree planting…' })} />
          </div>

          <Button type="submit" className="w-full">{t({ mr: 'माहिती पाठवा', en: 'Send' })}</Button>
          {sent && (
            <p className="text-xs text-green-700 text-center" role="status">
              {t({ mr: '✓ ईमेल तयार झाली — कृपया पाठवा.', en: '✓ Email ready — please hit send in your mail app.' })}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
