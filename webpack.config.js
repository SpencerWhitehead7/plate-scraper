module.exports = {
  entry: [`@babel/polyfill`, `./client/index.js`],
  output: {
    path: __dirname, // assumes your bundle.js will be in the root of your project folder
    filename: `./public/bundle.js`,
  },
  devtool: `source-maps`,
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
        test: /\.css$/,
        use: [
          `style-loader`,
          {
            loader: `css-loader`,
            options: {
              modules: {
                localIdentName: `[path][name]_[local]-[hash:base64:5]`,
              },
            },
          },
        ],
      },
    ],
  },
}
