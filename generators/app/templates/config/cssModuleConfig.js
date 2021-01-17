const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");

/**
 * CSS相关配置
 */
module.exports = function cssLoaderConfig(env, less = false) {
  const isDevelopment = env.NODE_ENV === "development";
  const isProduction = env.NODE_ENV === "production";

  const lessLoaderConfig = {
    loader: "less-loader", // compiles Less to CSS
    options: {
      lessOptions: {
        paths: [path.resolve(__dirname, "src")]
      }
    }
  };

  const cssModuleConfig = [
    isDevelopment && {
      loader: "style-loader"
    },
    isProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: true,
        publicPath: "../../"
      }
    },
    {
      loader: "css-loader",
      options: {
        esModule: true,
        modules: {
          localIdentName: isDevelopment
            ? "[path][name]__[local]"
            : "[hash:base64]"
        }
      }
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-flexbugs-fixes",
            "autoprefixer",
            "postcss-preset-env"
          ]
        }
      }
    }
  ];

  if (less) {
    return [...cssModuleConfig, lessLoaderConfig].filter(Boolean);
  }

  return cssModuleConfig.filter(Boolean);
};
