import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import mdx from '@astrojs/mdx';

/**
 * Tools that make official-looking cards (template gallery + editor).
 * Routed only under `pnpm dev`, so they are never built or deployed: anyone could use them there.
 */
const devOnlyPages = () => ({
  name: 'dev-only-pages',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      injectRoute({ pattern: '/publicity/templates', entrypoint: './src/dev-pages/templates/index.astro' });
      injectRoute({ pattern: '/publicity/templates/[type]', entrypoint: './src/dev-pages/templates/[type].astro' });
    },
  },
});

// https://astro.build/config
export default defineConfig({
  output: 'static',          // Pure static, no SSR
  integrations: [
    mdx(),
    devOnlyPages(),
    react(),
    sitemap({ filter: (page) => !page.includes('/publicity/') && !page.includes('/verify/') }),  // Publicity pages are render targets, not site pages; /verify/ is for receipt QR codes
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://sanjeevaniparivar.org',
});
