module.exports = {
  globDirectory: ".",
  globPatterns: [
    "**/*.{vue,xml,json,css,js,png,html,info,code-workspace,lock,toml,rs,wasm,ts,md,ico,txt,cjs}"
  ],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: ".artifacts/workbox/sw.js"
};
