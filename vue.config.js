module.exports = {
  pwa: {
    assetsVersion: true,
    themeColor: "#42B983",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      name: "Native Vue Web Wrapper Demo",
      short_name: "Vue Demo",
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/workers.js",
    },
  },
  // TODO: local CA to minimize dev friction - see https://github.com/jsha/minica
  devServer: {
    https: true,
    public: "https://localhost:8080/",
  },
};
