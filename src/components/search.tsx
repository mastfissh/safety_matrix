import { combo, linkify } from "@src/util";
import { Component, Fragment } from "preact";

interface Entry {
  title: string;
  slug: string;
  family_members?: string[];
  aka?: string[];
  terms?: string;
  url?: string;
  displayname?: string;
}

function displayname(entry: Entry, q: string): string | undefined {
  if (entry.title.toLowerCase().search(q) != -1) {
    return entry.title;
  } else {
    for (let word of (entry["terms"] as string).split(",")) {
      if (word.toLowerCase().search(q) != -1) {
        return entry.title + ` (${word})`;
      }
    }
  }
}

interface SearchDatum extends Entry {
  terms: string;
  url: string;
  displayname: string;
}

function search(data: Entry[], query: string, limit: number): SearchDatum[] {
  let segments = query
    .toLowerCase()
    .replace(" and ", " ")
    .replace(" & ", " ")
    .replace(" + ", " ")
    .split(" ");
  let q1 = segments[0];
  let q2 = segments[1];
  let out: SearchDatum[] = [];
  if (q1) {
    for (let datum of data) {
      (datum as any)["terms"] = [datum.title]
        .concat(datum.family_members || [])
        .concat(datum.aka || [])
        .join(",");
      let q = q1;
      if ((datum as any).terms.toLowerCase().search(q) != -1) {
        (datum as any)["url"] = "/psychoactives/" + datum.slug + "/";
        (datum as any)["displayname"] = displayname(datum, q);
        out.push(datum as SearchDatum);
      }
    }
  }

  if (q2) {
    let q = q2;
    for (let datum of data) {
      (datum as any)["terms"] = [datum.title]
        .concat(datum.family_members || [])
        .concat(datum.aka || [])
        .join(",");
      if (out.length > limit) {
        return out;
      }
      let singles: SearchDatum[] = JSON.parse(JSON.stringify(out));
      if ((datum as any).terms.toLowerCase().search(q) != -1) {
        for (let existing of singles) {
          if (existing.slug != datum.slug) {
            let combined: SearchDatum = JSON.parse(JSON.stringify(existing));
            let slug = linkify(combo([existing.slug, datum.slug]));
            combined["url"] = "/combos/" + slug + "/";
            combined["displayname"] = `${existing.displayname} + ${displayname(
              datum,
              q
            )}`;
            out.push(combined);
          }
        }
      }
    }
  }

  return out;
}
interface SearchState {
  value: string;
}
interface SearchProps {
  data: any[];
}

export default class Search extends Component<SearchProps, SearchState> {
  state = { value: "" };

  onSubmit = (e: Event) => {
    e.preventDefault();
  };

  onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    this.setState({ value });
  };

  clearInput = (): void => {
    const value: string = "";
    this.setState({ value });
  };

  render(
    i: Readonly<SearchProps>,
    { value }: Readonly<SearchState>
  ): preact.ComponentChild {
    let query = this.state.value;
    let psychs = search(i.data, query, 25);
    return (
      <Fragment>
        <form onSubmit={this.onSubmit}>
          <label
            for="search"
            class="mb-2 text-sm font-medium
    text-gray-900 sr-only text-white"
          >
            Search
          </label>
          <div class="relative w-full">
            {value == "" && (
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                <svg
                  class="w-5 h-5 stroke-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            )}
            {value != "" && (
              <div
                onClick={this.clearInput}
                class="absolute inset-y-0 left-0 flex items-center pl-3 "
              >
                <svg
                  class="w-6 h-6 stroke-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
            <input
              value={value}
              onInput={this.onInput}
              type="search"
              id="search"
              class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-700 focus:ring-blue-500 focus:border-blue-500  border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search"
              required
            />
          </div>
        </form>
        <ul class="absolute z-10 block rounded-lg bg-gray-100 text-gray-100 mt-6">
          {psychs.map((item) => (
            <Fragment key={item.url}>
              <li class="p-1">
                <a
                  class="font-medium text-black underline hover:no-underline"
                  href={item.url}
                >
                  {item.displayname}
                </a>
              </li>
            </Fragment>
          ))}
        </ul>
      </Fragment>
    );
  }
}
