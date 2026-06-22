import { useState, useEffect } from 'react';
import {  ArrowUpIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      size="icon"
      className="fixed bottom-6 right-6 z-50 size-11 rounded-full shadow-lg hover:-translate-y-1 hover:shadow-xl"
      aria-label="Back to top"
    >
      <ArrowUpIcon className="w-5 h-5" />
    </Button>
  );
}
