import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import image from "@astrojs/image";
import serviceWorker from "astrojs-service-worker";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/': '/grid/'
  },
  site: 'https://psychcombo.com/',
  integrations: [serviceWorker(), mdx(), tailwind(), sitemap(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  }), preact(), compress()]
});
