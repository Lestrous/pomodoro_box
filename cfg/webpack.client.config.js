const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';
const GLOBAL_CSS_REGEXP = /\.global\.scss$/;
const DEV_PLUGINS = [new HotModuleReplacementPlugin()];

const SASS_POSTCSS_LOADER_CONFIG = IS_PROD
  ? [
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env',
          ],
        },
      },
    },
    'sass-loader',
  ]
  : ['sass-loader'];

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'react-dom': IS_DEV ? '@hot-loader/react-dom' : 'react-dom',
    },
  },
  mode: NODE_ENV || 'development',
  entry: IS_DEV
    ? [
      path.resolve(__dirname, '../src/client/index.jsx'),
      'webpack-hot-middleware/client?path=//localhost:3001/static/__webpack_hmr',
    ]
    : [
      path.resolve(__dirname, '../src/client/index.jsx'),
    ],
  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: 'client.js',
    publicPath: '//localhost:3001/static',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          ...SASS_POSTCSS_LOADER_CONFIG,
        ],
        exclude: GLOBAL_CSS_REGEXP,
      },
      {
        test: GLOBAL_CSS_REGEXP,
        use: [
          'style-loader', 'css-loader',
          ...SASS_POSTCSS_LOADER_CONFIG,
        ],
      },
    ],
  },
  devtool: IS_PROD ? 'source-map' : 'eval-source-map',
  plugins: IS_DEV ? DEV_PLUGINS : [],
  watchOptions: {
    ignored: [path.resolve(__dirname, '../dist'), path.resolve(__dirname, '../node_modules')],
  },
};
