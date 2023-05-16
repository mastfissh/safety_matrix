import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://mastfissh.github.io',
  base: '/safety_matrix',
  integrations: [mdx()]
});
