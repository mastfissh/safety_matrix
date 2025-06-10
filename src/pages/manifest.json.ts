import { getImage } from "astro:assets";
import logo from "@src/assets/logo.png";
let logo_192 = await getImage({
  src: logo,
  width: 192,
  height: 192,
  format: "png",
});
let logo_512 = await getImage({
  src: logo,
  width: 512,
  height: 512,
  format: "png",
});
export async function GET({}) {
  let out = {
    short_name: "PsychCombos",
    name: "Psychoactive combination safety",
    icons: [
      {
        src: logo_192.src,
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: logo_512.src,
        type: "image/png",
        sizes: "512x512",
        purpose: "any maskable",
      },
    ],
    id: "/",
    start_url: "/",
    background_color: "#3367D6",
    display: "standalone",
    scope: "/",
    theme_color: "#3367D6",
    description: "Psychoactive safety",
  };
  return new Response(JSON.stringify(out));
}
