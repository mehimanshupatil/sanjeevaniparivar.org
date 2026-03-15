/**
 * App.tsx — Root React component for the homepage.
 * Kshetra details now live on their own pages (/shikshan, /paryavaran, etc.)
 */
import { LangProvider } from './LangContext';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import KshetraOverview from './KshetraOverview';
 import SocialSection from './SocialSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

export default function App() {
  return (
    <LangProvider>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <KshetraOverview />
         <SocialSection />
        <ContactSection />
      </main>
      <Footer />
    </LangProvider>
  );
}
