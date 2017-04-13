/**
 * File Name: tools/routes-loader.js
 * Created By: bobo2007
 * Creation Date: 2017-04-12 13:48:57
 * Last Modified: 2017-04-13 11:16:33
 * Purpose:
 */

const toRegExp = require('path-to-regexp');

function escape(text) {
  // ' --> \'   \ --> \\
  return text.replace('\'', '\\\'').replace('\\', '\\\\');
}

module.exports = function routesLoader(source) {
  this.cacheable();

  const output = ['[\n'];
  const routes = JSON.parse(source);

  for (const route of routes) {
    const keys = [];
    const pattern = toRegExp(route.path, keys);
    const require = route.chunk && route.chunk === 'main' ?
      // require 返回一个promise实例
      module => `Promise.resolve(require('${escape(module)}').default)` :
      module => `new Promise(function(resolve, reject){
      try{
        require.ensure(['${escape(module)}'], function(require){
          resolve(require('${escape(module)}').default);
        }${typeof route.chunk === 'string' ? `,'${ escape(route.chunk) }'` : ''});
      } catch(err){
        reject(err);
      }
    })`;
    output.push('   {\n');
    output.push(`       path: '${escape(route.path)}',\n`);
    output.push(`       pattern: ${pattern.toString()},\n`);
    output.push(`       keys: ${JSON.stringify(keys)},\n`);
    output.push(`       page: ${route.page},\n`);
    if (route.data) {
      output.push(`       data: ${JSON.stringify(route.data)},\n`);
    }
    output.push(`       load(){\n     return ${require(route.page)};\n},\n`); // eslint-disable-line import/no-dynamic-require
    output.push('},\n');
  }
  output.push(']');
  return `export default ${output.join('')}`;
};
