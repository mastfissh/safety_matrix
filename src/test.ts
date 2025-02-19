import * as fs from "fs";
import { combo, linkify } from "./util.ts";
let main = async function () {
  let output = 0;
  const input = fs.readFileSync("./public/data.json", "utf8");
  let data = JSON.parse(input);
  let drugs = data["drugs"];
  const pages = fs.readdirSync("./src/content/combos/");
  const combos = [];
  drugs.map((drugrow) => {
    drugs.map((drugcell) => {
      let slug = linkify(combo([drugrow, drugcell]));
      combos.push(`${slug}.mdx`);
    });
  });
  const errors = [];
  for (let page of pages) {
    if (!combos.includes(page)) {
      errors.push("No combo found for: " + page);
    }
  }
  console.debug(errors);
  process.exit(errors.length);
};
main();
