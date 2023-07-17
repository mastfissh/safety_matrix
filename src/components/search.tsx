import { Component, Fragment } from 'preact';
import { combo, linkify } from '../util';


function displayname(entry, q) {
  if (entry.title.toLowerCase().search(q) != -1){
    return entry.title
  } else {
    for (let word of entry['terms'].split(',')) {
      if (word.toLowerCase().search(q) != -1){
        return entry.title + ` (${word})`
      }
    }
  }
}

function search(data, query, limit) {
  let segments = query.split(' ')
  let q1 = segments[0]
  let q2 = segments[1]
  let out = []
  for (let datum of data){
    datum['terms'] = [datum.title].concat(datum.family_members ||[]).concat(datum.aka ||[]).join(',')
    let q = q1
    if (datum.terms.toLowerCase().search(q) != -1){
      datum['url'] = '/psychoactives/' + datum.slug
      datum['displayname'] = displayname(datum, q)
      out.push(datum)
    }
  }
  if (q2) {
    let q = q2
    for (let datum of data){
      datum['terms'] = [datum.title].concat(datum.family_members ||[]).concat(datum.aka ||[]).join(',')
      if (out.length > limit){
        return out
      }
      let singles = JSON.parse(JSON.stringify(out))
      if (datum.terms.toLowerCase().search(q) != -1){
        for (let existing of singles) {
          if (existing.slug != datum.slug) {
            let combined = JSON.parse(JSON.stringify(existing))
            let slug = linkify(combo([existing.slug,datum.slug]))
            combined['url'] = '/combos/' + slug
            combined['displayname'] = `${existing.displayname} + ${displayname(datum, q)}`
            out.push(combined)
          }
        }
      }
    }
  }

  return out
}

export default class Search extends Component {
  state = { value: '' };

  onSubmit = e => {
    e.preventDefault();
  }

  onInput = e => {
    const { value } = e.target;
    this.setState({ value })
  }

  render(i, { value }) {
    let query = this.state.value
    let psychs = search(i.data, query, 50)
    return (
<Fragment >
  <form onSubmit={this.onSubmit}>
    <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 stroke-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input value={value} onInput={this.onInput} type="search" id="search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
    </div>
  </form>
  <ul>
    {psychs.map(item => (
      <Fragment key={item.url}>
        <li><a class="font-medium text-black underline hover:no-underline" href={item.url}>{item.displayname}</a></li>
      </Fragment>
    ))}
  </ul>
</Fragment>
    );
  }
}

