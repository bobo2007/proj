/**
 * File Name: src/home/index.js
 * Created By: bobo2007
 * Creation Date: 2017-04-19 15:52:39
 * Last Modified: 2017-04-20 12:58:48
 * Purpose: home 首页
 */

import React, { PropTypes } from 'react';
import { html, title } from './index.md';

class HomePage extends React.Component {
  componentDidMount() {
    document.title = title;
  }
  render() {
    return <h1>{html}</h1>;
  }
}

export default HomePage;
