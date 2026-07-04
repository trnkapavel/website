import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  site: 'https://example.com', // TODO při nasazení: nahradit skutečnou doménou (jediný povolený TODO v projektu)
  // 'ignore' v dev módu: Keystatic volá /api/keystatic/* bez koncového lomítka,
  // což s 'always' 404uje. V produkci (bez Keystatic) zůstává 'always'.
  trailingSlash: isDev ? 'ignore' : 'always',
  integrations: [react(), markdoc(), sitemap(), ...(isDev ? [keystatic()] : [])],
});
