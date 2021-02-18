const path = require("path");
const webpack = require('webpack');

// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ProgressPlugin, HotModuleReplacementPlugin } = webpack;

const devMode = process.env.NODE_ENV !== 'production';
const buildPath = path.resolve(__dirname, 'build')

const plugins = [
  new ProgressPlugin(),
  new HtmlWebpackPlugin({
    template: './src/template.html'
  }),
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],
  }),
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css"
  })
];

if (devMode) {
  plugins.push(new HotModuleReplacementPlugin());
}

module.exports = {
  plugins,
  devtool: "eval-cheap-module-source-map",
  entry: "./src/index.js",
  output: {
    filename: "[name].[contenthash].js",
    path: buildPath,
  },

  //
  // Optimization Configuration
  //
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },

  //
  // Loaders Configuration
  //
  module: {
    rules: [
      //
      // Rules for Javascript Files
      //
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      //
      // Rules for CSS Files
      //
      {
        test: /\.scss$/i,
        use: [
          // Order matters: (right-to-left)
          // 1. sass-loader -> transforms scss into css
          // 2. postcss-loader -> Add prefixes to the css
          // 3. css-loader -> transforms css into commonjs
          // 4. style-loader -> inject the commonjs css into the page <head>
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                  ],
                ],
              },
            },
          },
          "sass-loader"
        ],
      },
      //
      // Rules for Static Files (Assets)
      //
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: '[name].[hash:7][ext]'
        }
      }
    ],
  },
}
