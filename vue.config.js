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
  pluginOptions: {
    meta: {
      projectName: "modern vue wrapper demo",
      url: "https://daniellacos.se/demo",
      description:
        "for your consideration - the case for 'only web', written in vue.js",
      socialImage: "img/apple-touch-icon-180x180.png"
    }
  },
  pwa: {
    assetsVersion: true,
    themeColor: "#42B983",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    manifestOptions: {
      name: "Native Vue Web Wrapper Demo",
      short_name: "Vue Demo",
      start_url: "https://daniellacos.se/demo"
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
