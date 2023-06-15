import * as fs from 'fs';
import { combo, risk, drug_css_prefix, confidence, linkify } from '../src/util.js';
let main = async function(){
  let output = 0
  const input = fs.readFileSync('./src/data.json', 'utf8')
  const placeholder = fs.readFileSync('./src/placeholder.txt', 'utf8')
  let data = JSON.parse(input)
  let drugs = data["drugs"]
  const pages = fs.readdirSync("./src/content/combos/")
  const combos = []
  drugs.map((drugrow) => {
    drugs.map((drugcell) => {
      if (drugrow != drugcell){
        let slug = linkify(combo([drugrow,drugcell]))
        combos.push({slug:`${slug}.mdx`, title:combo([drugrow,drugcell])})
      }
    })
  })
  for (let combodata of combos){
    if (!pages.includes(combodata.slug)){
      let content = placeholder.replace('#TITLE#', combodata.title)
      fs.writeFileSync('./src/content/combos/'+combodata.slug, content);
    }
  }

}
main()
