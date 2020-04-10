// eslint-disable-next-line no-unused-vars
module.exports = (env, argv) => {
  const isDev = argv.mode === `development`

  return {
    entry: [`@babel/polyfill`, `./client/index.js`],
    output: {
      path: `${__dirname}/public`,
      filename: `bundle.js`,
    },
    devtool: isDev ? `eval-source-map` : `source-map`,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: `babel-loader`,
            options: {
              presets: [`@babel/preset-react`, `@babel/preset-env`],
            },
          },
        },
        {
          test: /\.scss$/i,
          use: [
            `style-loader`,
            {
              loader: `css-loader`,
              options: {
                modules: {
                  localIdentName: `[path][name]_[local]---[hash:base64:5]`,
                },
                sourceMap: true,
                esModule: true,
              },
            },
            `sass-loader`,
          ],
        },
        {
          test: /\.css$/i,
          use: [
            `style-loader`,
            {
              loader: `css-loader`,
              options: {
                modules: {
                  localIdentName: `[path][name]_[local]-[hash:base64:5]`,
                },
                sourceMap: true,
                esModule: true,
              },
            },
          ],
        },
      ],
    },
  }
}
