import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: 'static',          // Pure static, no SSR
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://sanjeevaniparivar.org',
});
