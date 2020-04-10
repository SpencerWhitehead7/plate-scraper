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
    entry: srcPath,
    output: {
      path: outputPath,
      publicPath: `/`,
      filename: `bundle.js`,
    },
    devtool: isDev ? `eval-source-map` : `source-map`,
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
                    useBuiltIns: `usage`,
                    corejs: `3`,
                    targets: isDev ? `last 2 chrome versions` : `> 0.25%, not dead`,
                  },
                ],
                `@babel/preset-react`,
              ],
              plugins: [
                [
                  `@babel/plugin-transform-runtime`,
                  {
                    absoluteRuntime: true,
                    corejs: 3,
                    useESModules: true,
                    version: `7.9.2`,
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
