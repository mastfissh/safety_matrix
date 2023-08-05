import { Component, Fragment } from 'preact';
import { combo, linkify, displayname, risk, risk_to_bg, confidence } from '../util';

function search(data, query, slugs) {
  let out = []
  for (let slug of slugs){
    let datum = data[slug]
    datum['terms'] = [datum.title].concat(datum.family_members ||[]).concat(datum.aka ||[]).join(',')
    if (datum.terms.toLowerCase().search(query) != -1){
      datum['url'] = '/psychoactives/' + datum.slug + '/'
      datum['displayname'] = displayname(datum, query)
      out.push(datum)
    }
  }
  return out
}

function slugs(data){
  let slugs = []
  for (let sub of data['drugs']){
    slugs.push(linkify(sub))
  }
  return slugs
}

function href(items){
  let subs = [...new Set(items)]
  subs.sort()
  if (subs.length == 1){
    return `/psychoactives/${subs[0]}/`
  } else {
    return `/combos/${subs[0]}_${subs[1]}/`
  }
}

function title(items, psych_data) {
  let subs = [...new Set(items)]
  subs.sort()
  if (subs.length == 1){
    return psych_data[subs[0]].title
  } else {
    return `${psych_data[items[0]].title} + ${psych_data[items[1]].title}`
  }
}

function warn(i1, i2, data) {
  return (confidence([i1,i2], data) == 'Low confidence')
}

class GridTable extends Component {
  render(i, { value }) {
    let chosen = i.chosen
    let ordering = i.ordering
    let data = i.data
    let psych_data = i.psych_data
    let psychs = []
    for (let ord of ordering){
      if (chosen.includes(ord)){
        psychs.push(ord)
      }
    }
    return (
      <Fragment >
      <table class="w-full border-2 border-collapse border-slate-900 lg:text-lg md:text-md table-fixed text-sm" id="safety_grid">
        <tbody>
          <tr class="border border-grey-500 overflow-hidden p-1 topkey">
          <th class="border border-grey-500 font-normal h-12">Grid</th>
          {psychs.map(item => (
            <Fragment key={item}>
              <th class="border border-grey-500 overflow-hidden p-1 font-normal">
                <a href={href([item])} class="w-full block text-black font-medium h-full hover:no-underline underline">
                  {title([item], psych_data)}
                </a>
              </th>
            </Fragment>
          ))}
          </tr>
{psychs.map(row => (
  <Fragment key={row}>
    <tr>
      <td class="border border-grey-500 overflow-hidden p-1 h-12 ">
        <a href={href([row])} class="w-full block text-black font-medium h-full hover:no-underline underline">
            {title([row], psych_data)}
        </a>
      </td>
      {psychs.map(col => (
        <Fragment key={col}>
          <td class={"border border-grey-500 overflow-hidden p-1 " + risk_to_bg(risk([row,col], data))}>
          {warn(row,col, data) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6, inline">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
</svg>
}
              <a href={href([row,col])} class="w-full block text-black font-medium h-full hover:no-underline underline">
                  {title([row,col], psych_data)}
                </a>
          </td>
        </Fragment>
      ))}
    </tr>
  </Fragment>
))}
        </tbody>
      </table>
      </Fragment>
    );
  }
}

export default class Grid extends Component {
  state = {
    value: '',
    checked_boxes: ['alcohol', 'cannabis'],
  };

  isChecked = target => {
    return (this.state.checked_boxes.includes(target));
  }

  onSubmit = e => {
    e.preventDefault();
  }

  onInput = e => {
    const { value } = e.target;
    this.setState({ value })
  }

  clearInput = e => {
    const value = "";
    this.setState({ value })
  }

  toggle = e => {
    let target = e.target.id
    let checked = (!this.state.checked_boxes.includes(target));
    let checked_boxes = JSON.parse(JSON.stringify(this.state.checked_boxes))
    if (checked) {
      checked_boxes.push(target)
    } else {
      checked_boxes = checked_boxes.filter(item => item !== target)
    }
    this.setState({ checked_boxes });
  };

  render(i, { value, checked }) {
    let query = this.state.value
    let ordering = slugs(i.data)
    let psychs = search(i.psych_data, query, ordering)
    return (
<Fragment >
  <GridTable chosen={this.state.checked_boxes} psych_data={i.psych_data} data={i.data} ordering={ordering} />
  <form class="my-6" onSubmit={this.onSubmit}>
    <label for="search-grid" class="mb-2 text-sm font-medium
    text-gray-900 sr-only text-white">Search</label>
    <div class="relative w-full">
        {value == "" && <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
          <svg class="w-5 h-5 stroke-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>}
        {value != "" && <div onClick={this.clearInput} class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="w-6 h-6 stroke-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>

        </div>}
        <input value={value} onInput={this.onInput} autocomplete="off" type="search" id="search-grid"
        class="w-full block text-black focus:ring-blue-500 focus:ring-blue-500 bg-gray-50 border border-gray-300 border-gray-600 focus:border-blue-50 focus:border-blue-500 p-4 pl-10 placeholder-gray-400 rounded-lg text-gray-900 text-sm" placeholder="Search" required />
    </div>
  </form>
  <ul class="w-full gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 xl:grid-cols-7 2xl:grid-cols-8">
    {psychs.map(item => (
      <Fragment key={item.slug}>
        <li >
          <input class="filter_check hidden peer" id={item.slug} type="checkbox" value={item.slug} name={item.slug} checked={this.isChecked(item.slug)}
          onClick={this.toggle} />
          <label class="w-full rounded-lg bg-white border-2 border-gray-400 cursor-pointer hover:text-gray-300 inline-flex items-center justify-between p-5 peer-checked:bg-gray-600 peer-checked:border-blue-600 peer-checked:text-gray-300 peer-checked:text-gray-50 text-gray-1000" for={item.slug}>
          <div class="block">
            <div class="w-full lg:text-lg font-semibold searchable-title text-md">{item.displayname}</div>
            <img alt={item.img_capt} class="rounded-lg align-middle h-auto leading-none shadow-lg" decoding="async" loading="lazy" src={item.img.src} />
          </div>
        </label>
      </li>
      </Fragment>
    ))}
  </ul>
</Fragment>
    );
  }
}
