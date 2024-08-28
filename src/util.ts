export function combo(list){
  let subs = [...new Set(list)]
  subs.sort()
  if (subs[0] == ""){
    subs.shift()
  }
  return subs.join(' + ')
}

export function risk(list, data){
  let canon = combo(list)
  for (let risk of data['risk_levels']) {
    for (let candidate of data[risk]){
      if (linkify(combo(candidate)) == linkify(canon)){
        return risk
      }
    }
  }
  if (!((""+canon).includes('+'))){
    return "na"
  }
  return "unknown"
}

export function confidence(list, data){
  let canon = combo(list)
  for (let conf of data['conf_levels']) {
    for (let candidate of data[conf]){
      if (linkify(combo(candidate)) == linkify(canon)){
        return conf
      }
    }
  }
  if (!((""+canon).includes('+'))){
    return "na"
  }
  return "unknown"

}
function strip_weird_chars(str){
  return str.replaceAll('/', '-').replaceAll(' ', '-')
}
export function linkify(str){
  return strip_weird_chars(str).replaceAll('-+-', '_').toLowerCase()
}

export function drug_css_prefix(str) {
  return 'drug_'+strip_weird_chars(str)
}

export function risk_to_bg(risk){
  const map = {
    'SR' : 'bg-red-200',
    'GR' : 'bg-orange-200',
    'MR' : 'bg-amber-200',
    'LRS' : 'bg-cyan-200',
    'LRD' : 'bg-violet-200',
    'LRNS' : 'bg-blue-200',
    'unknown' : 'bg-slate-200',
  }
  return map[risk]
}


export function displayname(entry, query) {
  if (entry.title.toLowerCase().search(query) != -1){
    return entry.title
  } else {
    for (let word of entry['terms'].split(',')) {
      if (word.toLowerCase().search(query) != -1){
        return entry.title + ` (${word})`
      }
    }
  }
}
