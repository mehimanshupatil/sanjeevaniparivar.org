/**
 * App.tsx — Root React component for the homepage.
 * Kshetra details now live on their own pages (/shikshan, /paryavaran, etc.)
 */
import { LangProvider } from './LangContext';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import KshetraOverview from './KshetraOverview';
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
        <GalleryTeaser />
        <SocialSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </LangProvider>
  );
}
