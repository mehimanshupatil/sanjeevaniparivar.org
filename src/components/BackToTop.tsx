import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{ background: '#C41E3A', color: '#fff' }}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
