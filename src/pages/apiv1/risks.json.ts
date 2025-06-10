import risks from "@public/risks.json";

export async function GET({}) {
  return new Response(JSON.stringify(risks));
}
