const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: './src/app.js'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].bundle.js'
  },
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: 3000,
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif|eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: 'file-loader', // This will resolves import/require() on a file into a url and emits the file into the output directory.
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/assets/images/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      template: './src/404.html',
      filename: '404.html',
      favicon: './src/assets/images/favicon.ico'
    })
  ]
}
