import { SiYoutube, SiFacebook, SiInstagram, SiWhatsapp, type IconType } from '@icons-pack/react-simple-icons';
import { Globe } from 'lucide-react';

export type SocialLink = {
  key: string;
  label: string;
  icon: IconType;
  handle: string;
  href: string;
  bg: string;
};

/** Single source of truth for all social media links */
export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'youtube', label: 'YouTube', icon: SiYoutube, handle: '@sanjeevaniParivar', href: 'https://youtube.com/@sanjeevaniParivar', bg: 'bg-[#FF0000]' },
  { key: 'facebook', label: 'Facebook', icon: SiFacebook, handle: 'sanjeevani.parivar.org', href: 'https://facebook.com/sanjeevani.parivar.org', bg: 'bg-[#1877F2]' },
  { key: 'instagram', label: 'Instagram', icon: SiInstagram, handle: '@sanjeevani.parivar', href: 'https://instagram.com/sanjeevani.parivar/', bg: 'bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]' },
  { key: 'whatsapp', label: 'WhatsApp', icon: SiWhatsapp, handle: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029Vb7kB180VycBzFxlju1O', bg: 'bg-[#25D366]' },
];

export const WEBSITE_LINK = {
  key: 'web',
  icon: Globe,
  handle: 'sanjeevaniparivar.org',
  href: 'https://sanjeevaniparivar.org',
  bg: 'bg-secondary',
};
