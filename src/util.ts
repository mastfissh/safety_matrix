import type { RisksData } from "@src/risks";

export interface ComboList extends Array<string> {}

export function combo(list: ComboList): string {
  let subs: string[] = [...new Set(list)];
  subs.sort();
  if (subs[0] == "") {
    subs.shift();
  }
  return subs.join(" + ");
}

export function risk(list: string[], data: RisksData): string {
  let canon = combo(list);
  for (let risk of data["risk_levels"]) {
    for (let candidate of data[risk] as string[][]) {
      if (linkify(combo(candidate)) == linkify(canon)) {
        return risk;
      }
    }
  }
  if (!("" + canon).includes("+")) {
    return "na";
  }
  return "unknown";
}

export function confidence(list: string[], data: RisksData): string {
  console.debug(Object.keys(data));
  let canon = combo(list);
  for (let conf of data["conf_levels"]) {
    for (let candidate of data[conf] as string[][]) {
      if (linkify(combo(candidate)) == linkify(canon)) {
        return conf;
      }
    }
  }
  if (!("" + canon).includes("+")) {
    return "na";
  }
  return "unknown";
}
function strip_weird_chars(str: string): string {
  return str.replaceAll("/", "-").replaceAll(" ", "-");
}
export function linkify(str: string): string {
  return strip_weird_chars(str).replaceAll("-+-", "_").toLowerCase();
}

export function drug_css_prefix(str: string): string {
  return "drug_" + strip_weird_chars(str);
}

export function risk_to_bg(risk: string) {
  const map = {
    SR: "bg-red-200",
    GR: "bg-orange-200",
    MR: "bg-amber-200",
    LRS: "bg-cyan-200",
    LRD: "bg-violet-200",
    LRNS: "bg-blue-200",
    unknown: "bg-slate-200",
  };
  return map[risk];
}

export interface Entry {
  title: string;
  terms: string;
}

export function displayname(entry: Entry, query: string): string | undefined {
  if (entry.title.toLowerCase().search(query) != -1) {
    return entry.title;
  } else {
    for (let word of entry.terms.split(",")) {
      if (word.toLowerCase().search(query) != -1) {
        return entry.title + ` (${word})`;
      }
    }
  }
}
