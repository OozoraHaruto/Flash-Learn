var webpack = require('webpack');
const path = require('path');
var envFile = require('node-env-file');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
  envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'))
} catch (e) { }
var fs = require('fs');

module.exports = {
  entry: {
    jquery: "script-loader!jquery/dist/jquery.min.js",
    bootstrap: "script-loader!bootstrap/dist/js/bootstrap.bundle.min.js",
    polyfill: '@babel/polyfill',
    main: "./app/app.jsx",
  },
  externals: {
    jquery: 'jQuery'
  },
  optimization: {
    minimizer: [new TerserPlugin({
      cache: true,
      parallel: true,
      extractComments: 'all',
      terserOptions: {
        ecma: undefined,
        warnings: false,
        parse: {},
        compress: {},
        mangle: true, // Note `mangle.properties` is `false` by default.
        module: false,
        output: null,
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
        output: {
          comments: false,
        },
      },
    })],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      fileName: 'index.html',
      template: 'app/html-loader-template.html'
    }),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
        FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        FIREBASE_DATABASE_URL: JSON.stringify(process.env.FIREBASE_DATABASE_URL),
        FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
        FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
        FIREBASE_APP_ID: JSON.stringify(process.env.FIREBASE_APP_ID),
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
    filename: 'dist/[name].[contenthash:8].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'public/')
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
      reduxConstants: 'app/redux/Constants.jsx',
      configureStore: 'app/redux/configureStore.jsx',
      firebase: 'app/firebase',
      reuse: 'app/components/UIReuseable',
      databaseConstants: 'app/components/ConstantsDb'
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        query: {
          presets: [
            '@babel/preset-react', 
            '@babel/preset-env',
          ],
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
          ]
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
      }, {
        test: /\.(s)?css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              url: true,
              import: true,
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map'
};