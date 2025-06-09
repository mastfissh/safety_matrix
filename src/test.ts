import * as fs from "fs";
import { linkify } from "./util.ts";
let main = async function () {
  const input = fs.readFileSync("./public/risks.json", "utf8");
  let data = JSON.parse(input);
  let drugs = data["drugs"];
  const pages = fs.readdirSync("./src/content/psychoactives/");
  const psychs = [];
  drugs.map((drugrow) => {
    let slug = linkify(drugrow);
    psychs.push(`${slug}.mdx`);
  });
  const errors = [];
  for (let page of pages) {
    if (!psychs.includes(page)) {
      errors.push("No psych found for: " + page);
    }
  }
  console.debug(errors);
  process.exit(errors.length);
};
main();
