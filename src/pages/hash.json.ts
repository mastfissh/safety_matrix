import data from "@public/data.json";
import { getCollection } from "astro:content";
import { createHash } from "crypto";

function hashObject(obj) {
  const hash = createHash("sha256");
  hash.update(JSON.stringify(obj));
  return hash.digest("hex");
}

export async function GET({ params, request }) {
  const psychoactives = await getCollection("psychoactives");
  const combos = await getCollection("combos");
  return new Response(JSON.stringify({ risks: hashObject(data), psychoactives: hashObject(psychoactives), combos : hashObject(combos) })); 
}
