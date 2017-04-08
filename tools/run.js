const fs = require('fs');
const ejs = require('ejs');
const rimraf = require('rimraf');
const webpack = require('webpack');
const Browsersync = require('browser-sync');
const task = require('./task');
const config = require('./config');

// 是否热替换
global.HMR = !process.argv.includes('--no-hmr');
// 创建APP，启动并从浏览器中通过Browsersync打开
module.exports = task('run', () => new Promise((resolve) => {
  rimraf.sync('public/dist/*', {
    nosort: true,
    dot: true
  });
  let count = 0;
  const bs = Browsersync.create();
  const webpackConfig = require('./webpack.config.js');
  const compiler = webpack(webpackConfig);
  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: webpackConfig.stats
  });
  compiler.plugin('done', (stats) => {
    // 产生 index.html 页面
    const bundle = stats.compilation.chunks.find(x => x.name === 'main').files[0];
    // 读取文件字符串
    const template = fs.readFileSync('./public/index.ejs', 'utf8');
    // 将字符串装入，设置要渲染的文件名 ejs.compile(str, options)
    const render = ejs.compile(template, { filename: './public/index.ejs'});
    // 嵌入的数据 str --> rendered HTML string
    const output = render({
      debug: true,
      bundle: `/dist/${bundle}`,
      config
    });
    // 输出为 index.html 文件
    fs.writeFileSync('./public/index.html', output, 'utf8');
    // 打包完成后，启动browsersync
    count +=1;
    if(count === 1){
      bs.init({
        port: process.env.PORT || 3000,
        ui: {
          port: Number(process.env.PORT || 3000) + 1
        },
        server: {
          baseDir: 'public',
          middleware: [
            webpackDevMiddleware,
            require('webpack-hot-middleware')(compiler),
            require('connect-history-api-fallback')(),
          ]
        }
      }, resolve);
    }
  });
}
));

