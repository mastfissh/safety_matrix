export function combo(list){
  let subs = [...new Set(list)]
  subs.sort()
  if (subs[0] == ""){
    subs.shift()
  }
  return subs.join('+')
}

export function risk(list, data){
  let canon = combo(list)
  for (let risk of data['risk_levels']) {
    for (let candidate of data[risk]){
      if (combo(candidate) == canon){
        return risk
      }
    }
  }
  if (!((""+canon).includes('+'))){
    return "na"
  }
  return "unknown"
}

export function linkify(str){
  return str.replace('/', '-').replace(' ', '-').replace('+', '-').toLowerCase()
}

export function risk_css_prefix(str) {
  return 'risk_'+str.replace('/', '-').replace(' ', '-')
}

export function slugify(str){
  return '_'+(str || '').replace('/', '-').replace(' ', '-')
}
