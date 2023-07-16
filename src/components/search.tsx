import { Component, Fragment } from 'preact';

export default class Search extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Submitted a todo");
    e.preventDefault();
  }

  onInput = e => {
    const { value } = e.target;
    this.setState({ value })
  }

  render(i, { value }) {
    let list = ['thing', 'tree', 'lord']
    console.debug(i.data)
    return (
      <form onSubmit={this.onSubmit}>
      <dl>
        {list.map(item => (
          // Without a key, Preact has to guess which elements have
          // changed when re-rendering.
          <Fragment key={item}>
            <dd>{item}</dd>
          </Fragment>
        ))}
      </dl>
        <input type="text" value={value} onInput={this.onInput} />
        <p>You typed this value: {value}</p>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

