import * as fs from 'fs';
const input = fs.readFileSync('./src/data.json', 'utf8')
let data = JSON.parse(input)

// Cathinone combos will be coded exactly the same as Catha edulis (low risk synergy with Catha edulis).
// Psilocybe species will be coded the same as psilocybin (low risk synergy with psilocybin)

let risk_levels = data["risk_levels"]
for (let risk_level of risk_levels){
  let slice = data[risk_level]
  for (let pair of slice){
    let temp = JSON.stringify(pair)
    for (let arr of pair){
      if (arr == 'Psilocybin') {
        temp = temp.replaceAll('Psilocybin','Psilocybe Species')
        let new_pair = JSON.parse(temp)
        slice.push(new_pair)
      }
      if (arr == 'Catha edulis') {
        temp = temp.replaceAll('Catha edulis','Cathinone')
        let new_pair = JSON.parse(temp)
        slice.push(new_pair)
      }
    }
  }
}
let out_data = JSON.stringify(data)
fs.writeFileSync('./src/data.json', out_data);
