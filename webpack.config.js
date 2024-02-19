const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
};

const smp = new SpeedMeasurePlugin();

const isProduction = process.env.NODE_ENV === 'production';

// 读取环境变量
// const envName = process.env.NAME;
// console.log('===envName', envName);

const config = smp.wrap({
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    version: '1.0',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        // 使用swc压缩
        minify: TerserPlugin.swcMinify,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: true,
              },
              transform: {
                legacyDecorator: true,
                react: {
                  runtime: 'automatic',
                },
              },
              // 以下配置需要先安装 @swc/helpers
              externalHelpers: true,
              target: 'es5',
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
            isModule: 'unknown',
            // minify: process.env.NODE_ENV !== "development",
          },
        },
      },
      {
        test: /(\.module)?\.less$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: {
                auto: true,
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /(\.module)?\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: {
                auto: true,
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataurlCondition: {
            maxSize: 1024, // 单位是B
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`,
    }),
    isProduction && new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    isProduction &&
      new PurgeCSSPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      }),
    new BundleAnalyzerPlugin({
      // 设置为false，禁止自动打开分析页面
      openAnalyzer: false,
    }),
  ].filter(Boolean),
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    compress: true,
    port: 8000,
    open: true,
  },
  devtool: 'eval-cheap-module-source-map',
});

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
