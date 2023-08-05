import { getImage } from "astro:assets";
import logo from '../assets/logo.png';
let logo_192 = await getImage({src: logo, width: 192, height: 192})
let logo_512 = await getImage({src: logo, width: 512, height: 512})
export async function get({params, request}) {
  let out = {
    "short_name": "PsychCombos",
    "name": "Psychoactive combination safety",
    "icons": [
      {
        "src": logo_192.src,
        "type": "image/webp",
        "sizes": "192x192"
      },
      {
        "src": logo_512.src,
        "type": "image/webp",
        "sizes": "512x512",
        "purpose": "any maskable"
      }
    ],
    "id": "/",
    "start_url": "/",
    "background_color": "#3367D6",
    "display": "standalone",
    "scope": "/",
    "theme_color": "#3367D6",
    "description": "Psychoactive safety"
  }
  return {
    body: JSON.stringify(out),
  };
}
