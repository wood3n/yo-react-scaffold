const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin"); //inline runtime chunk
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin"); //压缩JS代码
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //压缩CSS代码
const WebpackBar = require("webpackbar"); //打包进度条
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //清理build文件夹
const ManifestPlugin = require("webpack-manifest-plugin");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const cssModuleConfig = require("./config/cssModuleConfig");

module.exports = function(env) {
  const isDevelopment = env.NODE_ENV === "development";
  const isProduction = env.NODE_ENV === "production";
  return {
    mode: isProduction ? "production" : isDevelopment && "development",
    entry: "./src",
    output: {
      filename: isProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/bundle.js",
      chunkFilename: isProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      path: path.resolve(__dirname, "build"),
      pathinfo: false
    },
    optimization: {
      providedExports: isProduction,
      usedExports: isProduction,
      sideEffects: isProduction,
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      },
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      },
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          sourceMap: true
        }),
        new OptimizeCssAssetsPlugin({
          //压缩CSS
          assetNameRegExp: /\.css$/g,
          cssProcessor: require("cssnano"),
          cssProcessorPluginOptions: {
            preset: ["default", { discardComments: { removeAll: true } }]
          },
          canPrint: true
        })
      ],
      moduleIds: false
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      },
      modules: [
        path.resolve(__dirname, "./src/components"),
        path.resolve(__dirname, "./src"),
        path.resolve(__dirname, "node_modules")
      ],
      extensions: [".wasm", ".mjs", ".js", ".json", ".jsx", ".ts", ".tsx"],
      plugins: [PnpWebpackPlugin],
      symlinks: false
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)?$/,
          exclude: /(node_modules)/,
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false
                }
              ],
              ["@babel/preset-react"],
              ["@babel/preset-typescript"]
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
              "inline-react-svg",
              isDevelopment && require.resolve("react-refresh/babel"),
              [
                "module-resolver",
                {
                  alias: {
                    "@": "./src"
                  }
                }
              ],
              ["import", { libraryName: "antd", style: true }]
            ].filter(Boolean),
            cacheDirectory: true
          },
          resolve: {
            alias: {
              "@": path.resolve(__dirname, "src")
            },
            extensions: [".js", ".jsx", ".ts", ".tsx"]
          } //自动解析index.jsx文件，必须加上这一句，且".js"不能省略
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: cssModuleConfig(env)
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: cssModuleConfig(env, true)
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
          include: path.resolve(__dirname, "src/assets"),
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10 * 1024, //10KB
                name: "static/images/[name].[contenthash:8].[ext]"
              }
            },
            "cache-loader",
            {
              loader: "image-webpack-loader",
              options: {
                disable: isDevelopment //开发环境下禁用压缩图片
              }
            }
          ]
        },
        {
          test: [/\.ttf/i, /\.woff/i, /\.woff2/i, /\.eot/i, /\.otf/i],
          include: path.resolve(__dirname, "src/assets"),
          loader: "url-loader",
          options: {
            limit: 10 * 1024, //10KB
            name: "static/fonts/[name].[contenthash:8].[ext]"
          }
        }
      ]
    },
    plugins: [
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new WebpackBar(),
      new HtmlWebpackPlugin({
        inject: true,
        template: "./public/index.html",
        favicon: "./public/favicon.ico"
      }),
      isProduction &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      isProduction && new CleanWebpackPlugin(),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
        }),
      isProduction && new ManifestPlugin()
    ].filter(Boolean),
    devServer: {
      open: "chrome",
      compress: true,
      writeToDisk: false,
      hot: true,
      stats: "errors-only"
    }
  };
};
