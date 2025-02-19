import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import compress from "astro-compress";
import { defineConfig } from 'astro/config';
import serviceWorker from "astrojs-service-worker";
import fs from 'fs';
import { dirname, path } from 'path';
import { fileURLToPath } from 'url';

let transform = function (list) {
  let out = []
  for (let item of list) {
    item.url = item.url.replace('/index.html', '/')
    out.push(item)
  }
  out.reverse()
  let count = { "file_count": out.length }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  fs.writeFileSync(__dirname + '/dist/file_count.json', JSON.stringify(count));
  return { 'manifest': out }
}

let workbox_config = {
  workbox: {
    additionalManifestEntries: ['/'],
    manifestTransforms: [transform],
  }
}

export default defineConfig({
  site: 'https://psychcombo.com/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    serviceWorker(workbox_config),
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
