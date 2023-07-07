import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: 'https://psychcombo.com',
  integrations: [mdx(), tailwind(), sitemap(), image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }), compress()]
});
