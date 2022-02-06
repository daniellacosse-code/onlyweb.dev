module.exports = {
  globDirectory: ".",
  globPatterns: ["**/*.{json,css,js,png,html,wasm,md,ico,txt}"],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  inlineWorkboxRuntime: true,
  maximumFileSizeToCacheInBytes: 100000,
  mode: process.env.VERCEL_ENV,
  swDest: "static/sw.js"
};
