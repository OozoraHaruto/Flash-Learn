var webpack = require('webpack');
const path = require('path');
var envFile = require('node-env-file');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
  envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'))
} catch (e) { }
var fs = require('fs');

module.exports = {
  entry: {
    jquery: "script-loader!jquery/dist/jquery.min.js",
    bootstrap: "script-loader!bootstrap/dist/js/bootstrap.bundle.min.js",
    polyfill: 'babel-polyfill',
    app: "./app/app.jsx",
  },
  externals: {
    jquery: 'jQuery'
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      cache: true,
      parallel: true,
      extractComments: true,
      uglifyOptions: {
        warnings: false,
        parse: {},
        compress: {},
        mangle: true, // Note `mangle.properties` is `false` by default.
        output: null,
        toplevel: true,
        nameCache: null,
        ie8: false,
        keep_fnames: false,
      }
    })],
    splitChunks: {
      chunks: "all"
    }
  },
  output:{
    path: __dirname,
    filename: './public/bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }
    })
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/dist/')
  },
  resolve: {
    modules: [
      __dirname,
      "node_modules",
      "./app/components",
      "./app/api"
    ],
    alias: {
      app: 'app',
      applicationStyles: 'app/assets/styles/app.scss',
      myJS: 'app/assets/js',
      actions: 'app/redux/actions.jsx',
      reducers: 'app/redux/reducers.jsx',
      reduxConstants: 'app/redux/constants.jsx',
      configureStore: 'app/redux/configureStore.jsx'
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'env', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      }, {
        test: /\.(s)?css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [
                path.resolve(__dirname, './node_modules/bootstrap/scss')
              ]
            }
          }
        ]
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? undefined : 'eval-source-map'
};