const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  devtool: 'source-map',
  entry: {
    index: './src/app.ts',
    processors: './src/processors/index.ts',
  },
  output: {
    filename: '[id].js',
    path: path.resolve(__dirname, 'dist', 'app'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css|\.html$/,
        include: /customElements/,
        use: 'raw-loader'
      },
      {
        test: /\.css$/i,
        exclude: /customElements/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '../../style',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.ts' ],
    modules: ["src", "node_modules"],
    alias:  {
      "@components": path.resolve(__dirname, 'src/components/'),
      "@modules": path.resolve(__dirname, 'src/modules/'),
      "@nodes": path.resolve(__dirname, 'src/nodes/'),
      "@interfaces": path.resolve(__dirname, 'src/interfaces/'),
      "@utilities": path.resolve(__dirname, 'src/utilities/'),
      "@constants": path.resolve(__dirname, 'src/constants/'),
      "src": path.resolve(__dirname, 'src/'),
    }
  },
  plugins: [
    new CopyPlugin([
      { from: './src/assets', to: '../assets' },
      { from: './src/index.html', to: '../' },
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: devMode ? '../style/[name].css' : '../style/[name].css',
      chunkFilename: devMode ? '[id].css' : '[id].css',
    }),
  ],
};