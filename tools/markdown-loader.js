/**
 * File Name:
 * Created By: bobo2007
 * Creation Date: 2017-04-19 14:09:29
 * Last Modified: 2017-04-19 17:06:24
 * Purpose:
 */

const MarkdownIt = require('markdown-it');
// highlight.js是一个用于在任何web页面上着色显示各种示例源代码语法的JS项目
const hljs = require('highlight.js');
const fm = require('front-matter');

module.exports = function markdownLoader(source) {
  this.cacheable();
  const md = new MarkdownIt({
    html: true, //  Set true to enable HTML tags in source.
    linkify: true, // Set true to autoconvert URL-like text to links
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {
          console.log(err.stack);
        }
      }
      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {
        console.log(err.stack);
      }
      return '';
    }
  });
  // 产生一个对象{ attributes, body, frontmatter }
  const frontmatter = fm(source);
  // Render markdown string into html. It does all magic for you
  frontmatter.attributes.html = md.render(frontmatter.body);
  return `module.exports = ${JSON.stringify(frontmatter.attributes)};`;
}
