import { defineConfig, sharpImageService  } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import serviceWorker from "astrojs-service-worker";
import preact from "@astrojs/preact";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

let transform = function(list){
  let out = []
  let allow
  for (let item of list){
    allow = true
    // if (item.url.includes('combos')){
    //   allow = false
    // }
    // if (item.url.includes('assets')){
    //   allow = false
    // }
    if (allow){
      item.url = item.url.replace('/index.html', '/')
      out.push(item)
    }
  }
  out.reverse()
  let count = {"file_count" : out.length}
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  fs.writeFileSync(__dirname + '/dist/file_count.json', JSON.stringify(count));
  return {'manifest': out}
}

let workbox_config = {
  workbox: {
    additionalManifestEntries: ['/'],
    manifestTransforms: [transform],
    // runtimeCaching: [
    //   {
    //     urlPattern: /combos/,
    //     handler: 'StaleWhileRevalidate',
    //     // navigateFallback: '/offline/',
    //   },
    // ]
  }
}

export default defineConfig({
  site: 'https://psychcombo.com/',
  integrations: [
    serviceWorker(workbox_config),
    mdx(),
    tailwind(),
    sitemap(),
    preact(),
    compress(),
  ],
  image: {
    service: sharpImageService(),
  },
  build: {
    inlineStylesheets: 'always'
  }
});
