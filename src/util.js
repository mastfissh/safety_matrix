export function combo(list){
  let subs = [...new Set(list)]
  subs.sort()
  if (subs[0] == ""){
    subs.shift()
  }
  return subs.join('-')
}

export function risk(list, data){
  let canon = combo(list)
  for (let danger of data["danger"]){
    if (combo(danger) == canon){
      return "danger"
    }
  }
  for (let safe of data["safe"]){
    if (combo(safe) == canon){
      return "safe"
    }
  }
  if (!((""+canon).includes('-'))){
    return "na"
  }
  return "unknown"
}
