import fs from "fs";
import {risk,confidence} from "./util.js";

const flip = (data) => Object.fromEntries(
  Object
    .entries(data)
    .map(([key, value]) => [value, key])
  );

const psych_risk_levels = {
  "SR": "Dangerous",
  "GR": "Unsafe",
  "MR": "Caution",
  "LRS": "Low Risk & Synergy",
  "LRD": "Low Risk & Decrease",
  "LRNS": "Low Risk & No Synergy",
}


const psych_drugs =[
  "Meditation",
  "Psilocybin", 
  "Cathinones",
  "Trichocereus species",
  "Salvia divonorum",
  "Acacia species",
  "Mimosa tenuiflora",
  "Panaelous cyanescens",
  "Argyreia nervosa",
  "Ipomea violacea",
  "Rivea corymbosa",
  "Amanita muscaria",
  "Lophpopra willamsii",
  "Incillius alvarius",
  "Mitragyna speciosa",
  "Papaver somnifarem",
  "Banisteriopsis caapi",
  "Catha edulis",
  "Ephedra sinica",
  "Erythroxylum coca",
  "Phyllomedusa bicolor",
  "Tabernathe iboga",
  "Kava",
]

const tripsit_drugs = [    
  'amt',
  'lithium',   
  'pcp',
]

const drug_mapping = {
  "Alcohol": 'alcohol',
  "Cannabis": 'cannabis',
  "Amphetamines": 'amphetamines',
  "Cocaine": 'cocaine',
  "Ketamine": 'ketamine',
  "MDMA": 'mdma',  
  "Opioids": 'opioids',  
  "SSRIs": 'ssris', 
  "LSD": 'lsd', 
  "Psilocybe Species": 'mushrooms',
  "DMT": 'dmt',
  "Mescaline": 'mescaline',
  "DOx": 'dox',
  "NBOMes": 'nbomes',  
  "2C-x": '2c-x',
  "2C-T-x": '2c-t-x',
  "5-MeO-xxT": '5-meo-xxt',
  "MXE": 'mxe',
  "DXM": 'dxm',   
  "Nitrous": 'nitrous',
  "Caffeine": 'caffeine',
  "GHB/GBL": 'ghb/gbl',
  "Tramadol": 'tramadol',
  "Benzodiazepines": 'benzodiazepines',
  "MAOIs": 'maois',
}
const blah = async () => {
  try {
    let data = await fs.promises.readFile("../drugs/combos.json", "utf8")
    const tripsit = JSON.parse(data);
    data = await fs.promises.readFile("./src/data.json", "utf8")
    const psych = JSON.parse(data);
    
    // console.debug(risk(["LSD", "Cannabis"], psych));
    const mapping_drugs = flip(drug_mapping)
    // console.debug(tripsit['amphetamines'])
    let keys = Object.keys(tripsit);
    for (let key of keys){
      const drug = tripsit[key]
      // console.debug(tripsit[key])
      for (let key2 of keys){
        const drug2 = drug[key2]
        // console.debug( drug2)
        if (drug2 && mapping_drugs[key] && mapping_drugs[key2]){
          if  (psych_risk_levels[risk([mapping_drugs[key], mapping_drugs[key2]], psych)] != drug2['status']){
            console.debug(key,'+',key2);
            console.debug("Psychcombo risk:" , psych_risk_levels[risk([mapping_drugs[key], mapping_drugs[key2]], psych)],"Psychcombo confidence:",confidence([mapping_drugs[key], mapping_drugs[key2]], psych) ,'|Tripsit', drug2['status'])
          }
          
        }
      }
    }
    // console.debug(tripsit);
    // console.debug(psych);
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
};

blah();
