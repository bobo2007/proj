/**
 * File Name: tools/webpack.config.js
 * Created By: bobo2007
 * Creation Date: 2017-04-12 13:48:19
 * Last Modified: 2017-05-05 11:52:48
 * Purpose:
 */

const path     = require('path');
const webpack   = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const pkg     = require('../package.json');

const isDebug   = global.DEBUG === false ? false : !process.argv.includes('--release');
const isVerbose  = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR    = Boolean(global.HMR); // Hot Module Replacement (HMR)
const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: useHMR,
  presets: pkg.babel.presets.map(x => x === 'env' ? ['env', {'modules': false}] : x )
  // Webpack 2 has built-in support for ES2015 modules, and you won’t need to re-require your app root in module.hot.accept.
});

// Webpack configuration (main.js => public/dist/main.{hash}.js)
// http://webpack.github.io/docs/configuration.html
const config = {

  // The base directory for resolving the entry option
  context: path.resolve(__dirname, '../src'),

  // The entry point for the bundle
  entry: [
    /* The main entry point of your JavaScript application */
    './main.js'
  ],

  // Options affecting the output of the compilation
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    publicPath: isDebug ? `http://localhost:${process.env.PORT || 3000}/dist/` : '/dist/',
    filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    sourcePrefix: '  '
  },

  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'source-map' : false,

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __DEV__: isDebug
    }),
    // Emit a JSON file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, '../public/dist'),
      filename: 'assets.json',
      prettyPrint: true
    }),
    new webpack.LoaderOptionsPlugin({
      debug: isDebug,
      minimize: !isDebug
    })
  ],

  // Options affecting the normal modules
  module: {
    rules: [{
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../components')
      ],
      loader: 'babel-loader',
      options: babelConfig
    },
      {
        test: /\.less/,
        use: [{
          loader: 'style-loader' // // creates style nodes from JS strings
        },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader',
          }
        ]
      },
      {
        test: /\.json$/,
        exclude: [
          path.resolve(__dirname, '../src/routes.json')
        ],
        loader: 'json-loader'
      },
      {
        test: /\.json$/,
        include: [
          path.resolve(__dirname, '../src/routes.json')
        ],
        use: [{
          loader: 'babel-loader',
          options: babelConfig
        },
          {
            loader: path.resolve(__dirname, './routes-loader.js')
          }
        ]
      },
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, './markdown-loader.js')
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader'
      }
    ]
  }
};

// Optimize the bundle in release (production) mode
if (!isDebug) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: isVerbose
    }
  }));
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

// Hot Module Replacement (HMR) + React Hot Reload
if (isDebug && useHMR) {
  babelConfig.plugins.unshift('react-hot-loader/babel');
  config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = config;
