const path = require(`path`)

const HtmlWebpackPlugin = require(`html-webpack-plugin`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)
const ForkTsCheckerWebpackPlugin = require(`fork-ts-checker-webpack-plugin`)
const ReactRefreshWebpackPlugin = require(`@pmmmwh/react-refresh-webpack-plugin`)

// eslint-disable-next-line no-unused-vars
module.exports = (env, argv) => {
  const isDev = argv.mode === `development`

  const srcPath = path.resolve(__dirname, `client`)
  const outputPath = path.resolve(__dirname, `built`, `client`)

  const baseStyleLoaders = [
    isDev ? `style-loader` : MiniCssExtractPlugin.loader,
    {
      loader: `css-loader`,
      options: {
        modules: {
          localIdentName: isDev ? `[path][name]--[local]` : `[hash:base64]`,
        },
      },
    },
  ]

  return {
    entry: path.resolve(srcPath, `index.tsx`),
    context: srcPath,
    resolve: {
      extensions: [`.js`, `.jsx`, `.ts`, `.tsx`],
      alias: {
        '@': srcPath,
      },
      modules: [srcPath, `node_modules`],
    },
    optimization: {
      moduleIds: `deterministic`,
      runtimeChunk: `single`,
      splitChunks: {
        cacheGroups: {
          defaultVendors: {
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

    cache: {
      type: `filesystem`,
      buildDependencies: {
        config: [__filename],
      },
    },

    devtool: isDev ? `eval-source-map` : `source-map`,

    devServer: {
      historyApiFallback: true,
      hot: true,
      proxy: {
        '/api': `http://localhost:1337`,
      },
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: path.resolve(outputPath, `index.html`),
        template: path.resolve(srcPath, `template.html`),
      }),
      new MiniCssExtractPlugin({
        filename: `[name].[contenthash].css`,
        chunkFilename: `[id].[contenthash].css`,
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          mode: `write-references`,
        },
      }),
      isDev && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: /\.[j|t]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: `ts-loader`,
              options: {
                configFile: path.resolve(srcPath, `tsconfig.json`),
                onlyCompileBundledFiles: true,
              },
            },
            {
              loader: `babel-loader`,
              options: {
                cacheDirectory: true,
                presets: [
                  [
                    `@babel/preset-env`,
                    {
                      bugfixes: true,
                      useBuiltIns: `entry`,
                      corejs: `3.19.0`, // of core-js
                      targets: isDev ? `last 2 chrome versions` : `> 0.25%, not dead`,
                    },
                  ],
                  [
                    `@babel/preset-react`,
                    { development: isDev },
                  ],
                  `@babel/preset-typescript`,
                ],
                plugins: [
                  [
                    `@babel/plugin-transform-runtime`,
                    { version: `7.16.0` }, // of @babel/runtime
                  ],
                  isDev && `react-refresh/babel`,
                ].filter(Boolean),
              },
            },
          ],
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
