import { Component, Fragment } from 'preact';
import { combo, linkify } from '../util';

async function getCacheEntries() {
  let topcache_keys = await caches.keys()
  let cache_key
  for(let key of topcache_keys){
    if (key.includes('workbox')){
      cache_key = key
    }
  }
  let lowcache = await caches.open(cache_key)
  return lowcache.keys()
}

async function getTotalFiles(){
  const response = await fetch("/file_count.json");
  const total = await response.json();
  return total.file_count
}
// Available states:
// We're on the server : grey signal
// We're on an unspported browser : grey no-signal
// We're in the process of caching : yellow: signal
// We're cached : green signal
// We're offline and partially cached: yellow: no-signal
// We're offline and cached : green no-signal
export default class Offline extends Component {
  state = {
    count: 0,
    total: 0,
    offline: true,
  };
  timer;

  async updateCacheCount() {
    let entries = await getCacheEntries()
    const count = entries.length;
    this.setState({ count })
  }

  async populateTotal() {
    let total
    let offline = false
    total = localStorage.getItem("lasttotal") || 0;
    try {
      total = await getTotalFiles()
      localStorage.setItem("lasttotal", total);
    } catch (e) {
      offline = true
    }
    this.setState({ total, offline })
  }

  componentDidMount() {
    this.timer = setInterval(()=> this.updateCacheCount(), 1000);
    this.populateTotal()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  color() {
    if (this.state.total == 0){
      return "stroke-gray-300 fill-gray-300"
    }

    // We've cached more files than we manifested, all good
    if (this.state.count > this.state.total){
      return "stroke-green-100 fill-green-100"
    }

    // Caching is continuing
    return "stroke-yellow-100 fill-yellow-100"
  }

  classNames() {
    return `w-8 h-6 ${this.color()}}`
  }

  render(i, { count }) {
    let classname = this.classNames()
    return (
<Fragment >
  {this.state.offline &&
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classname}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8.735 8.735m0 0a.374.374 0 11.53.53m-.53-.53l.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 010 5.304m2.121-7.425a6.75 6.75 0 010 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 01-1.06-2.122m-1.061 4.243a6.75 6.75 0 01-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12z" />
</svg>
}
{!this.state.offline &&
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classname}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>
}
  {/*{<h1 class="text-white">{this.state.count} / {this.state.total} </h1>}*/}

</Fragment>
    );
  }
}

