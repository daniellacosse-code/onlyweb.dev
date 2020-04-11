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
      socialImage: "img/architecture.png"
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
    compress: true,
    host: "local.daniellacos.se",
    port: 8080,
    public: "https://local.daniellacos.se:8080/demo/"
  }
};
