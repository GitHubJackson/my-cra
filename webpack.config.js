const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
                decorators: true,
              },
              transform: {
                legacyDecorator: true,
                react: {
                  runtime: "automatic",
                },
              },
              // 以下配置需要先安装 @swc/helpers
              externalHelpers: true,
              target: "es5",
              // minify: {
              //   compress: true
              //   format: {
              //     asciiOnly: true,
              //     comments: /^ webpack/
              //   }
              // },
            },
            // env: {
            //   targets: "last 3 major versions, > 0.1%",
            //   mode: "usage",
            //   coreJs: "3",
            // },
            isModule: "unknown",
            // minify: process.env.NODE_ENV !== "development",
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 8000,
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
