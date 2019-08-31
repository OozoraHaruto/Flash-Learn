var webpack = require('webpack');
const path = require('path');
var envFile = require('node-env-file');
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
    polyfill: 'babel-polyfill',
    app: "./app/app.jsx",
  },
  externals: {
    jquery: 'jQuery'
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
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
          presets: ['react', 'env', 'stage-0']
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
              autoprefixer: true,
              minimize: true,
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              autoprefixer: true,
              minimize: true,
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
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map'
};