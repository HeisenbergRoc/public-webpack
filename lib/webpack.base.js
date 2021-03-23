const glob = require('glob');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MIniCssExtractPlugin = require('mini-css-extract-plugin');

const projectRoot = process.cwd();

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      return htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(projectRoot, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['vendors', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        }),
      );
    });
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();
module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
    },
    {
      test: /\.css$/,
      use: [MIniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      test: /\.scss$/,
      use: [MIniCssExtractPlugin.loader, 'css-loader', 'sass-loader', {
        loader: 'postcss-loader',
      }, {
        loader: 'px2rem-loader',
        options: {
          remUnit: 75,
          remPrecesion: 8,
        },
      }],
    },
    {
      test: /\.(png|jpg|gif|jpeg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            // limit: 10240
            name: '[name]_[hash:8].[ext]',
          },
        },
      ],
    },
    {
      test: /\.(woff|woff2|eot|tff|otf)$/,
      use: 'file-loader',
    },
    ],
  },
  plugins: [
    new MIniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.log('build error'); // eslint-disable-line
          process.exit(1);
        }
      });
    },

  ].concat(htmlWebpackPlugins),
  // devtool: 'source-map',
  stats: 'errors-only',
};
