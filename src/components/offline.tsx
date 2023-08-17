import  { Component, Fragment, createRef } from 'preact';
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
    offline: false,
    open: false,
  };
  timer;
  ref;
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
    await this.updateCacheCount()
    this.setState({ total, offline })
  }

  handleClick = (e) => {
    let open = !this.state.open
    this.setState({ open })
    e.preventDefault();
  }

  constructor(props) {
    super(props);
    this.ref = createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(()=> this.updateCacheCount(), 1000);
    this.populateTotal()
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.ref && !this.ref.current.contains(event.target)) {
      let open = false
      this.setState({ open })
    }
  }

  color() {
    if (this.state.total == 0){
      return "stroke-gray-400 fill-gray-400"
    }

    // We've cached more files than we manifested, all good
    if (this.state.count > (this.state.total ) ){
      return "stroke-green-300 fill-green-300"
    }

    // Caching is continuing
    return "stroke-gray-300 fill-gray-300"
  }

  explainerText(){
    let explain = `Progress ${this.state.count} / ${this.state.total}`
    return explain
  }

  classNames() {
    return `w-10 h-10 ${this.color()}}`
  }

  render(i, { count }) {
    let classname = this.classNames()
    return (
<span class="cursor-pointer" ref={this.ref}>

  {this.state.offline &&
<svg onClick={this.handleClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classname}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8.735 8.735m0 0a.374.374 0 11.53.53m-.53-.53l.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 010 5.304m2.121-7.425a6.75 6.75 0 010 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 01-1.06-2.122m-1.061 4.243a6.75 6.75 0 01-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12z" />
</svg>
}
{!this.state.offline &&
<svg onClick={this.handleClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classname}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>
}
  {this.state.open &&
    <h1 class="absolute z-10 block rounded-lg bg-gray-600 text-gray-100 mt-6 text-white">{this.explainerText()} </h1>
  }

</span>
    );
  }
}

