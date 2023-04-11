export default defineNuxtConfig({
  app: {
    pageTransition: false,
    layoutTransition: false
  },
  build: {
    analyze: {
      filename: ".output/{name}-bundle-analysis.html",
      open: true
    }
  },
  plugins: ["~/plugins/quagga.client.js"],
  postcss: {
    plugins: {
      "postcss-autoreset": {},
      "postcss-initial": {}
    }
  }
});
