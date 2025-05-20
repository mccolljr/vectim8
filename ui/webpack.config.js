const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/** @type import("webpack").Configuration */
const webpackConfig = {
  entry: {
    app: path.resolve(__dirname, "src/main.tsx"),
  },
  plugins: [new HtmlWebpackPlugin({ title: "Vectim8", scriptLoading: "blocking" })],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".sass"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: "ts-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ca]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  output: {
    clean: true,
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};

module.exports = webpackConfig;
