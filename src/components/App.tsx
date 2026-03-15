/**
 * App.tsx — Root React component for the homepage.
 * Kshetra details now live on their own pages (/shikshan, /paryavaran, etc.)
 */
import { LangProvider } from './LangContext';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import KshetraOverview from './KshetraOverview';
import EventsSection from './EventsSection';
import GalleryTeaser from './GalleryTeaser';
import SocialSection from './SocialSection';
import ContactSection from './ContactSection';
import BackToTop from './BackToTop';
import Footer from './Footer';

export default function App() {
  return (
    <LangProvider>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <KshetraOverview />
        <EventsSection />
        <GalleryTeaser />
        <SocialSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </LangProvider>
  );
}
