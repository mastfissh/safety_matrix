import data from "@public/data.json";
import { getCollection } from "astro:content";
import { createHash } from "crypto";

export async function GET({ params, request }) {
  const hash = createHash("sha256");
  const psychoactives = await getCollection("psychoactives");
  const combos = await getCollection("combos");
  const everything = { psychoactives, combos, data };
  hash.update(JSON.stringify(everything));
  return new Response(JSON.stringify({ hash: hash.digest("hex") }));
}
