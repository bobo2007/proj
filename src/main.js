/**
 * File Name: workplace/proj/src/main.js
 * Created By: bobo2007
 * Creation Date: 2017-04-12 13:25:27
 * Last Modified: 2017-04-19 20:30:00
 * Purpose: main 入口文件
 */

import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDom from 'react-dom';
import FastClick from 'fastclick';
// import {Provider} from 'react-redux';
// import store from './store';
import router from './router';
import history from './history';

// 通过routes-loader加载
let routes = require('./routes.json').default;

const container = document.getElementById('container');

function renderComponent(component) {
  // ReactDom.render(<Provider store={store}>{component}</Provider>, container);
  ReactDom.render(<div>{component}</div>, container);
}

// 找到并渲染跟路径匹配的页面,如果不存在渲染error页面
function render(location) {
  router.resolve(routes, location)
  .then(renderComponent)
  .catch(error => router.resolve(routes, { ...location,
                                 error
  }).then(renderComponent));
}

//  Listen for changes to the current location using history.listen
history.listen(render);
// render current location
render(history.location);
FastClick.attach(document.body);

// enable HMR
if (module.hot) {
  module.hot.accept('./routes.json', () => {
    routes = require('./routes.json').default;
    render(history.location);
  });
}
