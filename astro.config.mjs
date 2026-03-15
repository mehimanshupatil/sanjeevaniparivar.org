import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',          // Pure static, no SSR
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  site: 'https://sanjeevaniparivar.org',
});
