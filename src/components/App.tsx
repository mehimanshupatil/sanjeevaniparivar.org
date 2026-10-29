/**
 * App.tsx — Root React component for the homepage.
 * Kshetra details now live on their own pages (/shikshan, /paryavaran, etc.)
 */
import { LangProvider } from './LangContext';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import UpcomingEvent from './UpcomingEvent';
import AboutSection from './AboutSection';
import NumbersSection from './NumbersSection';
import KshetraOverview from './KshetraOverview';
import GalleryTeaser from './GalleryTeaser';
import SocialSection from './SocialSection';
import VolunteerSection from './VolunteerSection';
import ContactSection from './ContactSection';
import BackToTop from './BackToTop';
import Footer from './Footer';
import type { Event } from '@/publicity/events';

/** upcoming: events not over at build time, soonest first (pages/index.astro) */
export default function App({ upcoming = [] }: { upcoming?: Event[] }) {
  return (
    <LangProvider>
      <Navbar />
      <main>
        <HeroSection />
        <UpcomingEvent events={upcoming} />
        <AboutSection />
        <NumbersSection />
        <KshetraOverview />
        <GalleryTeaser />
        <SocialSection />
        <VolunteerSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </LangProvider>
  );
}
