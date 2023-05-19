import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
// SR = Significant risk
// GR = Greater risk
// MR = Minor risk
// LRS = low risk synergy
// LRD = low risk decrease
// LRNS = low risk no synergy

const risk_levels = ["SR", "GR", "MR", "LRS", "LRD", "LRNS"]

const input = fs.readFileSync('./ingest/combomatrix.csv', 'utf8')
const records = parse(input, {
  skip_empty_lines: true
});

let out = {}
let druglist = records[0]
druglist.shift()
out['drugs'] = druglist
out['risk_levels'] = risk_levels
for (let risk of risk_levels){
  out[risk] = []
}

records.shift()
for (let rec of records){
  let heading = rec.shift()
  let cellidx = 0
  for (let cell of rec) {
    let combo = [heading, druglist[cellidx]]
    if (risk_levels.includes(cell)){
      out[cell].push(combo)
    }
    cellidx = cellidx + 1
  }
}
let out_data = JSON.stringify(out)
fs.writeFileSync('./src/data.json', out_data);
