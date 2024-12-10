import { defineCollection, z } from "astro:content";

const psychoactivesCollection = defineCollection({
  schema: ({ image }) => z.object({
    image_location: image(),
    aka: z.any().optional(),
    title: z.string(),
    positive_effects: z.string(),
    negative_effects: z.string(),
    neutral_effects: z.string(),
    image_caption: z.string(),
    family_members: z.any().optional(),
    duration_chart: z.any(),
  })
});

export const collections = {
  psychoactives: psychoactivesCollection,
};
