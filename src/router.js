/**
 * File Name: workplace/proj/src/router.js
 * Created By: bobo2007
 * Creation Date: 2017-04-12 13:24:11
 * Last Modified: 2017-04-19 13:20:46
 * Purpose: 解析路径并获取路径对应的页面组件及其数据
 */
// 注意 React 必须R 是大写,否则eslint报错
import React from 'react';

function decodeParam(val) {
  if (!(typeof val === 'string' || val.length === 0)) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param '${val}'`;
      err.status = 400;
    }
  }
}

// 用路由中的正则表达式匹配当前的URL
// matchURI({ path: '/post/:id' }, '/dummy') => null
// matchURI({ path: '/post/:id' }, '/post/123') =>{id:123}
function matchURI(route, path) {
  const match = route.pattern.exec(path);
  if (!match) {
    return null;
  }
  const params = Object.create(null);
  for (let i = 1; i < match.length; i += 1) {
    // 收集路径中匹配的各个参数，不匹配的为undefined
    params[route.keys[i - 1].name] = match[i] !== undefined ? decodeParam(match[i]) : undefined;
  }
  return params;
}

// 找出跟location匹配的路由，获取数据(data),初始化并返回一个react组件
function resolve(routes, context) {
  for (const route of routes) {
    const params = matchURI(route, context.error ? '/error' : context.pathname);
    // 如果不匹配当前路径,继续遍历
    if (!params) {
      continue;
    }
    // 检查route中是否有需要请求的数据
    // {path: '/task/:id', data: {task: 'GET /api/tasks/$id'}, page: './pages/task'}
    if (route.data) {
      // 如果有请求加载数据就同步加载页面组件和请求数据
      const tasks = Object.keys(route.data);
      return Promise.all([
        // 加载页面
        route.load(),
        // 获取数据
        ...tasks.map((task) => {
          const query = route.data[task];
          // 获取请求方法
          const method = query.substring(0, query.indexOf(' ')); // GET
          let url = query.substr(query.indexOf(' ') + 1); // /api/tasks/$id
          Object.keys(params).forEach((k) => {
            url = url.replace(`${k}`, params[k]);
          });
          // 注意返回的是promise实例
          return fetch(url, {
            method
          }).then((resp) => {
            resp.json();
          });
        })
      ]).then(([Page, ...data]) => {
        const props = tasks.reduce((result, task, i) => ({
          ...result,
          [task]: data[i]
        }), {});
        return <Page route={{ ...route,params }} error={context.error} {...props} />;
      });
    }
    // 如果没有需要请求的数据就直接加载页面
    return route.load().then((Page) => {
      return <Page route={{ ...route,params }} error={context.error}  />;
    });
  }
  // 没有找到要访问的页面
  const error = new Error('Page not found');
  error.status = 404;
  return Promise.reject(error);
}

export default {
  resolve
};
