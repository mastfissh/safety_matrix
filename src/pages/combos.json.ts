import { getCollection, getEntry } from 'astro:content';


export async function GET({params, request}) {
  const combos = await getCollection('combos');
  return new Response(JSON.stringify(combos))}
