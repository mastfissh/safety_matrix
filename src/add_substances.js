import * as fs from 'fs';
const input = fs.readFileSync('./src/data.json', 'utf8')
let data = JSON.parse(input)

let risk_levels = data["risk_levels"]
for (let risk_level of risk_levels){
  let slice = data[risk_level]
  for (let pair of slice){
    let temp = JSON.stringify(pair)
    for (let arr of pair){
      if (arr == 'Banisteriopsis caapi') {
        temp = temp.replaceAll('Banisteriopsis caapi','Kava')
        let new_pair = JSON.parse(temp)
        slice.push(new_pair)
      }
    }
  }
}

let conf_levels = data["conf_levels"]
for (let conf_level of conf_levels){
  let slice = data[conf_level]
  for (let pair of slice){
    let temp = JSON.stringify(pair)
    for (let arr of pair){
      if (arr == 'Banisteriopsis caapi') {
        temp = temp.replaceAll('Banisteriopsis caapi','Kava')
        let new_pair = JSON.parse(temp)
        slice.push(new_pair)
      }
    }
  }
}

let out_data = JSON.stringify(data)
fs.writeFileSync('./src/data.json', out_data);
