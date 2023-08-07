import { defineConfig, sharpImageService  } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compress from "@otterlord/astro-compress";
import serviceWorker from "astrojs-service-worker";
import preact from "@astrojs/preact";

let transform = function(list){
  let out = []
  let allow
  for (let item of list){
    allow = true
    if (item.url.includes('combos')){
      allow = false
    }
    if (item.url.includes('assets')){
      allow = false
    }
    if (allow){
      out.push(item)
    }
  }
  return {'manifest': out}
}

let workbox_config = {
  workbox: {
    additionalManifestEntries: ['/'],
    // manifestTransforms: [transform],
    // importScripts: ['worker.js'],
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
  experimental: {
    assets: true,
  },
  image: {
    service: sharpImageService(),
  },
  build: {
    inlineStylesheets: 'always'
  }
});
