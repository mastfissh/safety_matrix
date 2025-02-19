import { getCollection } from "astro:content";

export async function GET({ params, request }) {
  const psychoactives = await getCollection("psychoactives");
  return new Response(JSON.stringify(psychoactives));
}
