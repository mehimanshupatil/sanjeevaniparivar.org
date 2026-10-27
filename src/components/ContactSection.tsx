import { useState } from 'react';
import type { FormEvent } from 'react';
import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import SectionHeader from './common/SectionHeader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const TO_EMAIL = 'sanjeevani.parivar@gmail.com';

const CONTACT_ITEMS = [
  {
    icon: '📍',
    labelKey: tr.contact.address,
    content: (
      <p className="text-sm text-gray-500 leading-relaxed">
        “पारिजात”, वाघोली, निर्मळ रोड,<br />ता. वसई, पिन - ४०१ ३०४
      </p>
    ),
  },
  {
    icon: '🌐',
    labelKey: tr.contact.website,
    content: (
      <p className="text-sm">
        <a href="https://sanjeevaniparivar.org" className="text-primary font-medium hover:underline">
          sanjeevaniparivar.org
        </a>
      </p>
    ),
  },
] as const;

type Status = 'idle' | 'sent';

export default function ContactSection() {
  const t = useT();
  const c = tr.contact;
  const [status, setStatus] = useState<Status>('idle');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name    = data.get('name')    as string;
    const contact = data.get('contact') as string;
    const message = data.get('message') as string;

    const subject = encodeURIComponent(`संजीवनी परिवार संपर्क — ${name}`);
    const body    = encodeURIComponent(
      `नाव / Name: ${name}\nसंपर्क / Contact: ${contact}\n\nसंदेश / Message:\n${message}`
    );

    const a = document.createElement('a');
    a.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
    a.click();
    setStatus('sent');
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader tag={t(c.tag)} heading={t(c.heading)} tagClass="bg-primary/10 text-primary" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div className="space-y-7">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.icon} className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <strong className="block text-sm font-bold text-primary mb-1">{t(item.labelKey)}</strong>
                  {item.content}
                </div>
              </div>
            ))}
            <div className="flex gap-4 items-start">
              <span className="text-2xl mt-0.5">✉️</span>
              <div>
                <strong className="block text-sm font-bold text-primary mb-1">{t(c.joinUs)}</strong>
                <p className="text-sm text-gray-500">{t(c.joinDesc)}</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {t({ mr: 'संपर्क करा', en: 'Get in touch' })}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-semibold text-gray-700">
                  {t({ mr: 'नाव', en: 'Name' })} <span className="text-primary">*</span>
                </Label>
                <Input name="name" required placeholder={t({ mr: 'तुमचे नाव', en: 'Your name' })} />
              </div>
              <div className="space-y-1.5">
                <Label className="font-semibold text-gray-700">
                  {t({ mr: 'फोन / ईमेल', en: 'Phone / Email' })} <span className="text-primary">*</span>
                </Label>
                <Input name="contact" required placeholder={t({ mr: 'फोन किंवा ईमेल', en: 'Phone or email' })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-gray-700">
                {t({ mr: 'संदेश', en: 'Message' })} <span className="text-primary">*</span>
              </Label>
              <Textarea
                name="message"
                required
                rows={4}
                placeholder={t({ mr: 'तुमचा संदेश लिहा…', en: 'Write your message…' })}
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full motion-safe:hover:-translate-y-0.5">
              {t({ mr: 'संदेश पाठवा', en: 'Send message' })}
            </Button>

            {status === 'sent' && (
              <p className="text-xs text-green-600 text-center">
                {t({ mr: '✓ ईमेल तयार झाली — कृपया पाठवा.', en: '✓ Email ready — please hit send in your mail app.' })}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
