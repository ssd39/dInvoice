const webpack = require("webpack");
module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
  };
  config.module.rules.unshift({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false, // disable the behavior
    },
  });
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.NormalModuleReplacementPlugin(/node:crypto/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
    })
  );
  return config;
};
