import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

const conf_levels = ["Low confidence", "Medium confidence", "High confidence"]

const input = fs.readFileSync('./ingest/confidence.csv', 'utf8')
const records = parse(input, {
  skip_empty_lines: true
});
const existing = fs.readFileSync('./src/data.json', 'utf8')
let out = JSON.parse(existing)
let druglist = records[0]
druglist.shift()
out['conf_levels'] = conf_levels
for (let conf of conf_levels){
  out[conf] = []
}

records.shift()
for (let rec of records){
  let heading = rec.shift()
  let cellidx = 0
  for (let cell of rec) {
    let combo = [heading, druglist[cellidx]]
    if (conf_levels.includes(cell)){
      out[cell].push(combo)
    }
    cellidx = cellidx + 1
  }
}
let out_data = JSON.stringify(out)
fs.writeFileSync('./src/data.json', out_data);
