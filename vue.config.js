const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: "mapbox-gl"
      }),
      new webpack.EnvironmentPlugin(["MAPBOX_TOKEN"])
    ]
  },
  pwa: {
    assetsVersion: true,
    themeColor: "#42B983",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      name: "Native Vue Web Wrapper Demo",
      short_name: "Vue Demo"
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/workers.js"
    }
  },
  devServer: {
    https: true,
    public: "https://localhost:8080/"
  }
};
