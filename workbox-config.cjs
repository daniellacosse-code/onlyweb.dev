module.exports = {
  globDirectory: ".",
  globPatterns: ["**/*.{json,css,js,png,html,wasm,md,ico,txt}"],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: "static/pwa/sw/sw.js"
};
