import { getCollection } from "astro:content";

export async function GET({}) {
  const combos = await getCollection("combos");
  return new Response(JSON.stringify(combos));
}
