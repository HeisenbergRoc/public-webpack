'use strict';

// import { helloWebpack } from './hello'
// document.write(helloWebpack());

import React from 'react';
import ReactDom from 'react-dom';
import avatar from './avatar.png';
import '../style/search.scss';
import '../../common';

import { binding } from './tree-shaking'

class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      Text: null
    }
  }
  loaderComponent() {
    import('./test.js').then((Text) => {
      this.setState({
        Text: Text.default
      })
    })    // 返回一个 promise 对象
  }
  render() {
    const funcA = binding();
    const { Text } = this.state;
    return <div className="search-text">
      {
        Text ? <Text /> : null
      }
      search text value form
      {funcA}
      <img src={avatar} onClick={this.loaderComponent.bind(this)}></img>
    </div>
  }
}

ReactDom.render(
  <Search />,
  document.getElementById('root')
)


