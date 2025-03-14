import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import compress from "astro-compress";
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://psychcombo.com/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    sitemap(),
    preact(),
    compress({
      HTML: false,
      JavaScript: false,
    }),
  ],
  build: {
    inlineStylesheets: 'always'
  }
});
