/**
 * File Name: workplace/proj/src/router.js
 * Created By: bobo2007
 * Creation Date: 2017-04-12 13:24:11
 * Last Modified: 2017-04-14 20:43:39
 * Purpose: router
 */

import react from 'react';

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
    params[route.keys[i - 1].name] = match[i] !== undefined ? decodeParam(match[i]) : undefined;
  }
  return params;
}

// 找出跟location匹配的路由，获取数据(data),初始化并返回一个react组件
function resolve(routes, context) {
  for (const route of routes) {
    const params = matchURI(route, context.error ? '/error' : context.pathname);
    if (!params) {
      continue;
    }
    // 检查route中是否有需要请求的数据
    // {path: '/task/:id', data: {task: 'GET /api/tasks/:id'}, page: './pages/task'}
    if (route.data) {
      console.log('123');
    }
  }
}
