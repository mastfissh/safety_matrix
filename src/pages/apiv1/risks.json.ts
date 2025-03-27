import risks from "@public/risks.json";

export async function GET({ params, request }) {
  return new Response(JSON.stringify(risks));
}
