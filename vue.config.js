const webpack = require("webpack");

module.exports = {
  publicPath: "/demo",
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
    appleMobileWebAppStatusBarStyle: "black-translucent",
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
    public: "https://localhost:8080/demo/"
  }
};
