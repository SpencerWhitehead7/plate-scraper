const path = require(`path`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)
const HtmlWebpackPlugin = require(`html-webpack-plugin`)
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)

// eslint-disable-next-line no-unused-vars
module.exports = (env, argv) => {
  const isDev = argv.mode === `development`

  const srcPath = path.resolve(__dirname, `client`)
  const outputPath = path.resolve(__dirname, `dist`)

  const baseStyleLoaders = [
    isDev
      ? `style-loader`
      : {
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: true,
        },
      },
    {
      loader: `css-loader`,
      options: {
        modules: {
          localIdentName: isDev ? `[path][name]--[local]` : `[hash:base64]`,
        },
        sourceMap: true,
        esModule: true,
      },
    },
  ]

  return {
    entry: [`react-hot-loader/patch`, srcPath],
    context: srcPath,
    resolve: {
      modules: [srcPath, `node_modules`],
      alias: {
        'react-dom': `@hot-loader/react-dom`,
      },
    },
    optimization: {
      moduleIds: `hashed`,
      runtimeChunk: `single`,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: `vendors`,
            chunks: `all`,
          },
        },
      },
    },
    output: {
      path: outputPath,
      publicPath: `/`,
      filename: isDev ? `[name].bundle.js` : `[name].[contenthash].js`,
    },

    devtool: isDev ? `eval-source-map` : `source-map`,

    devServer: {
      contentBase: outputPath,
      hot: true,
      writeToDisk: true,
      proxy: {
        '/': `http://localhost:1337`,
      },
    },

    plugins: [
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: [`**/*`, `!index.html`],
      }),
      new HtmlWebpackPlugin({
        filename: path.resolve(outputPath, `index.html`),
        template: path.resolve(srcPath, `template.html`),
        scriptLoading: `defer`,
      }),
      new MiniCssExtractPlugin({
        filename: `[name].[contenthash].css`,
        chunkFilename: `[id].[contenthash].css`,
      }),
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: `babel-loader`,
            options: {
              cacheDirectory: true,
              presets: [
                [
                  `@babel/preset-env`,
                  {
                    bugfixes: true,
                    useBuiltIns: `entry`,
                    corejs: 3,
                    targets: isDev ? `last 2 chrome versions` : `> 0.25%, not dead`,
                  },
                ],
                `@babel/preset-react`,
              ],
              plugins: [
                `react-hot-loader/babel`,
                [
                  `@babel/plugin-transform-runtime`,
                  {
                    absoluteRuntime: true,
                    useESModules: true,
                    version: `^7.11.2`,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.scss$/i,
          use: [...baseStyleLoaders, `sass-loader`],
        },
        {
          test: /\.css$/i,
          use: baseStyleLoaders,
        },
      ],
    },
  }
}
