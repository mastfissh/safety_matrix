import { defineCollection, z } from "astro:content";

const psychoactivesCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    image_caption: z.string().optional(),
    image_location: image(),
    aka: z.array(z.string()).optional(),
    family_members: z.array(z.string()).optional(),
    duration_chart_title: z.string(),
    duration_chart: z.object({
      total: z.string(),
      onset: z.string(),
      coming_up: z.string(),
      plateau: z.string(),
      coming_down: z.string(),
    }),
    positive_effects: z.string(),
    negative_effects: z.string(),
    neutral_effects: z.string(),
    dosage_table: z.object({
      title: z.string(),
      threshold: z.string(),
      light: z.string(),
      common: z.string(),
      strong: z.string(),
      heavy: z.string(),
    }),
  })
});

const combosCollection = defineCollection({
  schema: () => z.object({
    title: z.string(),
  })
});

export const collections = {
  psychoactives: psychoactivesCollection,
  combos: combosCollection
};
