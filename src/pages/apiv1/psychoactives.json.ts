import { getCollection } from "astro:content";

export async function GET({}) {
  const psychoactives = await getCollection("psychoactives");
  return new Response(JSON.stringify(psychoactives));
}
