import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://mastfissh.github.io',
  base: '/safety_matrix',
  integrations: [mdx(), tailwind()],
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000
      },
    },
  },
});
