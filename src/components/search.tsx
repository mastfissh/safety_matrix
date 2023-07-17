import { Component, Fragment } from 'preact';
import { combo, linkify } from '../util';

function search(data, query, limit) {
  let query =
  let out = []
  for (let datum of data){
    if (datum.title.toLowerCase().search(query) != -1){
      datum['url'] = '/psychoactives/' + datum.slug
      out.push(datum)
    }
  }
  for (let datum of data){
    if (out.length > limit){
      return out
    }
    let singles = JSON.parse(JSON.stringify(out))
    if (datum.title.toLowerCase().search(query) != -1){
      for (let existing of singles) {
        if (existing.slug != datum.slug) {
          let combined = JSON.parse(JSON.stringify(existing))
          let slug = linkify(combo([existing.key,datum.key]))
          combined['url'] = '/combos/' + datum.slug
          combined['title'] = `${existing.title} + ${datum.title}`
          out.push(combined)
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
            {/*<Icon iconCode="search" iconStyle="outline" customClasses="w-5 h-5 stroke-gray-500" />}*/}
        </div>
        <input value={value} onInput={this.onInput} type="search" id="search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
    </div>
  </form>
  <ul>
    {psychs.map(item => (
      // Without a key, Preact has to guess which elements have
      // changed when re-rendering.
      <Fragment key={item.slug}>
        <li><a href={item.url}>{item.title}</a></li>
      </Fragment>
    ))}
  </ul>
</Fragment>
    );
  }
}

