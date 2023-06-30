import * as fs from 'fs';
const input = fs.readFileSync('./src/data.json', 'utf8')
let data = JSON.parse(input)

// Meditation should be LRS (low risk synergy), high confidence all combos
//
let drugs = data["drugs"]
for (let drug of drugs){
  data['LRS'].push(["Meditation", drug])
  data["High confidence"].push(["Meditation", drug])
}
let out_data = JSON.stringify(data)
fs.writeFileSync('./src/data.json', out_data);
