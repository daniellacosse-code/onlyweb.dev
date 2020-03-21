module.exports = {
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
  }
};
