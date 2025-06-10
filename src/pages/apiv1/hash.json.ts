import risks from "@public/risks.json";
import { getCollection } from "astro:content";
import { createHash } from "crypto";

function hashObject(obj:object): string {
  const hash = createHash("md5");
  hash.update(JSON.stringify(obj));
  return hash.digest("hex");
}

export async function GET({}) {
  const psychoactives = await getCollection("psychoactives");
  const combos = await getCollection("combos");
  return new Response(
    JSON.stringify({
      risks: hashObject(risks),
      psychoactives: hashObject(psychoactives),
      combos: hashObject(combos),
    })
  );
}
