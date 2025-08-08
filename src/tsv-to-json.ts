import * as fs from "fs";

function main() {
  const tsv = fs.readFileSync("./tsv/conf-full.tsv", "utf8").trim().split("\n").map(line => line.split("\t"));

  // First row and first column are headers
  const drugs = tsv[0].slice(1).map(s => s.trim());
  const riskLevels = new Set<string>();
  const riskPairs: Record<string, [string, string][]> = {};

  for (let i = 1; i < tsv.length; i++) {
    const rowDrug = tsv[i][0].trim();
    for (let j = 1; j < tsv[i].length; j++) {
      const colDrug = drugs[j - 1];
      const risk = tsv[i][j].trim();
      if (!risk || risk === rowDrug || risk === colDrug) continue; // skip self or empty
      riskLevels.add(risk);
      if (!riskPairs[risk]) riskPairs[risk] = [];
      // Only add each pair once (A,B) not (B,A)
      if (rowDrug < colDrug) {
        riskPairs[risk].push([rowDrug, colDrug]);
      }
    }
  }

  const result = {
    drugs,
    risk_levels: Array.from(riskLevels),
    ...riskPairs
  };

  fs.writeFileSync("./public/conf.json", JSON.stringify(result, null, 2));
  console.log("Done! risks.json written.");
}

main(); 