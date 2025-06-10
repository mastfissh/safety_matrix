import * as fs from "fs";
import { linkify } from "./util.ts";
let main = async function () {
  const input = fs.readFileSync("./public/risks.json", "utf8");
  let data = JSON.parse(input);
  let drugs: string[] = data["drugs"];
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
  if (errors.length > 0) {
    console.error("Errors found:");
    errors.forEach((error) => console.error(error));
  } else {
    console.log("All psychoactive pages are accounted for.");
  }
  process.exit(errors.length);
};
main();
