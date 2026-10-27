import { useState } from 'react';
import { useWindowEvent } from '@mantine/hooks';
import {  ArrowUpIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useWindowEvent('scroll', () => setVisible(window.scrollY > 400), { passive: true });

  if (!visible) return null;

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      size="icon"
      className="fixed bottom-6 right-6 z-50 size-11 rounded-full shadow-lg motion-safe:hover:-translate-y-0.5 hover:shadow-xl"
      aria-label="Back to top"
    >
      <ArrowUpIcon className="w-5 h-5" />
    </Button>
  );
}
