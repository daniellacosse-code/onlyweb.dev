const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

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
      projectName: "only web",
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
      name: "native vue web wrapper demo",
      short_name: "Only Web",
      start_url: "https://daniellacos.se/demo"
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/workers.js"
    }
  },
  devServer: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, ".ssl/local.key")),
      cert: fs.readFileSync(path.resolve(__dirname, ".ssl/local.crt"))
    },
    compress: true,
    host: "local.daniellacos.se",
    port: 8080,
    public: "https://local.daniellacos.se:8080/demo/"
  }
};
